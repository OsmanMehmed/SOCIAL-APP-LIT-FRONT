import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONSTANTS
} from "../shared/constants";

@customElement("page-not-found")
export class PageNotFound extends LitElement {
  static styles = [unsafeCSS(componentsCSS)];

  render() {
    return html`
      <div class="card">
        <div class="chip-muted">${CONSTANTS.NOT_FOUND_404}</div>
        <p>${CONSTANTS.NOT_FOUND_TEXT}</p>
        <button class="btn btn-sm" @click=${() => navigate("/feed")}>
          ${CONSTANTS.NOT_FOUND_BACK_BUTTON}
        </button>
      </div>
    `;
  }
}
