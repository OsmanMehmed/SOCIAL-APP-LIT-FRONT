import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import "./app-icon-button";
import "./app-avatar";

@customElement("app-toolbar")
export class AppToolbar extends LitElement {
  @property() title = "";

  private logout() {
    navigate("/login");
  }

  static styles = [unsafeCSS(layoutCSS)];

  render() {
    return html`
      <header class="toolbar">
        <div class="page-title">${this.title}</div>
        <app-icon-button
          label=${CONSTANTS.TOOLBAR_LABEL_LOGOUT}
          @click=${this.logout}
        >
          <sl-icon name="box-arrow-left"></sl-icon>
        </app-icon-button>
      </header>
    `;
  }
}
