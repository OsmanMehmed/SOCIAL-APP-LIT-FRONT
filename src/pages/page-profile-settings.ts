import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import {
  CONSTANTS
} from "../shared/constants";

@customElement("page-profile-settings")
export class PageProfileSettings extends LitElement {
  createRenderRoot() {
    return this;
  }

  static styles = [unsafeCSS(componentsCSS), css`
    .buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    
    `];

  private save(e: Event) {
    e.preventDefault();
    navigate("/profile/me");
  }

  private cancel() {
    navigate("/profile/me");
  }

  render() {
    return html`
      <form class="flow-column card" @submit=${this.save}>
        <div class="chip-muted">${CONSTANTS.PROFILE_SETTINGS_TITLE}</div>
        <input class="input" placeholder=${CONSTANTS.PROFILE_SETTINGS_NAME}/>
        <input
          class="input"
          placeholder=${CONSTANTS.PROFILE_SETTINGS_SPECIALITY}
        />
        <input class="input" placeholder=${CONSTANTS.PROFILE_SETTINGS_URL}/>
        <div class="buttons">
          <button class="btn btn-sm" type="submit">
            ${CONSTANTS.PROFILE_SETTINGS_SAVE}
          </button>
          <button
            class="btn-outline btn-sm"
            type="button"
            @click=${this.cancel}
          >
            ${CONSTANTS.PROFILE_SETTINGS_CANCEL}
          </button>
        </div>
      </form>
    `;
  }
}
