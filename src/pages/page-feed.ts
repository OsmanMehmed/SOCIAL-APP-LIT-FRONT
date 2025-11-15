import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import "../components/app-mini-profile";
import "../components/app-post-card";
import {
  CONSTANTS
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
      .flow-column {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }
    `,
  ];

  render() {
    return html`
        <section class="flow-column">
          <app-post-card
            postId="1"
            username=${CONSTANTS.FEED_POST1_USERNAME}
            caption=${CONSTANTS.FEED_POST1_CAPTION}
          ></app-post-card>
          <app-post-card
            postId="2"
            username=${CONSTANTS.FEED_POST2_USERNAME}
            caption=${CONSTANTS.FEED_POST2_CAPTION}
          ></app-post-card>
        </section>
    `;
  }
}
