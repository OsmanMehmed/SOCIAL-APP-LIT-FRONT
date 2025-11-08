import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property } from "lit/decorators.js";
import { navigate } from "../router";
import {
  PROFILE_EDIT_BUTTON,
  PROFILE_PUBLISHED_RECIPES,
  PROFILE_PUBLISHED_GRID_TEXT,
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

  static styles = [unsafeCSS(componentsCSS)];

  private openDm() {
    navigate("/dm/me");
  }

  render() {
    const id = this.params?.id ?? "me";
    return html`
      <section class="flow-column">
        <div class="card">
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <app-avatar .size=${64}></app-avatar>
            <div>
              <h2>@${id}</h2>
              <div class="chip-muted">Perfil de creador de recetas</div>
            </div>
          </div>
          <div style="display:flex;gap:0.4rem;margin-top:0.5rem;">
            <button class="btn-outline btn-pill btn-sm" @click=${this.openDm}>
              Mensaje
            </button>
            <button
              class="btn-outline btn-pill btn-sm"
              @click=${this.editProfile}
            >
              ${PROFILE_EDIT_BUTTON}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="chip-muted">${PROFILE_PUBLISHED_RECIPES}</div>
          <p>${PROFILE_PUBLISHED_GRID_TEXT}</p>
        </div>
      </section>
    `;
  }
}
