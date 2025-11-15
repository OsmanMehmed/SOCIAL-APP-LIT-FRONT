import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONSTANTS
} from "../shared/constants";
import "../components/app-avatar";

@customElement("page-profile")
export class PageProfile extends LitElement {
  @property({ attribute: false }) params?: { id?: string };

  private editProfile() {
    navigate("/profile-settings");
  }

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .buttons-1 {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        align-items:center;
        margin-bottom: 2em;
      }

      .buttons-2 {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
        place-content: space-between;
        align-content: center;
      }
    `,
  ];

  private openDm() {
    navigate("/dm/me");
  }

  render() {
    const id = this.params?.id ?? "me";
    const isMe = id === "me";
    return html`
      <section class="flow-column">
        <div class="card">
          <div class="buttons-1">
            <app-avatar .cursorPointer=${false} .bigAvatar=${true}></app-avatar>
            <div>
              <span>@${id}</span>
            </div>
          </div>
          <div class="buttons-2">
            ${!isMe
            ? html`
                <button
                  class="btn-outline btn-pill btn-sm"
                  @click=${this.openDm}
                >
                  Mensaje
                </button>
              `
            : null}
            <button
              class="btn-outline btn-pill btn-sm"
              @click=${this.editProfile}
            >
              ${CONSTANTS.PROFILE_EDIT_BUTTON}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="chip-muted">${CONSTANTS.PROFILE_PUBLISHED_RECIPES}</div>
        </div>
      </section>
    `;
  }
}
