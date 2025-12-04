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
  @query(".thread") private threadEl?: HTMLDivElement;
  private currentConversationId = "";
  @state() private isLoading = false;
  @state() private loadError = false;

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageDirectMessageCSS)];

  private async loadThread(conversationId: string) {
    if (!conversationId) return;
    this.currentConversationId = conversationId;
    this.isLoading = true;
    this.loadError = false;
    try {
      this.thread = await messageService.fetchThread(conversationId);
      this.participantProfile = await profileService.fetchProfile(conversationId);
    } finally {
      this.isLoading = false;
    }
  }

  private async send(e: Event) {
    e.preventDefault();
    const text = this.draft.trim();
    if (!text) return;
    const conversationId = this.params?.id ?? CONSTANTS.CURRENT_USER_ID;
    const { profileId } = this.getParticipantInfo();
    const message = await messageService.sendMessage(
      conversationId,
      authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID,
      profileId || conversationId,
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
    const id = this.params?.id ?? CONSTANTS.CURRENT_USER_ID;
    if (id !== this.currentConversationId) {
      this.loadThread(id);
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
        username: this.participantProfile.username,
        subtitle: this.participantProfile.subtitle,
        profileId: this.participantProfile.id,
      };
    }
    const conversationId = this.params?.id ?? "";
    const profileId = conversationId || CONSTANTS.CURRENT_USER_ID;
    const username = profileId.startsWith(CONSTANTS.USERNAME_PREFIX)
      ? profileId
      : `${CONSTANTS.USERNAME_PREFIX}${profileId}`;

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
