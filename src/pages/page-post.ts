import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import { ScrollPage } from "../shared/scroll-page";
import { postStore } from "../state/post-store";
import "../components/app-mini-profile";
import { postService } from "../servicios/core/post-service";
import type { Comment } from "../modelos/comment";
import { authStore } from "../state/auth-store";
import { navigate } from "../router";

@customElement("page-post")
export class PagePost extends ScrollPage {
  @property({ attribute: false }) params?: { id?: string };
  @state() private liked = false;
  @state() private isBanned = false;
  @state() private isBanning = false;
  @state() private postTitle = CONSTANTS.POST_TITLE;
  @state() private commentItems: {
    username: string;
    text: string;
    profileId: string;
  }[] = [];
  private currentPostId = "";
  @state() private newComment = "";
  @state() private isLoading = false;
  @state() private loadError = false;
  @state() private likesCount = 0;
  @state() private commentsCount = 0;
  @state() private savesCount = 0;

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
        width: 8em;
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
        max-height: 24rem;
        overflow-y: auto;
        padding-right: 0.5rem;
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
        margin-right: 0.5em;
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
        transition:
          color 0.15s ease,
          border-color 0.15s ease;
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

      .no-results {
        text-align: center;
        color: var(--muted-foreground);
      }

      .post-stats {
        display: flex;
        gap: 0.9rem;
        align-items: center;
        margin: 0.6rem 0 0.2rem 0;
        color: var(--muted-foreground);
      }

      .post-stats div {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
    `,
  ];

  private getPostTitle(id: string): string {
    const stored = postStore.getCurrent();
    if (stored && stored.id === id && stored.title) {
      return stored.title;
    }
    return CONSTANTS.NO_RESULTS_TEXT;
  }

  private async loadPost(id: string) {
    if (!id) return;
    this.currentPostId = id;
    this.isLoading = true;
    this.loadError = false;
    try {
      const data = await postService.fetchPostWithComments(id);
      this.postTitle = data.caption ?? this.getPostTitle(id);
      this.isBanned = Boolean(data.banned);
      this.liked = Boolean(data.liked);
      this.likesCount = data.likes ?? 0;
      this.commentsCount = data.comments ?? (data.commentsList?.length ?? 0);
      this.savesCount = data.saves ?? 0;
      const comments = data.commentsList ?? [];
      this.commentItems = comments.map((comment: Comment) => {
        const username = comment.authorId.startsWith(CONSTANTS.USERNAME_PREFIX)
          ? comment.authorId
          : `${CONSTANTS.USERNAME_PREFIX}${comment.authorId}`;
        return {
          username,
          text: comment.text,
          profileId: username.replace(CONSTANTS.USERNAME_PREFIX, ""),
        };
      });
    } catch (err) {
      console.warn("Post fetch error", err);
      this.loadError = true;
      this.postTitle = CONSTANTS.NO_RESULTS_TEXT;
      this.isBanned = false;
      this.liked = false;
      this.commentItems = [];
    } finally {
      this.isLoading = false;
    }
  }

  protected willUpdate(_changed: Map<string, unknown>) {
    const id = this.params?.id ?? "";
    if (id && id !== this.currentPostId) {
      this.loadPost(id);
    }
  }

  private async toggleLike() {
    const postId = this.params?.id ?? "";
    if (!postId) return;
    const next = !this.liked;
    this.liked = next;
    try {
      const updated = await postService.like(postId, next);
      this.liked = Boolean(updated.liked ?? next);
      this.likesCount = updated.likes ?? this.likesCount;
      this.commentsCount = updated.comments ?? this.commentsCount;
      this.savesCount = updated.saves ?? this.savesCount;
    } catch (err) {
      console.warn("Like post error", err);
      this.liked = !next;
    }
  }

  private async vetUser() {
    if (this.isBanning) return;
    const postId = this.params?.id ?? "";
    if (!postId) return;

    const next = !this.isBanned;
    this.isBanning = true;
    this.isBanned = next;
    try {
      const updated = await postService.ban(postId, next);
      this.isBanned = Boolean(updated.banned);
    } catch (err) {
      console.warn("Ban/unban post error", err);
      this.isBanned = !next;
    } finally {
      this.isBanning = false;
    }
  }

  private onCommentInput(e: Event) {
    this.newComment = (e.target as HTMLInputElement).value;
  }

  private async onSubmitComment(event: Event) {
    event.preventDefault();
    const text = this.newComment.trim();
    if (!text) return;
    const postId = this.params?.id ?? "";
    const authorId = authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID;
    try {
      const created = await postService.addComment({
        id: "",
        postId,
        authorId,
        text,
        createdAt: new Date().toISOString(),
      });
      const username = created.authorId.startsWith(CONSTANTS.USERNAME_PREFIX)
        ? created.authorId
        : `${CONSTANTS.USERNAME_PREFIX}${created.authorId}`;
      this.commentItems = [
        ...this.commentItems,
        {
          username,
          text: created.text,
          profileId: username.replace(CONSTANTS.USERNAME_PREFIX, ""),
        },
      ];
      this.commentsCount += 1;
      this.newComment = "";
    } catch (err) {
      console.warn("Add comment error", err);
    }
  }

  render() {
    const id = this.params?.id ?? "";
    const title = this.postTitle || this.getPostTitle(id);
    return html`
      <div class="component-container">
        <div class="card">
          ${this.isLoading
            ? html`<div class="no-results">Cargando...</div>`
            : null}
          ${this.loadError
            ? html`<div class="no-results">${CONSTANTS.NO_RESULTS_TEXT}</div>`
            : html`
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
                      ?disabled=${this.isBanning}
                      @click=${this.vetUser}
                    >
                      ${this.isBanned ? "Vetado" : "Vetar"}
                    </button>
                  </div>
                </div>
                <h2>${title}</h2>
                <p>${CONSTANTS.POST_BODY}</p>
                <div class="post-stats">
                  <div>
                    <sl-icon name="hand-thumbs-up"></sl-icon>
                    <span>${this.likesCount}</span>
                  </div>
                  <div>
                    <sl-icon name="chat-dots"></sl-icon>
                    <span>${this.commentsCount}</span>
                  </div>
                  <div>
                    <sl-icon name="bookmark"></sl-icon>
                    <span>${this.savesCount}</span>
                  </div>
                </div>
                <div class="post-edit-container">
                  <button
                    class="btn btn-pill btn-sm edit-btn"
                    @click=${() => navigate("/new-post")}
                  >
                    Editar
                  </button>
                </div>
              `}
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
              .value=${this.newComment}
              @input=${this.onCommentInput}
            />
            <button class="btn btn-sm btn-send-comment" type="submit">
              ${CONSTANTS.POST_COMMENT_SEND}
            </button>
          </form>
          ${this.isLoading
            ? html`<div class="no-results">Cargando...</div>`
            : null}
          ${!this.isLoading && this.commentItems.length === 0
            ? html`<div class="no-results">${CONSTANTS.NO_RESULTS_TEXT}</div>`
            : null}
          ${!this.isLoading && this.commentItems.length > 0
            ? html`
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
                    `,
                  )}
                </div>
              `
            : null}
        </section>
      </div>
    `;
  }
}
