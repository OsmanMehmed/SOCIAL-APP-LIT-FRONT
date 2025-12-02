import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import profilePageCSS from "../design-system/page-profile.css?inline";
import { customElement, property, query, state } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import { ScrollPage } from "../shared/scroll-page";
import "../components/app-avatar";
import "../components/app-post-card";
import { authStore } from "../state/auth-store";
import { profileService } from "../servicios/core/profile-service";
import { postService } from "../servicios/core/post-service";
import type { UserProfile } from "../modelos/user-profile";
import type { Post } from "../modelos/post";

@customElement("page-profile")
export class PageProfile extends ScrollPage {
  @property({ attribute: false }) params?: { id?: string };
  @query(".posts-card") private postsCard?: HTMLDivElement;
  private postsScrollListener = () => this.savePostsScroll();
  private beforeNavigateListener = () => this.savePostsScroll();
  @state() private profile?: UserProfile;
  @state() private isFriend = false;
  @state() private isBanned = false;
  @state() private isLoading = false;
  @state() private loadError = false;
  private currentProfileId = "";
  @state() private posts: Post[] = [];
  @state() private postsLoading = false;

  private resolveProfileId(): string {
    const paramId = this.params?.id;
    const sessionId = authStore.currentUserId;
    if (!paramId || paramId === "me") {
      return sessionId ?? "user-1";
    }
    return paramId;
  }

  private async vetUser() {
    const id = this.params?.id ?? this.profile?.id;
    if (!id) return;
    const next = !this.isBanned;
    this.isBanned = next;
    try {
      await profileService.vetProfile(id, next);
    } catch (err) {
      console.warn("Vet profile error", err);
      this.isBanned = !next;
    }
  }

  private editProfile() {
    navigate("/profile-settings");
  }

  private connect() {
    this.isFriend = true;
  }

  private async loadProfile(id: string) {
    this.isLoading = true;
    this.loadError = false;
    try {
      const profile = await profileService.fetchProfile(id);
      this.profile = profile;
      this.isFriend = profile.friend;
      this.isBanned = profile.banned;
    } catch (err) {
      console.warn("Profile fetch error", err);
      this.profile = undefined;
      this.isFriend = false;
      this.isBanned = false;
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  }

  private async loadPosts(id: string) {
    if (!id) return;
    this.postsLoading = true;
    try {
      this.posts = await postService.listByAuthor(id);
      // Una vez cargados los posts, intentamos restaurar el scroll del contenedor
      this.restorePostsScroll();
    } catch (err) {
      console.warn("Profile posts fetch error", err);
      this.posts = [];
    } finally {
      this.postsLoading = false;
    }
  }

  private unfriend() {
    this.isFriend = false;
  }

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(profilePageCSS)];

  private openDm() {
    const id = this.profile?.id ?? this.resolveProfileId();
    if (!id) return;
    navigate(`/dm/${id}`);
  }

  private getScrollKey() {
    const id = this.profile?.id ?? this.resolveProfileId();
    return `profile:posts-scroll:${id}`;
  }

  private savePostsScroll() {
    if (!this.postsCard) return;
    const key = this.getScrollKey();
    try {
      sessionStorage.setItem(key, String(this.postsCard.scrollTop));
    } catch {}
  }

  private restorePostsScroll() {
    if (!this.postsCard) return;
    const key = this.getScrollKey();
    let top = 0;
    try {
      const stored = sessionStorage.getItem(key);
      top = stored ? Number(stored) : 0;
    } catch {
      top = 0;
    }
    if (Number.isNaN(top)) return;
    requestAnimationFrame(() => {
      if (!this.postsCard) return;
      this.postsCard.scrollTop = top;
      requestAnimationFrame(() => {
        if (this.postsCard) {
          this.postsCard.scrollTop = top;
        }
      });
    });
  }

  protected willUpdate(_changed: Map<string, unknown>) {
    const targetId = this.resolveProfileId();
    if (targetId !== this.currentProfileId) {
      this.currentProfileId = targetId;
      this.loadProfile(targetId);
      this.loadPosts(targetId);
    }
  }

  protected firstUpdated() {
    this.restorePostsScroll();
    this.postsCard?.addEventListener("scroll", this.postsScrollListener);
    window.addEventListener(
      "app:navigate-start",
      this.beforeNavigateListener as EventListener,
    );
  }

