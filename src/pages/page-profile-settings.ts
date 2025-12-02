import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import profileSettingsCSS from "../styles/pages/page-profile-settings.css?inline";
import { customElement } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import { authStore } from "../state/auth-store";

@customElement("page-profile-settings")
export class PageProfileSettings extends LitElement {
  static styles = [unsafeCSS(componentsCSS), unsafeCSS(profileSettingsCSS)];

  private save(e: Event) {
    e.preventDefault();
    navigate(`/profile`);
  }

  private cancel() {
    navigate(`/profile`);
  }

  render() {
    return html`
      <div class="component-container">
        <form class="edit-profile-card card" @submit=${this.save}>
          <div class="chip-muted">${CONSTANTS.PROFILE_SETTINGS_TITLE}</div>
          <input
            class="input edit-profile-input"
            placeholder=${CONSTANTS.PROFILE_SETTINGS_NAME}
          />
          <input
            class="input edit-profile-input"
            placeholder=${CONSTANTS.PROFILE_SETTINGS_SPECIALITY}
          />
          <input
            class="input edit-profile-input"
            placeholder=${CONSTANTS.PROFILE_SETTINGS_URL}
          />
          <div class="buttons">
            <button class="btn btn-sm" type="submit">
              ${CONSTANTS.PROFILE_SETTINGS_SAVE}
            </button>
            <button
              class="btn-no-fill btn-sm"
              type="button"
              @click=${this.cancel}
            >
              ${CONSTANTS.PROFILE_SETTINGS_CANCEL}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
