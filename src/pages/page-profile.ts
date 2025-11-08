import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONSTANTS
} from "../shared/constants";
import "../components/app-avatar";

@customElement("page-profile")
export class PageProfile extends LitElement {
  @property({ attribute: false }) params?: { id?: string };

  createRenderRoot() {
    return this;
  }

  private editProfile() {
    navigate("/profile-settings");
  }

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .buttons-1 {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items:center;
      }

      .buttons-2 {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
        place-content: space-between;
      }
    `,
  ];

  private openDm() {
    navigate("/dm/me");
  }

  render() {
    const id = this.params?.id ?? "me";
    return html`
      <section class="flow-column">
        <div class="card">
          <div class="buttons-1">
            <app-avatar .size=${64}></app-avatar>
            <div>
              <h2>@${id}</h2>
            </div>
          </div>
          <div class="buttons-2">
            <button class="btn-outline btn-pill btn-sm" @click=${this.openDm}>
              Mensaje
            </button>
            <button
              class="btn-outline btn-pill btn-sm"
              @click=${this.editProfile}
            >
              ${CONSTANTS.PROFILE_EDIT_BUTTON}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="chip-muted">${CONSTANTS.PROFILE_PUBLISHED_RECIPES}</div>
        </div>
      </section>
    `;
  }
}
