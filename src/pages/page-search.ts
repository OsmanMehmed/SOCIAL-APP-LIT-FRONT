import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import pageSearchCSS from "../css/page-search.css?inline";
import { customElement, state } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import { ScrollPage } from "../shared/scroll-page";
import "../components/app-avatar";
import { friendService } from "../servicios/core/friend-service";
import { postService } from "../servicios/core/post-service";
import type { UserProfile } from "../modelos/user-profile";
import type { Post } from "../modelos/post";

interface SearchRecipe {
  id: string;
  title: string;
  authorId: string;
  tags: string[];
  time: string;
}

@customElement("page-search")
export class PageSearch extends ScrollPage {
  @state() private query = "";
  @state() private profiles: UserProfile[] = [];
  @state() private recipes: SearchRecipe[] = [];
  @state() private isLoadingProfiles = false;
  @state() private profilesError = false;
  @state() private isLoadingPosts = false;
  @state() private postsError = false;

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageSearchCSS)];

  private onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    this.runSearch();
  }

  private get normalizedQuery(): string {
    return this.query.trim().toLowerCase();
  }

  private async runSearch() {
    const q = this.normalizedQuery;
    if (!q) {
      await this.loadDefaultResults();
      return;
    }

    this.isLoadingProfiles = true;
    this.isLoadingPosts = true;
    this.profilesError = false;
    this.postsError = false;
    this.profiles = await friendService.search(q).finally(() => {
      this.isLoadingProfiles = false;
    });

    const posts = await postService.search(q).finally(() => {
      this.isLoadingPosts = false;
    });
    this.recipes = posts.map((post: Post) => ({
      id: post.id,
      title: post.caption,
      authorId: post.authorId,
      tags: [],
      time: "",
    }));
  }

  private async loadDefaultResults() {
    this.isLoadingProfiles = true;
    this.isLoadingPosts = true;
    this.profilesError = false;
    this.postsError = false;

    const [profilesResult, postsResult] = await Promise.allSettled([
      friendService.random(5),
      postService.random(5),
    ]);

    if (profilesResult.status === "fulfilled") {
      this.profiles = profilesResult.value;
      this.profilesError = false;
    } else {
      this.profiles = [];
      this.profilesError = true;
    }
    this.isLoadingProfiles = false;

    if (postsResult.status === "fulfilled") {
      this.recipes = postsResult.value.map((post: Post) => ({
        id: post.id,
        title: post.caption,
        authorId: post.authorId,
        tags: [],
        time: "",
      }));
      this.postsError = false;
    } else {
      this.recipes = [];
      this.postsError = true;
    }
    this.isLoadingPosts = false;
  }

  protected firstUpdated(_changed: Map<string, unknown>) {
    super.firstUpdated(_changed);
    this.loadDefaultResults();
  }

  private openProfile(username: string) {
    const cleanUsername = username.replace(/^@/, "");
    navigate(`/profile/${cleanUsername}`);
  }

  private openRecipe(id: string) {
    const cleanId = id.replace(/^@/, "");
    navigate(`/post/${cleanId}`);
  }

  render() {
    const profiles = this.profiles;
    const recipes = this.recipes;
    const hasQuery = Boolean(this.normalizedQuery);
    const showProfilesNoResults =
      hasQuery &&
      !this.isLoadingProfiles &&
      (this.profilesError || profiles.length === 0);
    const showRecipesNoResults =
      hasQuery &&
      !this.isLoadingPosts &&
      (this.postsError || recipes.length === 0);

    return html`
      <section class="flow-column component-container">
        <input
          class="input"
          placeholder=${CONSTANTS.SEARCH_INPUT_PLACEHOLDER}
          .value=${this.query}
          @input=${this.onSearchInput}
        />

        <div class="card">
          <div class="chip-muted">${CONSTANTS.SEARCH_POPULAR_TITLE}</div>
          <p>${CONSTANTS.SEARCH_POPULAR_TEXT}</p>
        </div>

        <div class="results">
          <div class="card">
            <div class="chip-muted section-title">Chefs</div>
            <div class="results-list">
              ${this.isLoadingProfiles
                ? html`<p class="empty">Cargando...</p>`
                : null}
              ${showProfilesNoResults
                ? html`<p class="empty">${CONSTANTS.NO_RESULTS_TEXT}</p>`
                : null}
              ${profiles.map(
                (profile) => html`
                  <div
                    class="profile-row"
                    @click=${() => this.openProfile(profile.id)}
                  >
                    <app-avatar></app-avatar>
                    <div class="profile-meta">
                      <span class="username">${'@' + (profile.username || profile.id)}</span
                      >
                      <span class="name">${profile.subtitle || ""}</span>
                    </div>
                  </div>
                `,
              )}
            </div>
          </div>

          <div class="card">
            <div class="chip-muted section-title">Recetas</div>
            <div class="results-list">
              ${this.isLoadingPosts
                ? html`<p class="empty">Cargando...</p>`
                : null}
              ${showRecipesNoResults
                ? html`<p class="empty">${CONSTANTS.NO_RESULTS_TEXT}</p>`
                : null}
              ${recipes.map(
                (recipe) => html`
                  <div
                    class="recipe-row"
                    @click=${() => this.openRecipe(recipe.id)}
                  >
                    <div class="recipe-title">${recipe.title}</div>
                    <div class="recipe-meta">
                      <span>@${recipe.authorId}</span
                      >
                      <span>${recipe.time}</span>
                    </div>
                    <div class="recipe-tags">
                      ${recipe.tags.map(
                        (tag) => html` <span class="recipe-tag">${tag}</span> `,
                      )}
                    </div>
                  </div>
                `,
              )}
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
