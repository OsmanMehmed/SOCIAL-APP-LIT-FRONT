import { html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import pagePostCSS from "../css/page-post.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import { ScrollPage } from "../shared/scroll-page";
import { postStore } from "../state/post-store";
import "../components/app-mini-profile";
import { postService } from "../servicios/core/post-service";
import type { Comment } from "../modelos/comment";
import { authStore } from "../state/auth-store";
import { navigate } from "../router";
import { profileService } from "../servicios/core/profile-service";

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
  @state() private postImage = "";
  @state() private postDescription = "";
  @state() private postAuthorId = "";
  @state() private authorNames: Record<string, string> = {};

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
    const data = await postService.fetchPostWithComments(id).finally(() => {
      this.isLoading = false;
    });
    this.postTitle = data.title ?? data.caption ?? this.getPostTitle(id);
    this.isBanned = Boolean(data.banned);
    this.liked = Boolean(data.liked);
    this.likesCount = data.likes ?? 0;
    this.commentsCount = data.comments ?? data.commentsList?.length ?? 0;
    this.savesCount = data.saves ?? 0;
    this.postImage = data.imageUrl || data.imageUrls?.[0] || "";
    this.postDescription = data.description || "";
    this.postAuthorId = data.authorId;
    const comments = data.commentsList ?? [];
    await this.loadAuthorUsernames(comments.map((c: Comment) => c.authorId));
    this.commentItems = comments.map((comment: Comment) => {
      const username = this.authorNames[comment.authorId] ?? comment.authorId;
      return {
        username,
        text: comment.text,
        profileId: comment.authorId,
      };
    });
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
    const updated = await postService.like(postId, next);
    this.liked = Boolean(updated.liked ?? next);
    this.likesCount = updated.likes ?? this.likesCount;
    this.commentsCount = updated.comments ?? this.commentsCount;
    this.savesCount = updated.saves ?? this.savesCount;
  }

  private async vetUser() {
    if (this.isBanning) return;
    const postId = this.params?.id ?? "";
    if (!postId) return;

    const next = !this.isBanned;
    this.isBanning = true;
    this.isBanned = next;
    const updated = await postService.ban(postId, next).finally(() => {
      this.isBanning = false;
    });
    this.isBanned = Boolean(updated.banned);
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

    const created = await postService.addComment({
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString(),
    });
    await this.loadAuthorUsernames([created.authorId]);
    const username = this.authorNames[created.authorId] ?? created.authorId;
    this.commentItems = [
      ...this.commentItems,
      {
        username,
        text: created.text,
        profileId: created.authorId,
      },
    ];
    this.commentsCount += 1;
    this.newComment = "";
  }

  private async loadAuthorUsernames(ids: string[]) {
    const unique = Array.from(new Set(ids.filter(Boolean)));
    const missing = unique.filter((id) => !this.authorNames[id]);
    if (!missing.length) return;
    const fetched = await Promise.all(
      missing.map(async (id) => {
        const profile = await profileService.fetchProfile(id);
        return { id, username: profile.username.replace(/^@/, "") };
      }),
    );
    const next = { ...this.authorNames };
    fetched.forEach(({ id, username }) => {
      next[id] = username;
    });
    this.authorNames = next;
  }

  render() {
    const id = this.params?.id ?? "";
    const title = this.postTitle || this.getPostTitle(id);
    const isOwner =
      this.postAuthorId &&
      this.postAuthorId ===
        (authStore.currentUserId ?? CONSTANTS.CURRENT_USER_ID);
    const isAdmin = Boolean(authStore.currentUserIsAdmin);
    const canEdit = isOwner || isAdmin;
    return html`
      <div class="component-container">
        <div class="card">
          ${this.isLoading
            ? html`<div class="no-results">${CONSTANTS.LOADING_TEXT}</div>`
            : null}
          ${this.loadError
            ? html`<div class="no-results">${CONSTANTS.NO_RESULTS_TEXT}</div>`
            : html`
                <div class="post-header">
                  <div class="chip-muted">
                    ${CONSTANTS.POST_CHIP_LABEL_PREFIX}
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
                    ${canEdit
                      ? html`
                          <button
                            class=${`btn btn-pill btn-sm vet-btn ${
                              this.isBanned
                                ? "btn-no-fill vet-btn vet-btn-vetted"
                                : ""
                            }`}
                            ?disabled=${this.isBanning}
                            @click=${this.vetUser}
                          >
                            ${this.isBanned
                              ? CONSTANTS.POST_BANNED_LABEL
                              : CONSTANTS.POST_BAN_BUTTON}
                          </button>

                          <button
                            class="btn btn-pill btn-sm edit-btn"
                            @click=${() => navigate("/new-post")}
                          >
                            ${CONSTANTS.POST_EDIT_BUTTON}
                          </button>
                        `
                      : null}
                  </div>
                </div>
                <h2>${title}</h2>
                <div class="post-image">
                  ${this.postImage
                    ? html`<img src=${this.postImage} alt=${title} />`
                    : html`<div class="image-placeholder">
                        ${CONSTANTS.POST_CARD_FALLBACK_IMAGE_TEXT}
                      </div>`}
                </div>
                <p>${this.postDescription || CONSTANTS.POST_BODY}</p>
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
            ? html`<div class="no-results">${CONSTANTS.LOADING_TEXT}</div>`
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
                    `
                  )}
                </div>
              `
            : null}
        </section>
      </div>
    `;
  }
}
