import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import pageDirectMessageCSS from "../css/page-direct-message.css?inline";
import { customElement, property, state, query } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import "../components/app-mini-profile";
import { messageService } from "../servicios/core/message-service";
import { profileService } from "../servicios/core/profile-service";
import type { DirectMessage } from "../modelos/direct-message";
import type { UserProfile } from "../modelos/user-profile";
import { authStore } from "../state/auth-store";

@customElement("page-direct-message")
export class PageDirectMessage extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @state() draft = "";
  @state() private thread: DirectMessage[] = [];
  @state() private participantProfile?: UserProfile;
  @state() private participantUserId: string = "";
  @query(".thread") private threadEl?: HTMLDivElement;
  private currentConversationId = "";
  // last processed route param to avoid re-loading on internal state updates
  private lastLoadedParam = "";
  @state() private isLoading = false;
  @state() private loadError = false;

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageDirectMessageCSS)];

  private async loadThread(userId: string) {
    if (!userId) return;
    this.isLoading = true;
    this.loadError = false;
    try {
      // If the route param is a username (starts with prefix), resolve to profile first
      let profile: UserProfile | undefined;
      if (userId.startsWith(CONSTANTS.USERNAME_PREFIX)) {
        profile = await profileService.fetchProfile(userId);
      }

      // If we resolved a profile, use its id; otherwise assume param is a conversationId
      if (profile) {
        // store participant info for display
        this.participantProfile = profile;
        // create or get conversation between current user and the participant (backend expects IDs)
        const currentUser = authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID;
        // createConversation returns a Conversation object with id
        const conv = await messageService.createConversation(currentUser, profile.id);
        this.currentConversationId = conv.id;
        this.thread = await messageService.fetchThread(conv.id);
        this.participantUserId = profile.id;
      } else {
        // param wasn't a username; treat it as conversation id
        const conversationId = userId;
        this.currentConversationId = conversationId;
        this.thread = await messageService.fetchThread(conversationId);
        // try to infer participant profile from thread if available
        if (this.thread.length > 0) {
          const other = this.thread.find(m => m.fromUserId !== (authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID))
            || this.thread.find(m => m.toUserId !== (authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID));
          if (other) {
            const otherId = other.fromUserId === (authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID) ? other.toUserId : other.fromUserId;
            try {
              this.participantProfile = await profileService.fetchProfile(otherId);
              this.participantUserId = otherId;
            } catch (err) {
              // ignore profile fetch error
            }
          }
        }
      }
    } finally {
      this.isLoading = false;
    }
  }

  private async send(e: Event) {
    e.preventDefault();
    const text = this.draft.trim();
    if (!text) return;
    // Ensure we have a conversation id (UUID) to send to backend
    let conversationId = this.currentConversationId;
    // If we don't have conversation id but know the participant (username param), create/get conversation
    if (!conversationId) {
      const participantParam = this.params?.id ?? "";
      let participantId = this.participantUserId;
      if (!participantId && participantParam) {
        if (participantParam.startsWith(CONSTANTS.USERNAME_PREFIX)) {
          const p = await profileService.fetchProfile(participantParam);
          participantId = p.id;
          this.participantProfile = p;
        } else {
          // if param looks like a conversation id, we can't create conversation from it
          participantId = participantParam;
        }
      }
      if (participantId) {
        const currentUser = authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID;
        const conv = await messageService.createConversation(currentUser, participantId);
        conversationId = conv.id;
        this.currentConversationId = conv.id;
      }
    }

    const { profileId } = this.getParticipantInfo();
    const message = await messageService.sendMessage(
      conversationId ?? (authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID),
      authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID,
      profileId || (this.participantUserId ?? this.params?.id ?? CONSTANTS.CURRENT_USER_ID),
      text
    );
    this.thread = [...this.thread, message];
    this.draft = "";
    this.loadError = false;
  }

  private onInput(e: Event) {
    this.draft = (e.target as HTMLInputElement).value;
  }

  private scrollToBottom() {
    if (this.threadEl) {
      this.threadEl.scrollTop = this.threadEl.scrollHeight;
    }
  }

  protected willUpdate(_changed: Map<string, unknown>) {
    const paramId = this.params?.id ?? CONSTANTS.CURRENT_USER_ID;
    const cleanParamId = paramId.replace(/^@/, "");
    
    // If param has @, redirect to clean URL
    if (paramId !== cleanParamId) {
      window.history.replaceState(null, "", `/dm/${cleanParamId}`);
    }
    
    if (cleanParamId !== this.lastLoadedParam) {
      this.lastLoadedParam = cleanParamId;
      this.loadThread(cleanParamId);
    }
  }

  protected firstUpdated() {
    this.scrollToBottom();
  }

  protected updated() {
    this.scrollToBottom();
  }

  private getParticipantInfo() {
    if (this.participantProfile) {
      return {
        username: this.participantProfile.username.replace(/^@/, ""),
        subtitle: this.participantProfile.subtitle,
        profileId: this.participantProfile.id,
      };
    }
    const conversationId = this.params?.id ?? "";
    const profileId = conversationId ? conversationId.replace(/^@/,"") : CONSTANTS.CURRENT_USER_ID;
    const username = profileId;

    return {
      username,
      subtitle: "",
      profileId,
    };
  }

  render() {
    const { username, subtitle, profileId } = this.getParticipantInfo();

    return html`
      <section class="component-container">
        <app-mini-profile
          .username=${username}
          .subtitle=${subtitle}
          .profileId=${profileId}
        ></app-mini-profile>
        <div class="thread">
          ${this.isLoading
            ? html`<div class="no-results">Cargando...</div>`
            : null}
          ${!this.isLoading &&
          (this.loadError || this.thread.length === 0)
            ? html`<div class="no-results">${CONSTANTS.NO_RESULTS_TEXT}</div>`
            : null}
          ${!this.isLoading && this.thread.length > 0
            ? this.thread.map((message) => {
                const isMe =
                  message.fromUserId ===
                  (authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID);
                const className = isMe ? "msg-me" : "msg-other";
                return html`<div class=${className}>${message.text}</div>`;
              })
            : null}
        </div>
        <form @submit=${this.send} class="send-message-form">
          <input
            class="input send-input"
            placeholder=${CONSTANTS.DM_INPUT_PLACEHOLDER}
            .value=${this.draft}
            @input=${this.onInput}
          />
          <div class="send-button-container">
            <button class="btn btn-sm send-button" type="submit">
              ${CONSTANTS.DM_SEND_BUTTON}
            </button>
          </div>
        </form>
      </section>
    `;
  }
}
