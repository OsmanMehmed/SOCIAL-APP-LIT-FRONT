import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import "../components/app-mini-profile";
import "../components/app-post-card";
import {
  FEED_POST1_USERNAME,
  FEED_POST1_CAPTION,
  FEED_POST2_USERNAME,
  FEED_POST2_CAPTION,
  FEED_SIDEBAR_TITLE,
  FEED_SIDEBAR_TEXT,
} from "../shared/constants";

@customElement("page-feed")
export class PageFeed extends LitElement {
  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .grid {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(220px, 0.9fr);
        gap: 0.9rem;
      }
      @media (max-width: 800px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .flow-column {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }
    `,
  ];

  render() {
    return html`
      <div class="grid">
        <section class="flow-column">
          <app-post-card
            postId="1"
            username=${FEED_POST1_USERNAME}
            caption=${FEED_POST1_CAPTION}
          ></app-post-card>
          <app-post-card
            postId="2"
            username=${FEED_POST2_USERNAME}
            caption=${FEED_POST2_CAPTION}
          ></app-post-card>
        </section>
        <aside class="sidebar">
          <app-mini-profile></app-mini-profile>
          <div class="card">
            <div class="chip-muted">${FEED_SIDEBAR_TITLE}</div>
            <div style="margin-top:0.3rem;">${FEED_SIDEBAR_TEXT}</div>
          </div>
        </aside>
      </div>
    `;
  }
}
