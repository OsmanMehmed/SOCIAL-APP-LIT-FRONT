import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONSTANTS
} from "../shared/constants";
import "./app-icon-button";
import "./app-avatar";

@customElement("app-toolbar")
export class AppToolbar extends LitElement {
  @property() title = "";

  createRenderRoot() {
    return this;
  }

  private goSearch() {
    navigate("/search");
  }

  private goMessages() {
    navigate("/messages");
  }

  private goProfile() {
    navigate("/profile/me");
  }

  static styles = [unsafeCSS(layoutCSS)];

  render() {
    return html`
      <header class="toolbar">
        <div class="page-title">${this.title}</div>
        <div style="display:flex;gap:0.25rem;">
          <app-icon-button
            label=${CONSTANTS.TOOLBAR_LABEL_SEARCH_RECIPES}
            @click=${this.goSearch}
            >🔍</app-icon-button
          >
          <app-icon-button
            label=${CONSTANTS.TOOLBAR_LABEL_MESSAGES}
            @click=${this.goMessages}
            >💌</app-icon-button
          >
          <app-icon-button
            label=${CONSTANTS.TOOLBAR_LABEL_PROFILE}
            @click=${this.goProfile}
            >👨‍🍳</app-icon-button
          >
        </div>
      </header>
    `;
  }
}
