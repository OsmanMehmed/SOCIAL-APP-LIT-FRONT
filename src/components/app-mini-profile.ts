import { LitElement, html, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import miniProfileCSS from "../design-system/app-mini-profile.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("app-mini-profile")
export class AppMiniProfile extends LitElement {
  @property({ type: String }) username =
    CONSTANTS.MINI_PROFILE_USERNAME_DEFAULT;
  @property({ type: String }) subtitle =
    CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT;
  @property({ type: String }) profileId = CONSTANTS.CURRENT_USER_ID;
  @property({ type: Boolean }) supressProfileRoute = false;
  @property({ type: Boolean }) noSubtitle = false;
  @property({ type: Boolean }) hideAvatar = false;

  static styles = [unsafeCSS(layoutCSS), unsafeCSS(miniProfileCSS)];

  private goProfile(event: Event) {
    if (!this.supressProfileRoute) {
      event.stopPropagation();
      const id = this.profileId || CONSTANTS.CURRENT_USER_ID;
      navigate(`/profile/${id}`);
    }
  }

  render() {
    return html`
      <div class="root">
        ${this.hideAvatar
          ? null
          : html`<app-avatar @click=${this.goProfile}></app-avatar>`}
        <div class="meta">
          <span class="username" @click=${this.goProfile}
            >${this.username}</span
          >
          ${!this.noSubtitle
            ? html`<span class="chip-muted name" @click=${this.goProfile}
                >${this.subtitle}</span
              >`
            : null}
        </div>
      </div>
    `;
  }
}
