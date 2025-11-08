import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import {
  CONSTANTS
} from "../shared/constants";

@customElement("page-search")
export class PageSearch extends LitElement {
  createRenderRoot() {
    return this;
  }

  static styles = [unsafeCSS(componentsCSS)];

  render() {
    return html`
      <section class="flow-column">
        <input class="input" placeholder=${CONSTANTS.SEARCH_INPUT_PLACEHOLDER} />
        <div class="card">
          <div class="chip-muted">${CONSTANTS.SEARCH_POPULAR_TITLE}</div>
          <p>${CONSTANTS.SEARCH_POPULAR_TEXT}</p>
        </div>
      </section>
    `;
  }
}
