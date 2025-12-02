import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import pageConversationsCSS from "./page-conversations.css?inline";
import { customElement, state } from "lit/decorators.js";
import { navigate } from "../router";
import { ScrollPage } from "../shared/scroll-page";
import "../components/app-mini-profile";
import { messageService } from "../servicios/core/message-service";
import type { Conversation } from "../modelos/conversation";
import { authStore } from "../state/auth-store";
import { CONSTANTS } from "./../shared/constants";

@customElement("page-conversations")
export class PageConversations extends ScrollPage {
  @state() private conversations: Conversation[] = [];
  @state() private isLoading = false;
  @state() private loadError = false;

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageConversationsCSS)];

  private openDm(id: string) {
    navigate(`/dm/${id}`);
  }

  private async loadConversations() {
    this.isLoading = true;
    this.loadError = false;
    const userId = authStore.currentUserId || "me";
    try {
      this.conversations = await messageService.listConversations(userId);
    } catch {
      this.conversations = [];
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  }

  protected firstUpdated(): void {
    this.loadConversations();
    this.restoreScrollIfNeeded("/messages");
  }

  render() {
    const currentUser = authStore.currentUserId || CONSTANTS.CURRENT_USER_ID;
    const showNoResults =
      !this.isLoading &&
      (this.loadError || this.conversations.length === 0);

    return html`
      <section class="flow-column component-container">
        ${this.isLoading
          ? html`<div class="card no-results">Cargando...</div>`
          : null}
        ${showNoResults
          ? html`<div class="card no-results">
              ${CONSTANTS.NO_RESULTS_TEXT}
            </div>`
          : null}
        ${this.conversations.map(
          (conversation) => {
            const otherUserRaw =
              conversation.participantA === currentUser
                ? conversation.participantB
                : conversation.participantA;
            const otherUser = otherUserRaw || CONSTANTS.CURRENT_USER_ID;
            const username = otherUser.startsWith(CONSTANTS.USERNAME_PREFIX)
              ? otherUser
              : `${CONSTANTS.USERNAME_PREFIX}${otherUser}`;
            return html`
              <div
                class="card"
                @click=${() => this.openDm(conversation.id)}
              >
                <app-mini-profile
                  .username=${username}
                  .profileId=${otherUser}
                  .supressProfileRoute=${true}
                  .noSubtitle=${true}
                ></app-mini-profile>
                <p class="chip-muted">${conversation.updatedAt}</p>
              </div>
            `;
          },
        )}
      </section>
    `;
  }
}
