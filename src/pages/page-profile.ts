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
      .component-container {
        justify-self: center;
        min-width: 25em;
        width: 40%;
      }

      .back {
        font-size: 1rem;
        color: var(--muted-foreground);
        cursor: pointer;
        margin-bottom: 0.4rem;
      }

      .profile-info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        align-items: center;
        margin-bottom: 2em;
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
        margin-right: 0.5em;
      }

      .edit-profile-btn {
        width: 10em;
      }

      .profile-card {
        width: 40%;
        place-self: center;
      }

      .page-profile-posts-title {
        margin-bottom: 1.5em;
      }

      .posts-container {
        overflow-y: scroll;
        height: 45em;
        display: flex;
        flex-direction: column;
        gap: 0.8em;
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
      <section class="flow-column component-container">
        ${!isMe
          ? html`<div class="back" @click=${this.goBack}>
              ${CONSTANTS.POST_BACK_TO_FEED}
            </div>`
          : null}
        <div class="card profile-card">
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

        <div class="card posts-card">
          <div class="chip-muted page-profile-posts-title">
            ${CONSTANTS.PROFILE_PUBLISHED_RECIPES}
          </div>
          <div class="posts-container">
            <app-post-card noProfile=${true} noShadow=${true} postId="1"></app-post-card>
            <app-post-card noProfile=${true} noShadow=${true} postId="2"></app-post-card>
            <app-post-card noProfile=${true} noShadow=${true} postId="2"></app-post-card>
            <app-post-card noProfile=${true} noShadow=${true} postId="2"></app-post-card>
          </div>
        </div>
      </section>
    `;
  }
}
