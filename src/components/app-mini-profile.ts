import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("app-mini-profile")
export class AppMiniProfile extends LitElement {
  static styles = [
    unsafeCSS(layoutCSS),
    css`
      .root {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .meta {
        display: flex;
        flex-direction: column;
        font-size: 0.75rem;
      }

      .username {
        font-weight: 600;
        cursor: pointer;
      }

      .name {
        cursor: pointer;
      }
    `,
  ];

  private goProfile() {
    navigate("/profile/me");
  }

  render() {
    return html`
      <div class="root">
        <app-avatar @click=${this.goProfile}></app-avatar>
        <div class="meta">
          <span class="username" @click=${this.goProfile}
            >${CONSTANTS.MINI_PROFILE_USERNAME}</span
          >
          <span class="chip-muted name" @click=${this.goProfile}
            >${CONSTANTS.MINI_PROFILE_SUBTITLE}</span
          >
        </div>
      </div>
    `;
  }
}
