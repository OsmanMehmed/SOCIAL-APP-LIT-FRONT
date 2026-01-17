import { LitElement, html, unsafeCSS, css } from "lit";
import componentsCSS from "../css/components.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("page-not-found")
export class PageNotFound extends LitElement {
  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .page-not-found {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 20%;
        width: 50%;
        place-self: center;
      }
    `,
  ];

  render() {
    return html`
      <div class="card page-not-found">
        <div class="chip-muted">${CONSTANTS.NOT_FOUND_404}</div>
        <p>${CONSTANTS.NOT_FOUND_TEXT}</p>
        <button class="btn btn-sm" @click=${() => navigate("/feed")}>
          ${CONSTANTS.NOT_FOUND_BACK_BUTTON}
        </button>
      </div>
    `;
  }
}
