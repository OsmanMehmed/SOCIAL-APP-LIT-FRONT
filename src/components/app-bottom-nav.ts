import { LitElement, html, css, unsafeCSS } from "lit";
import layoutCSS from "../design-system/layout.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import "./app-icon-button";

@customElement("app-bottom-nav")
export class AppBottomNav extends LitElement {
  static styles = [unsafeCSS(layoutCSS), css``];

  render() {
    return html`
      <nav class="bottom-nav">
        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_HOME}
          @click=${() => {
            window.dispatchEvent(new CustomEvent("app:clear-scroll"));
            navigate("/feed");
          }}
        >
          <sl-icon name="house-door"></sl-icon>
        </app-icon-button>

        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_SEARCH}
          @click=${() => {
            window.dispatchEvent(new CustomEvent("app:clear-scroll"));
            navigate("/search");
          }}
        >
          <sl-icon name="search"></sl-icon>
        </app-icon-button>

        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_NEW_RECIPE}
          @click=${() => {
            window.dispatchEvent(new CustomEvent("app:clear-scroll"));
            navigate("/new-post");
          }}
        >
          <sl-icon name="plus-square"></sl-icon>
        </app-icon-button>

        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_MESSAGES}
          @click=${() => {
            window.dispatchEvent(new CustomEvent("app:clear-scroll"));
            navigate("/messages");
          }}
        >
          <sl-icon name="send"></sl-icon>
        </app-icon-button>

        <app-icon-button
          label=${CONSTANTS.NAV_LABEL_PROFILE}
          @click=${() => {
            window.dispatchEvent(new CustomEvent("app:clear-scroll"));
            navigate(`/profile`);
          }}
        >
          <sl-icon name="person-circle"></sl-icon>
        </app-icon-button>
      </nav>
    `;
  }
}
