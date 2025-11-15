import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONSTANTS
} from "../shared/constants";

@customElement("page-new-post")
export class PageNewPost extends LitElement {

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      
    `,
  ];

  render() {
    return html`
      <div class="card">
        <div class="chip-muted">${CONSTANTS.POST_CHIP_LABEL_PREFIX}</div>
        <h2>${CONSTANTS.POST_TITLE}</h2>
        <p>${CONSTANTS.POST_BODY}</p>
      </div>
    `;
  }
}