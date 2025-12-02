import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
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

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .component-container {
        justify-self: center;
        min-width: 20em;
        max-width: 40em;
        width: 60%;
      }

      .results {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .section-title {
        margin-bottom: 0.2rem;
      }

      .results-list {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-top: 0.4rem;
      }

      .profile-row,
      .recipe-row {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        padding-block: 0.35rem;
        cursor: pointer;
      }

      .recipe-row {
        align-items: flex-start;
        flex-direction: column;
      }

      .profile-meta {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }

      .username {
        font-weight: 600;
        font-size: 0.9rem;
      }

      .name {
        font-size: 0.82rem;
        color: var(--muted-foreground);
      }

      .recipe-title {
        font-weight: 600;
        font-size: 0.95rem;
      }

      .recipe-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        font-size: 0.8rem;
        color: var(--muted-foreground);
      }

      .recipe-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
      }

      .empty {
        font-size: 0.82rem;
        color: var(--muted-foreground);
        margin-top: 0.3rem;
      }
    `,
  ];

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
      this.profiles = [];
      this.recipes = [];
      this.profilesError = false;
      this.isLoadingProfiles = false;
      this.postsError = false;
      this.isLoadingPosts = false;
      return;
    }

    this.isLoadingProfiles = true;
    this.isLoadingPosts = true;
    this.profilesError = false;
    this.postsError = false;
    try {
      this.profiles = await friendService.search(q);
    } catch (err) {
      console.warn("Search profiles error", err);
      this.profiles = [];
      this.profilesError = true;
    } finally {
      this.isLoadingProfiles = false;
    }

    try {
      const posts = await postService.search(q);
      this.recipes = posts.map((post: Post) => ({
        id: post.id,
        title: post.caption,
        authorId: post.authorId,
        tags: [],
        time: "",
      }));
    } catch (err) {
      console.warn("Search posts error", err);
      this.recipes = [];
      this.postsError = true;
    } finally {
      this.isLoadingPosts = false;
    }
  }

  private openProfile(id: string) {
    navigate(`/profile/${id}`);
  }

  private openRecipe(id: string) {
    navigate(`/post/${id}`);
  }

  render() {
    const profiles = this.profiles;
    const recipes = this.recipes;
    const showProfilesNoResults =
      !this.isLoadingProfiles &&
      (this.profilesError || profiles.length === 0);
    const showRecipesNoResults =
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
                      <span class="username"
                        >${profile.username ||
                        `${CONSTANTS.USERNAME_PREFIX}${profile.id}`}</span
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
                      <span
                        >${CONSTANTS.USERNAME_PREFIX}${recipe.authorId}</span
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
