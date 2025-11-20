import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";

@customElement("page-direct-message")
export class PageDirectMessage extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @state() draft = "";

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

  render() {
    const id = this.params?.id ?? "";
    return html`
      <section class="component-container">
        <app-mini-profile></app-mini-profile>
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
