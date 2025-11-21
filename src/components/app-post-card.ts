import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("app-post-card")
export class AppPostCard extends LitElement {
  @property() postId = "";
  @property() username = CONSTANTS.POST_CARD_DEFAULT_USERNAME;
  @property() caption = CONSTANTS.POST_CARD_DEFAULT_CAPTION;
  @property() noProfile = false;
  @property() noShadow = false;
  @property() image = "";

  static styles = [
    unsafeCSS(layoutCSS),
    css`
      .post-card {
        display: flex;
        gap: 1.5em;
        flex-direction: row;
        width: 100%;
        place-content: center;
      }

      @media (max-width: 65em) {
        .post-card {
          flex-wrap: wrap-reverse;
        }
      }

      .card {
        border-radius: var(--radius-md);
        border: 1.25px solid rgba(255, 179, 71, 0.26);
        box-shadow: var(--shadow-soft);
        padding-left: 0.75rem;
        padding-block: 1.2rem;
        width: 90%;
        background: var(--background);
      }

      .card-no-shadow {
        box-shadow: none;
        background: none;
      }

      .description {
        cursor: default;
      }

      .username {
        font-size: 0.85rem;
        font-weight: 600;
      }

      .image {
        margin: 0.4rem 0;
        border-radius: var(--radius-md);
        height: 275px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        color: rgba(255, 204, 196, 0.85);
        cursor: pointer;
      }

      .caption {
        cursor: pointer;
      }

      .stats {
        display: flex;
        flex-direction: row;
        gap: 0.6rem;
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: var(--muted-foreground);
      }

      .sidebar {
        margin-top: 1em;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        width: 30em;
      }
    `,
  ];

  private openPost() {
    navigate(`/post/${this.postId}`);
  }

  render() {
    return html`
      <div class="post-card">
        <article class=${
          !this.noShadow ? "card" : "card card-no-shadow"
        } @click=${this.openPost}>
          <div class="image">
            ${
              this.image
                ? html`<img src=${this.image} />`
                : CONSTANTS.POST_CARD_FALLBACK_IMAGE_TEXT
            }
          </div>
          <div class="caption">${this.caption}</div>
          <div class="stats">
            <div>
              <sl-icon name="hand-thumbs-up"></sl-icon>
              <span>${CONSTANTS.POST_CARD_LIKES_TEXT}</span>
            </div>
            <div>
              <sl-icon name="chat-dots""></sl-icon>
              <span>${CONSTANTS.POST_CARD_COMMENTS_TEXT}</span>
            </div>
            <div>
              <sl-icon name="bookmark""></sl-icon>
              <span>${CONSTANTS.POST_CARD_SAVE_TEXT}</span>
            </div>
          </div>
        </article>
        ${
          !this.noProfile
            ? html`
                <aside class="sidebar">
                  <app-mini-profile
                    username=${this.username}
                    subtitle=${this.caption}
                    .profileId=${this.username.replace(
                      CONSTANTS.USERNAME_PREFIX,
                      ""
                    )}
                  ></app-mini-profile>
                  <div class="card description">
                    <div class="chip-muted">
                      ${CONSTANTS.FEED_SIDEBAR_TITLE}
                    </div>
                    <div style="margin-top:0.3rem;">
                      ${CONSTANTS.FEED_SIDEBAR_TEXT}
                    </div>
                  </div>
                </aside>
              `
            : ``
        }
        
      </div>
    `;
  }
}
