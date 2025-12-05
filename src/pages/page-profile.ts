import { html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import pageProfileCSS from "../css/page-profile.css?inline";
import { customElement, property, query, state } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import { ScrollPage } from "../shared/scroll-page";
import "../components/app-avatar";
import "../components/app-post-card";
import { authStore } from "../state/auth-store";
import { profileService } from "../servicios/core/profile-service";
import { postService } from "../servicios/core/post-service";
import { friendService } from "../servicios/core/friend-service";
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
    if (!paramId) {
      return sessionId ?? "user-1";
    }
    return paramId;
  }

  private async vetUser() {
    const id = this.profile?.id ?? this.params?.id ?? this.resolveProfileId();
    if (!id) return;
    const next = !this.isBanned;
    this.isBanned = next;
    await profileService.vetProfile(id, next);
  }

  private editProfile() {
    navigate("/profile-settings");
  }

  private async connect() {
    if (this.isFriend) return;
    const friendId = this.profile?.id ?? this.resolveProfileId();
    if (!friendId) return;
    try {
      await friendService.connect(friendId);
      this.isFriend = true;
    } catch (error) {
      console.error("Error connecting with user", error);
    }
  }

  private async loadProfile(id: string) {
    this.isLoading = true;
    this.loadError = false;
    const profile = await profileService
      .fetchProfile(id)
      .finally(() => {
        this.isLoading = false;
      });
    this.profile = profile;
    this.isFriend = profile.friend;
    this.isBanned = profile.banned;
    this.loadPosts(profile.id);
    this.refreshFriendState(profile.id);
  }

  private async loadPosts(id: string) {
    if (!id) return;
    this.postsLoading = true;
    this.posts = await postService
      .listByAuthor(id)
      .finally(() => {
        this.postsLoading = false;
      });
    this.restorePostsScroll();
  }

  private async refreshFriendState(friendId: string) {
    if (!friendId) return;
    const viewerId = authStore.currentUserId;
    if (!viewerId || viewerId === CONSTANTS.CURRENT_USER_ID || viewerId === friendId) {
      return;
    }
    try {
      const status = await friendService.status(friendId);
      this.isFriend = status;
    } catch (error) {
      console.warn("No se pudo verificar la amistad", error);
    }
  }

  private async unfriend() {
    if (!this.isFriend) return;
    const friendId = this.profile?.id ?? this.resolveProfileId();
    if (!friendId) return;
    try {
      await friendService.disconnect(friendId);
      this.isFriend = false;
    } catch (error) {
      console.error("Error removing friend", error);
    }
  }

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageProfileCSS)];

  private openDm() {
    if (!this.profile?.username) return;
    const username = this.profile.username.replace(/^@/, "");
    navigate(`/dm/${username}`);
  }

  private getScrollKey() {
    const id = this.profile?.id ?? this.resolveProfileId();
    return `profile:posts-scroll:${id}`;
  }

  private savePostsScroll() {
    if (!this.postsCard) return;
    const key = this.getScrollKey();
    sessionStorage.setItem(key, String(this.postsCard.scrollTop));
  }

  private restorePostsScroll() {
    if (!this.postsCard) return;
    const key = this.getScrollKey();
    let top = 0;
    const stored = sessionStorage.getItem(key);
    top = stored ? Number(stored) : 0;
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
    const paramUsername = this.params?.id ?? "";
    const cleanParamUsername = paramUsername.replace(/^@/, "");
    
    if (paramUsername !== cleanParamUsername && cleanParamUsername) {
      window.history.replaceState(null, "", `/profile/${cleanParamUsername}`);
    }
    
    const targetId = this.resolveProfileId();
    
    if (targetId === authStore.currentUserId && cleanParamUsername !== "") {
      navigate("/profile");
      return;
    }
    
    if (targetId !== this.currentProfileId) {
      this.currentProfileId = targetId;
      this.loadProfile(targetId);
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
    const cleanUsername = (this.profile?.username || "").replace(/^@/, "");
    const username = cleanUsername ? `@${cleanUsername}` : "";
    const subtitle =
      this.profile?.subtitle ?? CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT;
    const isMe = this.profile?.id === authStore.currentUserId;
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
                    .src=${this.profile?.avatarUrl || ""}
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
                      const username = cleanUsername;
                      return html`<app-post-card
                        .postId=${post.id}
                        .authorId=${post.authorId}
                        .username=${username}
                        .caption=${post.caption}
                        .noProfile=${true}
                        .image=${post.imageUrl || ""}
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
