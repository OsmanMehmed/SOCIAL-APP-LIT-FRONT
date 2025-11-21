import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property, state, query } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import { navigate } from "../router";
import "../components/app-mini-profile";

@customElement("page-direct-message")
export class PageDirectMessage extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @state() draft = "";
  @query(".thread") private threadEl?: HTMLDivElement;

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

      .back {
        font-size: 1rem;
        color: var(--muted-foreground);
        cursor: pointer;
        margin-bottom: 0.8rem;
        width: fit-content;
      }

      .thread {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-block: 2rem;
        overflow-x: hidden;
        max-height: 80%;
        padding-inline: 1em;
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

  private send(e: Event) {
    e.preventDefault();
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

  protected firstUpdated() {
    this.scrollToBottom();
  }

  protected updated() {
    this.scrollToBottom();
  }

  private goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/messages");
    }
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
        <div class="back" @click=${this.goBack}>
          ${CONSTANTS.POST_BACK_TO_FEED}
        </div>
        <app-mini-profile
          .username=${username}
          .subtitle=${subtitle}
          .profileId=${profileId}
        ></app-mini-profile>
        <div class="thread">
          <div class="msg-other">Tip anterior sobre la receta.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-other">Tip anterior sobre la receta.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
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
