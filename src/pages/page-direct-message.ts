import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property, state, query } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import "../components/app-mini-profile";
import { messageService } from "../servicios/core/message-service";
import type { DirectMessage } from "../modelos/direct-message";

@customElement("page-direct-message")
export class PageDirectMessage extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @state() draft = "";
  @state() private thread: DirectMessage[] = [];
  @query(".thread") private threadEl?: HTMLDivElement;
  private currentConversationId = "";

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .component-container {
        justify-self: center;
        min-width: 20em;
        max-width: 40em;
        height: 90%;
        width: 60%;
      }

      .thread {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-block: 2rem;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 80%;
        padding-inline: 1em;
        padding-block: 1.25rem;
        position: relative;
        --thread-fade-color: rgba(250, 232, 222, 0.96);
        -webkit-mask-image: linear-gradient(
          to bottom,
          transparent 0,
          #000 24px,
          #000 calc(100% - 24px),
          transparent 100%
        );
        mask-image: linear-gradient(
          to bottom,
          transparent 0,
          #000 24px,
          #000 calc(100% - 24px),
          transparent 100%
        );
        mask-repeat: no-repeat;
        mask-size: 100% 100%;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
      }

      .thread::before,
      .thread::after {
        content: "";
        position: sticky;
        display: block;
        left: 0;
        right: 0;
        height: 1.4rem;
        pointer-events: none;
        z-index: 2;
      }

      .thread::before {
        top: 0;
        background: linear-gradient(
          to bottom,
          var(--thread-fade-color),
          rgba(250, 244, 239, 0)
        );
      }

      .thread::after {
        bottom: 0;
        background: linear-gradient(
          to top,
          var(--thread-fade-color),
          rgba(250, 244, 239, 0)
        );
      }

      .msg-other {
        padding: 0.35rem 0.6rem;
        border-radius: var(--radius-md);
        background: var(--color-tertiary);
        font-size: 0.8rem;
        max-width: 70%;
      }

      .msg-me {
        padding: 0.35rem 0.6rem;
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        max-width: 70%;
        align-self: flex-end;
        background: var(--color-quinary);
        color: #290202;
      }

      form {
        display: flex;
        gap: 0.35rem;
        align-items: center;
      }

      input {
        flex: 1;
      }

      .send-input {
      }

      .send-message-form {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }

      .send-button {
        width: 9em;
      }

      .send-button-container {
        width: 100%;
        text-align: right;
      }
    `,
  ];

  private async loadThread(conversationId: string) {
    if (!conversationId) return;
    this.currentConversationId = conversationId;
    this.thread = await messageService.fetchThread(conversationId);
  }

  private async send(e: Event) {
    e.preventDefault();
    const text = this.draft.trim();
    if (!text) return;
    const conversationId = this.params?.id ?? CONSTANTS.CURRENT_USER_ID;
    const { profileId } = this.getParticipantInfo();
    const message = await messageService.sendMessage(
      conversationId,
      CONSTANTS.CURRENT_USER_ID,
      profileId || conversationId,
      text
    );
    this.thread = [...this.thread, message];
    this.draft = "";
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
    const conversationId = this.params?.id ?? "";
    const map: Record<
      string,
      { username: string; subtitle: string; profileId: string }
    > = {
      "1": {
        username: CONSTANTS.CONVERSATIONS_MSG1_USERNAME,
        subtitle: CONSTANTS.CONVERSATIONS_MSG1_SUBTITLE,
        profileId: CONSTANTS.CONVERSATIONS_MSG1_USERNAME.replace(
          CONSTANTS.USERNAME_PREFIX,
          ""
        ),
      },
      "2": {
        username: CONSTANTS.CONVERSATIONS_MSG2_USERNAME,
        subtitle: CONSTANTS.CONVERSATIONS_MSG2_SUBTITLE,
        profileId: CONSTANTS.CONVERSATIONS_MSG2_USERNAME.replace(
          CONSTANTS.USERNAME_PREFIX,
          ""
        ),
      },
    };

    if (conversationId in map) {
      return map[conversationId];
    }

    const profileId = conversationId || CONSTANTS.CURRENT_USER_ID;
    const username = profileId.startsWith(CONSTANTS.USERNAME_PREFIX)
      ? profileId
      : `${CONSTANTS.USERNAME_PREFIX}${profileId}`;

    return {
      username,
      subtitle: CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT,
      profileId,
    };
  }

  render() {
    const { username, subtitle, profileId } = this.getParticipantInfo();

    return html`
      <section class="component-container">
        <app-mini-profile
          .username=${username}
          .noSubtitle=${true}
          .profileId=${profileId}
        ></app-mini-profile>
                <div class="thread">
          ${this.thread.map((message) => {
            const isMe = message.fromUserId === CONSTANTS.CURRENT_USER_ID;
            const className = isMe ? "msg-me" : "msg-other";
            return html`<div class=${className}>${message.text}</div>`;
          })}
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

