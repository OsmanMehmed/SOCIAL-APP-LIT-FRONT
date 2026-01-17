import { LitElement, html, unsafeCSS } from "lit";
import layoutCSS from "../css/layout.css?inline";
import miniProfileCSS from "../css/app-mini-profile.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import { authStore } from "../state/auth-store";

@customElement("app-mini-profile")
export class AppMiniProfile extends LitElement {
  @property({ type: String }) username =
    CONSTANTS.MINI_PROFILE_USERNAME_DEFAULT;
  @property({ type: String }) subtitle =
    CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT;
  @property({ type: String }) profileId = CONSTANTS.CURRENT_USER_ID;
  @property({ type: String }) avatarUrl = "";
  @property({ type: Boolean }) supressProfileRoute = false;
  @property({ type: Boolean }) noSubtitle = false;
  @property({ type: Boolean }) hideAvatar = false;
  @property({ type: Boolean }) onlyAvatar = false;
  @property({ type: Boolean }) large = false;

  static styles = [unsafeCSS(layoutCSS), unsafeCSS(miniProfileCSS)];

  private goProfile(event: Event) {
    if (!this.supressProfileRoute) {
      event.stopPropagation();
      const cleanUsername = this.username.replace(/^@/, "");
      const currentUserUsername = authStore.currentUserId;
      if (this.profileId === currentUserUsername) {
        navigate("/profile");
      } else {
        navigate(`/profile/${cleanUsername}`);
      }
    }
  }

  render() {
    return html`
      <div class="root">
        ${this.hideAvatar
          ? null
          : html`<app-avatar
              .src=${this.avatarUrl}
              ?bigAvatar=${this.large}
              @click=${this.goProfile}
            ></app-avatar>`}
        ${this.onlyAvatar
          ? null
          : html`
              <div class="meta">
                <span class="username" @click=${this.goProfile}
                  >@${this.username}</span
                >
                ${!this.noSubtitle
                  ? html`<span class="chip-muted name" @click=${this.goProfile}
                      >${this.subtitle}</span
                    >`
                  : null}
              </div>
            `}
      </div>
    `;
  }
}
