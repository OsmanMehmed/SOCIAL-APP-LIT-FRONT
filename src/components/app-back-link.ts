import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("app-back-link")
export class AppBackLink extends LitElement {
  @property() fallback = "/feed";

  static styles = [
    unsafeCSS(layoutCSS),
    css`
      :host {
        display: block;
      }

      .back-wrap {
        width: 82%;
        margin: 0.35rem auto 0;
        display: flex;
        align-items: center;
      }

      .back {
        font-size: 1rem;
        color: var(--muted-foreground);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
    `,
  ];

  private goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(this.fallback || "/feed");
    }
  }

  render() {
    return html`
      <div class="back-wrap">
        <div class="back" @click=${this.goBack}>
          <span>${CONSTANTS.POST_BACK_TO_FEED}</span>
        </div>
      </div>
    `;
  }
}
