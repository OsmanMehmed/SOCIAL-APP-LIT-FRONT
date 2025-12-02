import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import pageFeedCSS from "../styles/pages/page-feed.css?inline";
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

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageFeedCSS)];

  private async loadPosts() {
    this.isLoading = true;
    this.loadError = false;
    try {
      this.posts = await postService.list();
    } catch (err) {
      console.warn("Feed load error", err);
      this.posts = [];
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  }

  protected firstUpdated() {
    console.log(`[page-feed] firstUpdated called`);
    this.loadPosts();
    // Restaura scroll si estamos volviendo (pop/back)
    this.restoreScrollIfNeeded("/feed");
  }

  protected updated(changed: Map<string, unknown>) {
    // Si los posts terminaron de cargar, restaura scroll nuevamente
    if (changed.has("isLoading") && !this.isLoading && this.posts.length > 0) {
      console.log(`[page-feed] Posts loaded, attempting scroll restore`);
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