  disconnectedCallback(): void {
    this.postsCard?.removeEventListener("scroll", this.postsScrollListener);
    window.removeEventListener(
      "app:navigate-start",
      this.beforeNavigateListener as EventListener,
    );
    super.disconnectedCallback();
  }

  render() {
    const resolvedId = this.profile?.id ?? this.resolveProfileId();
    const username =
      this.profile?.username ??
      (resolvedId.startsWith(CONSTANTS.USERNAME_PREFIX)
        ? resolvedId
        : `${CONSTANTS.USERNAME_PREFIX}${resolvedId}`);
    const subtitle =
      this.profile?.subtitle ?? CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT;
    const isMe = this.profile?.isOwnProfile ?? false;
    const isAdmin = authStore.currentUserId === "admin";
    const canVet = true; // TODO: hook to admin roles when available
    const showNoProfile = !this.isLoading && (this.loadError || !this.profile);

    return html`
      <section class="flow-column component-container">
        <div class="card profile-card">
          ${this.isLoading
            ? html`<div class="no-results">Cargando...</div>`
            : null}
          ${showNoProfile
            ? html`<div class="no-results">
                ${CONSTANTS.NO_RESULTS_TEXT}
              </div>`
            : html`
                <div class="profile-info">
                  <app-avatar
                    .cursorPointer=${false}
                    .bigAvatar=${true}
                  ></app-avatar>
                  <div class="profile-name">
                    <span>${username}</span>
                  </div>
                  <div class="profile-subtitle">${subtitle}</div>
                </div>
                <div class="buttons-2">
                  ${!isMe
                    ? html`
                        ${!isAdmin && this.isFriend
                          ? html`
                              <button
                                class="btn-no-fill btn-pill btn-sm friend-btn"
                                @click=${this.unfriend}
                                aria-label=${CONSTANTS.PROFILE_UNFRIEND_ALT}
                              >
                                <span class="label-default">
                                  ${CONSTANTS.PROFILE_FRIEND_BUTTON}
                                </span>
                                <span class="label-hover">
                                  ${CONSTANTS.PROFILE_UNFRIEND_SYMBOL}
                                </span>
                              </button>
                            `
                          : null}
                        ${!this.isFriend
                          ? html`
                              <button
                                class="btn btn-pill btn-sm connect-btn"
                                @click=${this.connect}
                              >
                                ${CONSTANTS.PROFILE_CONNECT_BUTTON}
                              </button>
                            `
                          : null}
                        ${canVet
                          ? html`
                              <button
                                class=${`btn btn-pill btn-sm connect-btn ${
                                  this.isBanned
                                    ? "btn-no-fill btn-pill btn-sm vet-btn"
                                    : ""
                                }`}
                                @click=${this.vetUser}
                              >
                                ${this.isBanned ? "Vetado" : "Vetar"}
                              </button>
                            `
                          : null}
                        <button
                          class="btn-no-fill btn-pill btn-sm"
                          @click=${this.openDm}
                        >
                          Mensaje
                        </button>
                      `
                    : null}
                  ${isMe || isAdmin
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
              `}
        </div>

        <div class="card posts-card">
          <div class="chip-muted page-profile-posts-title">
            ${CONSTANTS.PROFILE_PUBLISHED_RECIPES}
          </div>
          <div class="posts-container">
            ${this.postsLoading
              ? html`<div class="no-results">Cargando...</div>`
              : this.posts.length === 0
                  ? html`<div class="no-results">
                      ${CONSTANTS.NO_RESULTS_TEXT}
                    </div>`
                  : html`${this.posts.map((post) => {
                      const username = post.authorId?.startsWith(
                        CONSTANTS.USERNAME_PREFIX,
                      )
                        ? post.authorId
                        : `${CONSTANTS.USERNAME_PREFIX}${post.authorId}`;
                      return html`<app-post-card
                        .postId=${post.id}
                        .username=${username}
                        .caption=${post.caption}
                        .banned=${Boolean(post.banned)}
                        .liked=${Boolean(post.liked)}
                        .likes=${post.likes}
                        .comments=${post.comments}
                        .saves=${post.saves}
                      ></app-post-card>`;
                    })}`}
          </div>
        </div>
      </section>
    `;
  }
}
