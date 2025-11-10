import { CONSTANTS } from './../shared/constants';
import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";

@customElement("page-conversations")
export class PageConversations extends LitElement {
  static styles = [unsafeCSS(componentsCSS)];

  private openDm(id: string) {
    navigate(`/dm/${id}`);
  }

  render() {
    return html`
      <section class="flow-column">
        <div class="card" @click=${() => this.openDm("1")}>
          <div class="chip-muted">${CONSTANTS.CONVERSATIONS_CARD_TITLE}</div>
          <strong>${CONSTANTS.CONVERSATIONS_MSG1_USERNAME}</strong>
          <p>${CONSTANTS.CONVERSATIONS_MSG1_TEXT}</p>
        </div>
        <div class="card" @click=${() => this.openDm("2")}>
          <strong>${CONSTANTS.CONVERSATIONS_MSG2_USERNAME}</strong>
          <p>${CONSTANTS.CONVERSATIONS_MSG2_TEXT}</p>
        </div>
      </section>
    `;
  }
}
