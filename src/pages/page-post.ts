import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import pagePostCSS from "../styles/pages/page-post.css?inline";
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

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pagePostCSS)];

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
