import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, state } from "lit/decorators.js";
import { AppLocation, parseLocation } from "../router";
import "./app-toolbar";
import "./app-bottom-nav";
import "../pages/page-login";
import "../pages/page-feed";
import "../pages/page-post";
import "../pages/page-search";
import "../pages/page-conversations";
import "../pages/page-direct-message";
import "../pages/page-profile";
import "../pages/page-profile-settings";
import "../pages/page-not-found";
import { CONSTANTS } from "../shared/constants";
import { authStore } from "../state/auth-store";


@customElement("app-root")
export class AppRoot extends LitElement {
  @state() location: AppLocation = parseLocation(location.pathname);

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.onPopState);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.onPopState);
    super.disconnectedCallback();
  }

  private onPopState = () => {
    this.location = parseLocation(location.pathname);
  };

  private getTitle(): string {
    switch (this.location.route) {
      case "feed":
        return CONSTANTS.TITLE_FEED;
      case "post":
        return CONSTANTS.TITLE_POST;
      case "new-post":
        return CONSTANTS.TITLE_NEW_POST;
      case "search":
        return CONSTANTS.TITLE_SEARCH;
      case "conversations":
        return CONSTANTS.TITLE_CONVERSATIONS;
      case "dm":
        return CONSTANTS.TITLE_DM;
      case "profile":
        return CONSTANTS.TITLE_PROFILE;
      case "profile-settings":
        return CONSTANTS.TITLE_PROFILE_SETTINGS;
      default:
        return "";
    }
  }

  private renderPage() {
    if (!authStore.isAuthenticated && this.location.route !== "login") {
      return html`<page-login></page-login>`;
    }

    switch (this.location.route) {
      case "login":
        return html`<page-login></page-login>`;
      case "feed":
        return html`<page-feed></page-feed>`;
      case "post":
        return html`<page-post .params=${this.location.params}></page-post>`;
      case "new-post":
        return html`<page-new-post></page-new-post>`;
      case "search":
        return html`<page-search></page-search>`;
      case "conversations":
        return html`<page-conversations></page-conversations>`;
      case "dm":
        return html`<page-direct-message
          .params=${this.location.params}
        ></page-direct-message>`;
      case "profile":
        return html`<page-profile
          .params=${this.location.params}
        ></page-profile>`;
      case "profile-settings":
        return html`<page-profile-settings></page-profile-settings>`;
      default:
        return html`<page-not-found></page-not-found>`;
    }
  }

  static styles = [unsafeCSS(layoutCSS)];

  render() {
    const isAuth = authStore.isAuthenticated;
    const showChrome = isAuth && this.location.route !== "login";

    return html`
      <div class="app-shell">
        ${showChrome
          ? html`<app-toolbar .title=${this.getTitle()}></app-toolbar>`
          : html`<div style="height:var(--toolbar-height)"></div>`}
        <main class="app-main">${this.renderPage()}</main>
        ${showChrome
          ? html`<app-bottom-nav></app-bottom-nav>`
          : html`<div style="height:var(--bottom-nav-height)"></div>`}
      </div>
    `;
  }
}
