import { html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import pageConversationsCSS from "../css/page-conversations.css?inline";
import { customElement, state } from "lit/decorators.js";
import { navigate } from "../router";
import { ScrollPage } from "../shared/scroll-page";
import "../components/app-mini-profile";
import "../components/app-fallback";
import { messageService } from "../servicios/core/message-service";
import { profileService } from "../servicios/core/profile-service";
import type { Conversation } from "../modelos/conversation";
import type { UserProfile } from "../modelos/user-profile";
import { authStore } from "../state/auth-store";
import { CONSTANTS } from "./../shared/constants";
import { formatTimestamp } from "../shared/dates";

@customElement("page-conversations")
export class PageConversations extends ScrollPage {
  @state() private conversations: Conversation[] = [];
  @state() private isLoading = false;
  @state() private loadError = false;
  @state() private participantProfiles: Record<string, UserProfile> = {};

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageConversationsCSS)];

  private openDm(visibleUsername: string) {
    navigate(`/dm/${visibleUsername}`);
  }

  private async loadConversations() {
    this.isLoading = true;
    this.loadError = false;
    const userId = authStore.currentUserId || "me";
    const conversations = await messageService
      .listConversations(userId)
      .finally(() => {
        this.isLoading = false;
      });
    this.conversations = conversations;
    this.loadParticipantProfiles(conversations, userId);
  }

  private async loadParticipantProfiles(
    conversations: Conversation[],
    currentUser: string
  ) {
    const ids = new Set<string>();
    conversations.forEach((conversation) => {
      if (conversation.participantA) {
        ids.add(conversation.participantA);
      }
      if (conversation.participantB) {
        ids.add(conversation.participantB);
      }
    });
    ids.delete(currentUser);
    for (const id of ids) {
      if (!id || this.participantProfiles[id]) continue;
      try {
        const profile = await profileService.fetchProfile(id);
        this.participantProfiles = {
          ...this.participantProfiles,
          [id]: profile,
        };
      } catch (error) {
        console.warn("No se pudo cargar el perfil", id, error);
      }
    }
  }

  protected firstUpdated(): void {
    this.loadConversations();
    this.restoreScrollIfNeeded("/messages");
  }

  render() {
    const currentUser = authStore.currentUserId || CONSTANTS.CURRENT_USER_ID;
    const showNoResults =
      !this.isLoading && (this.loadError || this.conversations.length === 0);

    return html`
      <section class="flow-column component-container">
        ${this.isLoading
          ? html`<app-fallback type="loading"></app-fallback>`
          : null}
        ${showNoResults
          ? html`<app-fallback
              type="empty"
              message=${CONSTANTS.NO_RESULTS_TEXT}
            ></app-fallback>`
          : null}
        ${this.conversations.map((conversation) => {
          const otherUserRaw =
            conversation.participantA === currentUser
              ? conversation.participantB
              : conversation.participantA;
          const otherUser = otherUserRaw || CONSTANTS.CURRENT_USER_ID;
          const profile = this.participantProfiles[otherUser];
          const username = profile
            ? profile.username.replace(/^@/, "")
            : otherUser.replace(/^@/, "");
          const subtitle = profile?.subtitle ?? "";
          const avatar = profile?.avatarUrl ?? "";
          const cleanUsername =
            username ||
            otherUser.replace(/^@/, "") ||
            CONSTANTS.CURRENT_USER_ID;
          return html`
            <div class="card" @click=${() => this.openDm(cleanUsername)}>
              <app-mini-profile
                .username=${username}
                .subtitle=${subtitle}
                .profileId=${otherUser}
                .avatarUrl=${avatar}
                .supressProfileRoute=${true}
                .noSubtitle=${!subtitle}
              ></app-mini-profile>
              <p class="chip-muted">
                ${formatTimestamp(conversation.updatedAt)}
              </p>
            </div>
          `;
        })}
      </section>
    `;
  }
}
