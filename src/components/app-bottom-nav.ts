import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import "./app-icon-button";

@customElement("app-bottom-nav")
export class AppBottomNav extends LitElement {
  createRenderRoot() {
    return this;
  }

  static styles = [unsafeCSS(layoutCSS)];

  render() {
    return html`
      <nav class="bottom-nav">
        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_HOME}
          @click=${() => navigate("/feed")}
          >🏠</app-icon-button
        >
        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_SEARCH}
          @click=${() => navigate("/search")}
          >🔍</app-icon-button
        >
        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_NEW_RECIPE}
          @click=${() => navigate("/post/new")}
          >➕</app-icon-button
        >
        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_MESSAGES}
          @click=${() => navigate("/messages")}
          >💌</app-icon-button
        >
        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_PROFILE}
          @click=${() => navigate("/profile/me")}
          >👨‍🍳</app-icon-button
        >
      </nav>
    `;
  }
}
