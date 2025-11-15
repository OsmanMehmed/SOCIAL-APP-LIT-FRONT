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
      .thread {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-block: 2rem;
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
      <section>
        <app-mini-profile></app-mini-profile>
        <div class="thread">
          <div class="msg-other">Tip anterior sobre la receta.</div>
          <div class="msg-me">Gracias, salió increíble.</div>
        </div>
        <form @submit=${this.send}>
          <input
            class="input"
            placeholder=${CONSTANTS.DM_INPUT_PLACEHOLDER}
            .value=${this.draft}
            @input=${this.onInput}
          />
          <button class="btn btn-sm" type="submit">${CONSTANTS.DM_SEND_BUTTON}</button>
        </form>
      </section>
    `;
  }
}
