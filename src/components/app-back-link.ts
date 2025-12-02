import { LitElement, html, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import backLinkCSS from "../styles/components/app-back-link.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("app-back-link")
export class AppBackLink extends LitElement {
  @property() fallback = "/feed";

  static styles = [unsafeCSS(layoutCSS), unsafeCSS(backLinkCSS)];

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
