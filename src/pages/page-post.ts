import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import { postStore } from "../state/post-store";
import "../components/app-mini-profile";
import { postService } from "../servicios/core/post-service";
import type { Comment } from "../modelos/comment";
import { navigate } from "../router";

@customElement("page-post")
export class PagePost extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @state() private liked = false;
  @state() private isBanned = false;
  @state() private postTitle = CONSTANTS.POST_TITLE;
  @state() private commentItems: { username: string; text: string; profileId: string }[] =
    [
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
  private currentPostId = "";

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

      .post-actions {
        display: inline-flex;
        gap: 0.5rem;
        align-items: center;
      }

      .like-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        width: 8em;;
      }

      .like-btn--active {
        background: transparent;
        border: 1px solid;
        box-shadow: none;
      }

      .btn-send-comment {
        width: 8em;
        margin-right: 2em;
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
        height: 1.5em;
        margin-left: 0.5em;
      }

      .comments-title {
        width: 100%;
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
        margin-right: 1em;
      }

      .comment-text {
        margin: 0;
        color: var(--muted-foreground);
      }

      .vet-btn {
        width: 8em; 
        margin-right: 1em;
      }

      .vet-btn-vetted {
        background: transparent;
        border: 1px solid;
        transition: color 0.15s ease, border-color 0.15s ease;
      }

      .vet-btn-vetted .label-hover {
        display: none;
      }

      .vet-btn-vetted:hover .label-default {
        display: none;
      }

      .vet-btn-vetted:hover .label-hover {
        display: inline;
      }

      .post-edit-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
        margin-right: 1rem;
      }

      .edit-btn {
        width: 7em;
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

  private async loadPost(id: string) {
    if (!id) return;
    this.currentPostId = id;
    const data = await postService.fetchPostWithComments(id);
    this.postTitle = data.caption ?? this.getPostTitle(id);
    this.commentItems = data.commentsList.map((comment: Comment) => {
      const username = comment.authorId.startsWith(CONSTANTS.USERNAME_PREFIX)
        ? comment.authorId
        : `${CONSTANTS.USERNAME_PREFIX}${comment.authorId}`;
      return {
        username,
        text: comment.text,
        profileId: username.replace(CONSTANTS.USERNAME_PREFIX, ""),
      };
    });
  }

  protected willUpdate(_changed: Map<string, unknown>) {
    const id = this.params?.id ?? "";
    if (id && id !== this.currentPostId) {
      this.loadPost(id);
    }
  }

  private toggleLike() {
    this.liked = !this.liked;
  }

  private vetUser() {
    this.isBanned = !this.isBanned;
  }

  private onSubmitComment(event: Event) {
    event.preventDefault();
  }

  render() {
    const id = this.params?.id ?? "";
    const title = this.postTitle || this.getPostTitle(id);
    return html`
      <div class="component-container">
        <div class="card">
          <div class="post-header">
            <div class="chip-muted">
              ${CONSTANTS.POST_CHIP_LABEL_PREFIX} ${id}
            </div>
            <div class="post-actions">
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
              <button
                class=${`btn btn-pill btn-sm vet-btn ${
                  this.isBanned ? "btn-no-fill vet-btn vet-btn-vetted" : ""
                }`}
                @click=${this.vetUser}
              >
                ${this.isBanned ? "Vetado" : "Vetar"}
              </button>
            </div>
          </div>
          <h2>${title}</h2>
          <p>${CONSTANTS.POST_BODY}</p>
          <div class="post-edit-container">
            <button class="btn btn-pill btn-sm edit-btn" @click=${() => navigate("/new-post")}>
              Editar
            </button>
          </div>
        </div>

        <section class="card comments-section">
          <div>
            <div class="chip-muted chip-comments">
              ${CONSTANTS.POST_COMMENTS_TITLE}
            </div>
          </div>
          <form class="comment-input" @submit=${this.onSubmitComment}>
            <input
              class="input"
              placeholder=${CONSTANTS.POST_COMMENT_PLACEHOLDER}
            />
            <button class="btn btn-sm btn-send-comment" type="submit">
              ${CONSTANTS.POST_COMMENT_SEND}
            </button>
          </form>
          <div class="comments-list">
            ${this.commentItems.map(
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
