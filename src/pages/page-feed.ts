import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, state } from "lit/decorators.js";
import "../components/app-mini-profile";
import "../components/app-post-card";
import { CONSTANTS } from "../shared/constants";
import { ScrollPage } from "../shared/scroll-page";
import { postService } from "../servicios/core/post-service";
import type { Post } from "../modelos/post";

@customElement("page-feed")
export class PageFeed extends ScrollPage {
  @state() private posts: Post[] = [];
  @state() private isLoading = false;
  @state() private loadError = false;

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .component-container {
        justify-self: center;
      }

      @media (max-width: 65em) {
        .component-container {
          max-width: 35em;
          min-width: 20em;
        }
      }

      .grid {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(275px, 0.9fr);
        gap: 0.9rem;
      }

      .flow-column {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }

      .no-results {
        text-align: center;
      }
    `,
  ];

  private async loadPosts() {
    this.isLoading = true;
    this.loadError = false;
    try {
      this.posts = await postService.list();
    } catch {
      this.posts = [];
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  }

  protected firstUpdated() {
    this.loadPosts();
    // Restaura scroll si estamos volviendo (pop/back)
    this.restoreScrollIfNeeded("/feed");
  }

  protected updated(changed: Map<string, unknown>) {
    // Si los posts terminaron de cargar, restaura scroll nuevamente
    if (changed.has("isLoading") && !this.isLoading && this.posts.length > 0) {
      this.restoreScrollIfNeeded("/feed");
    }
  }

  render() {
    const showNoResults =
      !this.isLoading && (this.loadError || this.posts.length === 0);

    return html`
      <section class="flow-column component-container">
        ${this.isLoading
          ? html`<div class="card no-results">Cargando...</div>`
          : null}

        ${showNoResults
          ? html`<div class="card no-results">
              ${CONSTANTS.NO_RESULTS_TEXT}
            </div>`
          : null}

        ${this.posts.map((post) => {
          const username = post.authorId?.startsWith(CONSTANTS.USERNAME_PREFIX)
            ? post.authorId
            : `${CONSTANTS.USERNAME_PREFIX}${post.authorId}`;
          return html`
            <app-post-card
              .postId=${post.id}
              .username=${username}
              .caption=${post.caption}
              .banned=${Boolean(post.banned)}
              .liked=${Boolean(post.liked)}
              .likes=${post.likes}
              .comments=${post.comments}
              .saves=${post.saves}
            ></app-post-card>
          `;
        })}
      </section>
    `;
  }
}
