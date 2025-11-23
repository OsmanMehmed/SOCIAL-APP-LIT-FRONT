import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import { postStore } from "../state/post-store";
import "../components/app-mini-profile";

@customElement("page-post")
export class PagePost extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @state() private liked = false;

  private comments = [
    {
      username: "@foodie.lu",
      text: "Se ve brutal, me encanta el contraste de colores.",
      profileId: "foodie.lu",
    },
    {
      username: "@osman.chef",
      text: "Tip: agrega un toque de miel en el topping para mas brillo.",
      profileId: "osman.chef",
    },
  ];

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .component-container {
        justify-self: center;
        min-width: 28em;
        max-width: 90em;
        width: 60%;
        padding-right: 1.5em;
      }

      .back {
        font-size: 1rem;
        color: var(--muted-foreground);
        cursor: pointer;
        margin-bottom: 0.4rem;
      }

      .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .like-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .like-btn--active {
        background: transparent;
        border: 1px solid;
        box-shadow: none;
      }

      .comments-section {
        margin-top: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }

      .comment-input {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
      }

      .comment-input .input {
        flex: 1;
      }

      .comments-list {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .comment-card {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 0.75rem;
        border-radius: var(--radius-md);
        border: 1px solid rgba(255, 179, 71, 0.26);
        background: var(--background);
      }

      .comment-text {
        margin: 0;
        color: var(--muted-foreground);
      }
    `,
  ];

  private getPostTitle(id: string): string {
    const stored = postStore.getCurrent();
    if (stored && stored.id === id && stored.title) {
      return stored.title;
    }

    const titles: Record<string, string> = {
      "1": CONSTANTS.FEED_POST1_CAPTION,
      "2": CONSTANTS.FEED_POST2_CAPTION,
    };

    return titles[id] ?? CONSTANTS.POST_TITLE;
  }

  private toggleLike() {
    this.liked = !this.liked;
  }

  private onSubmitComment(event: Event) {
    event.preventDefault();
  }

  render() {
    const id = this.params?.id ?? "";
    const title = this.getPostTitle(id);
    return html`
      <div class="component-container">
        <div class="card">
          <div class="post-header">
            <div class="chip-muted">
              ${CONSTANTS.POST_CHIP_LABEL_PREFIX} ${id}
            </div>
            <button
              class=${`btn-pill btn-sm like-btn ${
                this.liked ? "btn-no-fill like-btn--active" : "btn"
              }`}
              @click=${this.toggleLike}
            >
              <sl-icon name="hand-thumbs-up"></sl-icon>
              <span
                >${this.liked
                  ? CONSTANTS.POST_LIKE_ACTIVE
                  : CONSTANTS.POST_LIKE_BUTTON}</span
              >
            </button>
          </div>
          <h2>${title}</h2>
          <p>${CONSTANTS.POST_BODY}</p>
        </div>

        <section class="card comments-section">
          <div class="chip-muted">${CONSTANTS.POST_COMMENTS_TITLE}</div>
          <form class="comment-input" @submit=${this.onSubmitComment}>
            <input
              class="input"
              placeholder=${CONSTANTS.POST_COMMENT_PLACEHOLDER}
            />
            <button class="btn btn-sm" type="submit">
              ${CONSTANTS.POST_COMMENT_SEND}
            </button>
          </form>
          <div class="comments-list">
            ${this.comments.map(
              (comment) => html`
                <div class="comment-card">
                  <app-mini-profile
                    .username=${comment.username}
                    .profileId=${comment.profileId}
                    .noSubtitle=${true}
                    .hideAvatar=${true}
                  ></app-mini-profile>
                  <p class="comment-text">${comment.text}</p>
                </div>
              `
            )}
          </div>
        </section>
      </div>
    `;
  }
}
