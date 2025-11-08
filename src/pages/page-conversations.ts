import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONVERSATIONS_CARD_TITLE,
  CONVERSATIONS_MSG1_USERNAME,
  CONVERSATIONS_MSG1_TEXT,
  CONVERSATIONS_MSG2_USERNAME,
  CONVERSATIONS_MSG2_TEXT,
} from "../shared/constants";

@customElement("page-conversations")
export class PageConversations extends LitElement {
  createRenderRoot() {
    return this;
  }

  static styles = [unsafeCSS(componentsCSS)];

  private openDm(id: string) {
    navigate(`/dm/${id}`);
  }

  render() {
    return html`
      <section class="flow-column">
        <div class="card" @click=${() => this.openDm("1")}>
          <div class="chip-muted">${CONVERSATIONS_CARD_TITLE}</div>
          <strong>${CONVERSATIONS_MSG1_USERNAME}</strong>
          <p>${CONVERSATIONS_MSG1_TEXT}</p>
        </div>
        <div class="card" @click=${() => this.openDm("2")}>
          <strong>${CONVERSATIONS_MSG2_USERNAME}</strong>
          <p>${CONVERSATIONS_MSG2_TEXT}</p>
        </div>
      </section>
    `;
  }
}
