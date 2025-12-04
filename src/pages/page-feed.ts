import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import pageFeedCSS from "../css/page-feed.css?inline";
import { customElement, state } from "lit/decorators.js";
import "../components/app-mini-profile";
import "../components/app-post-card";
import { CONSTANTS } from "../shared/constants";
import { ScrollPage } from "../shared/scroll-page";
import { postService } from "../servicios/core/post-service";
import { profileService } from "../servicios/core/profile-service";
import type { Post } from "../modelos/post";
import type { UserProfile } from "../modelos/user-profile";

@customElement("page-feed")
export class PageFeed extends ScrollPage {
  @state() private posts: Post[] = [];
  @state() private authorProfiles: Map<string, UserProfile> = new Map();
  @state() private isLoading = false;
  @state() private loadError = false;

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageFeedCSS)];

  private async loadPosts() {
    this.isLoading = true;
    this.loadError = false;
    try {
      const posts = await postService.list();
      this.posts = posts;
      
      // Cargar perfiles de autores
      const profilesMap = new Map<string, UserProfile>();
      const uniqueAuthorIds = [...new Set(posts.map(p => p.authorId))];
      
      for (const authorId of uniqueAuthorIds) {
        try {
          const profile = await profileService.fetchProfile(authorId);
          profilesMap.set(authorId, profile);
        } catch (error) {
          console.error(`Error cargando perfil de ${authorId}:`, error);
        }
      }
      
      this.authorProfiles = profilesMap;
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
          const profile = this.authorProfiles.get(post.authorId);
          const username = profile?.username || `${CONSTANTS.USERNAME_PREFIX}${post.authorId}`;
          const subtitle = profile?.subtitle || "";
          return html`
            <app-post-card
              .postId=${post.id}
              .username=${username}
              .subtitle=${subtitle}
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
