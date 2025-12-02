import { LitElement, html, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, state } from "lit/decorators.js";
import { AppLocation, parseLocation } from "../router";
import { authStore } from "../state/auth-store";
import "./app-toolbar";
import "./app-bottom-nav";
import "./app-back-link";
import "../pages/page-login";
import "../pages/page-feed";
import "../pages/page-post";
import "../pages/page-new-post";
import "../pages/page-search";
import "../pages/page-conversations";
import "../pages/page-direct-message";
import "../pages/page-profile";
import "../pages/page-profile-settings";
import "../pages/page-not-found";
import { CONSTANTS } from "../shared/constants";

@customElement("app-root")
export class AppRoot extends LitElement {
  @state() location: AppLocation = parseLocation(location.pathname);
  private currentPath = location.pathname;
  private scrollPositions = new Map<string, number>();
  private navType: "push" | "pop" = "push";
  private forceClearNextNav = false;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.onPopState);
    window.addEventListener(
      "app:navigate-start",
      this.onNavigateStart as EventListener,
    );
    window.addEventListener(
      "app:clear-scroll",
      this.onClearScroll as EventListener,
    );
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.onPopState);
    window.removeEventListener(
      "app:navigate-start",
      this.onNavigateStart as EventListener,
    );
    window.removeEventListener(
      "app:clear-scroll",
      this.onClearScroll as EventListener,
    );
    super.disconnectedCallback();
  }

  private onClearScroll = () => {
    this.forceClearNextNav = true;
    this.resetAllScroll();
  };

  private onNavigateStart = () => {
    this.navType = "push";
    if (this.forceClearNextNav) {
      this.resetAllScroll();
      this.forceClearNextNav = false;
      return;
    }
    this.saveScroll(this.currentPath);
  };

  private onPopState = () => {
    this.navType = "pop";
    this.location = parseLocation(location.pathname);
    this.currentPath = location.pathname;
    console.log(`[app-root] onPopState detected, navType=pop, path=${this.currentPath}`);
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

  private getMainEl(): HTMLElement | null {
    return this.shadowRoot?.querySelector(".app-main") as HTMLElement | null;
  }

  private saveScroll(path: string) {
    const main = this.getMainEl();
    if (!main || !path) return;
    const top = main.scrollTop;
    this.scrollPositions.set(path, top);
    try {
      sessionStorage.setItem(`scroll:${path}`, String(top));
      console.log(`[app-root] Saved scroll for ${path}: ${top}`);
    } catch {}
  }

  private resetScrollForPath(path: string) {
    const main = this.getMainEl();
    if (main) {
      main.scrollTop = 0;
    }
    this.scrollPositions.delete(path);
    try {
      sessionStorage.removeItem(`scroll:${path}`);
    } catch {}
  }

  private clearScrollStorageExcept(pathsToKeep: string[]) {
    const keepScroll = new Set(pathsToKeep.map((p) => `scroll:${p}`));
    const keepProfile = new Set(
      pathsToKeep
        .map((p) => (p.startsWith("/profile/") ? p.split("/")[2] : null))
        .filter((id): id is string => Boolean(id))
        .map((id) => `profile:posts-scroll:${id}`),
    );

    try {
      const toRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (!key) continue;
        const isScroll = key.startsWith("scroll:");
        const isProfile = key.startsWith("profile:posts-scroll:");
        if (
          (isScroll && !keepScroll.has(key)) ||
          (isProfile && !keepProfile.has(key))
        ) {
          toRemove.push(key);
        }
      }
      toRemove.forEach((k) => sessionStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  }

  private pruneMemoryScroll(pathsToKeep: Set<string>) {
    for (const key of Array.from(this.scrollPositions.keys())) {
      if (!pathsToKeep.has(key)) {
        this.scrollPositions.delete(key);
      }
    }
  }

  private resetAllScroll() {
    const main = this.getMainEl();
    if (main) {
      main.scrollTop = 0;
    }
    this.scrollPositions.clear();
    this.clearScrollStorageExcept([]);
  }

  private getBackFallback(): string {
    switch (this.location.route) {
      case "dm":
        return "/messages";
      case "profile":
        return "/feed";
      case "profile-settings":
        return "/profile";
      case "post":
        return "/feed";
      default:
        return "/feed";
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("location")) {
      const previousPath = this.currentPath;
      const keepSet = new Set<string>([previousPath]);

      console.log(`[app-root] updated: navType=${this.navType}, previousPath=${previousPath}, newPath=${location.pathname}`);

      if (this.navType === "pop") {
        // Para pop (back), marca en sessionStorage que debe restaurar scroll
        // La página lo hará en su firstUpdated()
        try {
          sessionStorage.setItem("restore-scroll-on-next-page", "true");
          console.log(`[app-root] Set restore-scroll-on-next-page flag`);
        } catch {}
      } else {
        this.clearScrollStorageExcept([previousPath]);
        this.pruneMemoryScroll(keepSet);
        this.resetScrollForPath(location.pathname);
      }
      this.currentPath = location.pathname;
      this.navType = "push";
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
    const showBack = showChrome && this.location.route !== "feed";

    return html`
      <div class="app-shell">
        ${showChrome
          ? html`<app-toolbar .title=${this.getTitle()}></app-toolbar>`
          : html`<div style="height:var(--toolbar-height)"></div>`}
        ${showBack
          ? html`<app-back-link
              .fallback=${this.getBackFallback()}
            ></app-back-link>`
          : null}
        <main class="app-main">${this.renderPage()}</main>
        ${showChrome
          ? html`<app-bottom-nav></app-bottom-nav>`
          : html`<div style="height:var(--bottom-nav-height)"></div>`}
      </div>
    `;
  }
}
