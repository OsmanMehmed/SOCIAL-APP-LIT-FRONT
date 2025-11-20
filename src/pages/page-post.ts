import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("page-post")
export class PagePost extends LitElement {
  @property({ attribute: false }) params?: { id?: string };

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .component-container {
        justify-self: center;
        min-width: 28em;
        max-width: 90em;
        width: 60%;
        padding-right: 1.5em;
      }

      .back {
        font-size: 1rem;
        color: var(--muted-foreground);
        cursor: pointer;
        margin-bottom: 0.4rem;
      }
    `,
  ];

  private goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/feed");
    }
  }

  render() {
    const id = this.params?.id ?? "";
    return html`
      <div class="component-container">
        <div class="back" @click=${this.goBack}>
          ${CONSTANTS.POST_BACK_TO_FEED}
        </div>
        <div class="card">
          <div class="chip-muted">
            ${CONSTANTS.POST_CHIP_LABEL_PREFIX} ${id}
          </div>
          <h2>${CONSTANTS.POST_TITLE}</h2>
          <p>${CONSTANTS.POST_BODY}</p>
        </div>
      </div>
    `;
  }
}
