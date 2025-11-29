import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, state } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import "../components/app-avatar";

interface SearchProfile {
  id: string;
  name: string;
}

interface SearchRecipe {
  id: string;
  title: string;
  authorId: string;
  tags: string[];
  time: string;
}

@customElement("page-search")
export class PageSearch extends LitElement {
  @state() private query = "";

  // Mocks de resultados
  private readonly mockProfiles: SearchProfile[] = [
    { id: "ana.cocina", name: "Cocina casera y panes" },
    { id: "osman.chef", name: "Meal prep saludable" },
    { id: "veggie.vibes", name: "Recetas plant based" },
  ];

  private readonly mockRecipes: SearchRecipe[] = [
    {
      id: "1",
      title: "Pizza napolitana casera",
      authorId: "ana.cocina",
      tags: ["italiana", "masa madre"],
      time: "45 min",
    },
    {
      id: "2",
      title: "Ramen casero de pollo",
      authorId: "osman.chef",
      tags: ["asiática", "comfort food"],
      time: "30 min",
    },
    {
      id: "3",
      title: "Tiramisú clásico",
      authorId: "veggie.vibes",
      tags: ["postre", "sin horno"],
      time: "20 min",
    },
  ];

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
  }

  private get normalizedQuery(): string {
    return this.query.trim().toLowerCase();
  }

  // Perfiles: búsqueda por @usuario o por nombre visible
  private get filteredProfiles(): SearchProfile[] {
    const q = this.normalizedQuery;
    if (!q) return this.mockProfiles;

    const withoutPrefix = q.startsWith(CONSTANTS.USERNAME_PREFIX)
      ? q.slice(CONSTANTS.USERNAME_PREFIX.length)
      : q;

    return this.mockProfiles.filter((profile) => {
      const username =
        `${CONSTANTS.USERNAME_PREFIX}${profile.id}`.toLowerCase();
      return (
        username.includes(q) ||
        profile.name.toLowerCase().includes(withoutPrefix)
      );
    });
  }

  // Recetas: búsqueda por título
  private get filteredRecipes(): SearchRecipe[] {
    const q = this.normalizedQuery;
    if (!q) return this.mockRecipes;

    return this.mockRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(q),
    );
  }

  private openProfile(id: string) {
    navigate(`/profile/${id}`);
  }

  private openRecipe(id: string) {
    navigate(`/post/${id}`);
  }

  render() {
    const profiles = this.filteredProfiles;
    const recipes = this.filteredRecipes;

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
              ${profiles.length
                ? profiles.map(
                    (profile) => html`
                      <div
                        class="profile-row"
                        @click=${() => this.openProfile(profile.id)}
                      >
                        <app-avatar></app-avatar>
                        <div class="profile-meta">
                          <span class="username"
                            >${CONSTANTS.USERNAME_PREFIX}${profile.id}</span
                          >
                          <span class="name">${profile.name}</span>
                        </div>
                      </div>
                    `,
                  )
                : html`<p class="empty">No se han encontrado chefs.</p>`}
            </div>
          </div>

          <div class="card">
            <div class="chip-muted section-title">Recetas</div>
            <div class="results-list">
              ${recipes.length
                ? recipes.map(
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
                            (tag) => html`
                              <span class="recipe-tag">${tag}</span>
                            `,
                          )}
                        </div>
                      </div>
                    `,
                  )
                : html`<p class="empty">No se han encontrado recetas.</p>`}
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
