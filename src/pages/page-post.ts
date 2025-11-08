import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONSTANTS
} from "../shared/constants";

@customElement("page-post")
export class PagePost extends LitElement {
  @property({ attribute: false }) params?: { id?: string };

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .back {
        font-size: 0.8rem;
        color: var(--muted-foreground);
        cursor: pointer;
        margin-bottom: 0.4rem;
      }
    `,
  ];

  private goBack() {
    navigate("/feed");
  }

  render() {
    const id = this.params?.id ?? "";
    return html`
      <div class="back" @click=${this.goBack}>${CONSTANTS.POST_BACK_TO_FEED}</div>
      <div class="card">
        <div class="chip-muted">${CONSTANTS.POST_CHIP_LABEL_PREFIX} ${id}</div>
        <h2>${CONSTANTS.POST_TITLE}</h2>
        <p>${CONSTANTS.POST_BODY}</p>
      </div>
    `;
  }
}
