import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
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
      .back {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        margin-bottom: 0.75rem;
        cursor: pointer;
        font-size: 0.9rem;
        color: var(--accent-foreground);
      }

      .back::before {
        content: "←";
        font-size: 0.9rem;
      }

      .profile-info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        align-items: center;
        margin-bottom: 2em;
        width: 25em;
      }

      .profile-name {
        font-weight: 600;
        width: 100%;
        margin-left: 1em;
      }

      .buttons-2 {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
        place-content: end space-between;
      }

      .edit-profile-btn{
        width: 10em;
      }
    `,
  ];

  private openDm() {
    navigate("/dm/me");
  }

  private goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/feed");
    }
  }

  render() {
    const id = this.params?.id ?? "me";
    const isMe = id === "me";
    return html`
      <section class="flow-column">
        ${!isMe
          ? html`<div class="back" @click=${this.goBack}>Volver</div>`
          : null}
        <div class="card">
          <div class="profile-info">
            <app-avatar .cursorPointer=${false} .bigAvatar=${true}></app-avatar>
            <div class="profile-name">
              <span>@${id}</span>
            </div>
          </div>
          <div class="buttons-2">
            ${!isMe
              ? html`
                  <button
                    class="btn-no-fill btn-pill btn-sm"
                    @click=${this.openDm}
                  >
                    Mensaje
                  </button>
                `
              : null}
            ${isMe
              ? html`
                  <button
                    class="btn btn-pill btn-sm edit-profile-btn"
                    @click=${this.editProfile}
                  >
                    ${CONSTANTS.PROFILE_EDIT_BUTTON}
                  </button>
                `
              : null}
          </div>
        </div>

        <div class="card">
          <div class="chip-muted">${CONSTANTS.PROFILE_PUBLISHED_RECIPES}</div>
        </div>
      </section>
    `;
  }
}
