import { LitElement, html, unsafeCSS } from "lit";
import layoutCSS from "../css/layout.css?inline";
import componentsCSS from "../css/components.css?inline";
import postCardCSS from "../css/app-post-card.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import { postStore } from "../state/post-store";
import { postService } from "../servicios/core/post-service";

@customElement("app-post-card")
export class AppPostCard extends LitElement {
  @property() postId = "";
  @property() authorId = "";
  @property() description = "";
  @property() username = CONSTANTS.POST_CARD_DEFAULT_USERNAME;
  @property() subtitle = "";
  @property() caption = CONSTANTS.POST_CARD_DEFAULT_CAPTION;
  @property() noProfile = false;
  @property() noShadow = false;
  @property() image = "";
  @property() avatarUrl = "";
  @property({ type: Boolean }) showEdit = true;
  @property({ type: Boolean }) banned = false;
  @property({ type: Boolean }) liked = false;
  @state() private isBanned = false;
  @state() private isBanning = false;
  @property({ type: Number }) likes = 0;
  @property({ type: Number }) comments = 0;
  @property({ type: Number }) saves = 0;
  @property({ type: Array }) tags: string[] = [];
  @state() private likesCount = 0;
  @state() private commentsCount = 0;
  @state() private savesCount = 0;
  @state() private isLiking = false;

  static styles = [
    unsafeCSS(layoutCSS),
    unsafeCSS(componentsCSS),
    unsafeCSS(postCardCSS),
  ];

  private openPost() {
    postStore.setCurrent({
      id: this.postId,
      title: this.caption,
      username: this.username,
    });
    navigate(`/post/${this.postId}`);
  }

  private editPost(event: Event) {
    event.stopPropagation();
    if (!this.postId) return;
    navigate(`/edit-post/${this.postId}`);
  }

  private async toggleLike(event: Event) {
    event.stopPropagation();
    if (this.isLiking || !this.postId) return;
    const next = !this.liked;
    this.isLiking = true;
    const updated = await postService.like(this.postId, next).finally(() => {
      this.isLiking = false;
    });
    this.liked = Boolean(updated.liked ?? next);
    this.likesCount = updated.likes ?? this.likesCount;
    this.commentsCount = updated.comments ?? this.commentsCount;
    this.savesCount = updated.saves ?? this.savesCount;
  }

  private async toggleVet(event: Event) {
    event.stopPropagation();
    if (this.isBanning || !this.postId) return;
    const next = !this.isBanned;
    this.isBanning = true;
    this.isBanned = next;
    const updated = await postService.ban(this.postId, next).finally(() => {
      this.isBanning = false;
    });
    this.isBanned = Boolean(updated.banned);
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("banned")) {
      this.isBanned = this.banned;
    }
    if (changed.has("liked")) {
      this.liked = Boolean(this.liked);
    }
    if (
      changed.has("likes") ||
      changed.has("comments") ||
      changed.has("saves")
    ) {
      this.likesCount = Number(this.likes) || 0;
      this.commentsCount = Number(this.comments) || 0;
      this.savesCount = Number(this.saves) || 0;
    }
  }

  protected firstUpdated(): void {
    this.likesCount = Number(this.likes) || 0;
    this.commentsCount = Number(this.comments) || 0;
    this.savesCount = Number(this.saves) || 0;
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
          <div class="footer">
            <div class="stats">
              <div>
                <sl-icon name="hand-thumbs-up"></sl-icon>
                <span>${this.likesCount}</span>
              </div>
              <div>
                <sl-icon name="chat-dots"></sl-icon>
                <span>${this.commentsCount}</span>
              </div>
              <div>
                <sl-icon name="bookmark""></sl-icon>
                <span>${this.savesCount}</span>
              </div>
            </div>
            <div class="footer-actions">
              ${
                this.showEdit
                  ? html`
                      <button
                        class=${`btn-pill btn-sm like-btn ${
                          this.liked ? "btn-no-fill like-btn--active" : "btn"
                        }`}
                        ?disabled=${this.isLiking}
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
                          this.isBanned ? "btn-no-fill vet-btn-vetted" : ""
                        }`}
                        ?disabled=${this.isBanning}
                        @click=${this.toggleVet}
                      >
                        ${this.isBanned ? "Vetado" : "Vetar"}
                      </button>
                      <button
                        class="btn btn-pill btn-sm edit-btn"
                        @click=${this.editPost}
                      >
                        Editar
                      </button>
                    `
                  : null
              }
            </div>
          </div>
        </article>
        ${
          !this.noProfile
            ? html`
                <aside class="sidebar">
                  <app-mini-profile
                    .username=${this.username}
                    .subtitle=${this.subtitle}
                    .profileId=${this.authorId}
                    .avatarUrl=${this.avatarUrl}
                  ></app-mini-profile>
                  <div class="card description">
                    <div style="margin-top:0.3rem;">
                      ${this.description || CONSTANTS.FEED_SIDEBAR_TEXT}
                    </div>
                    ${this.tags.length > 0
                      ? html`
                          <div class="post-tags" style="margin-top: 0.8rem;">
                            ${this.tags.map(
                              (tag) =>
                                html`<span class="chip-muted">#${tag}</span>`
                            )}
                          </div>
                        `
                      : null}
                  </div>
                </aside>
              `
            : ``
        }
        
      </div>
    `;
  }
}
