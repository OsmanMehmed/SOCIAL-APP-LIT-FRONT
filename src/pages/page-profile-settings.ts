import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import pageProfileSettingsCSS from "../css/page-profile-settings.css?inline";
import { customElement, state } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";

@customElement("page-profile-settings")
export class PageProfileSettings extends LitElement {
  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageProfileSettingsCSS)];

  @state() private name = "";
  @state() private specialty = "";
  @state() private url = "";
  @state() private error = "";

  private goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/profile");
    }
  }

  private onInput(e: Event, key: "name" | "specialty" | "url") {
    const value = (e.target as HTMLInputElement)?.value ?? "";
    this[key] = value;
    const hasAnyValue =
      this.name.trim() !== "" ||
      this.specialty.trim() !== "" ||
      this.url.trim() !== "";
    if (hasAnyValue) {
      this.error = "";
    }
  }

  private save(e: Event) {
    e.preventDefault();
    const hasAnyValue =
      this.name.trim() !== "" ||
      this.specialty.trim() !== "" ||
      this.url.trim() !== "";

    if (!hasAnyValue) {
      this.error = "Rellena al menos un campo para guardar.";
      return;
    }

    this.error = "";
    this.goBack();
  }

  private cancel() {
    this.goBack();
  }

  render() {
    return html`
      <div class="component-container">
        <form class="edit-profile-card card" @submit=${this.save}>
          <div class="chip-muted">${CONSTANTS.PROFILE_SETTINGS_TITLE}</div>
          <input
            class="input edit-profile-input"
            placeholder=${CONSTANTS.PROFILE_SETTINGS_NAME}
            .value=${this.name}
            @input=${(e: Event) => this.onInput(e, "name")}
          />
          <input
            class="input edit-profile-input"
            placeholder=${CONSTANTS.PROFILE_SETTINGS_SPECIALITY}
            .value=${this.specialty}
            @input=${(e: Event) => this.onInput(e, "specialty")}
          />
          <input
            class="input edit-profile-input"
            placeholder=${CONSTANTS.PROFILE_SETTINGS_URL}
            .value=${this.url}
            @input=${(e: Event) => this.onInput(e, "url")}
          />
          ${this.error
            ? html`<div class="form-error" role="alert">${this.error}</div>`
            : null}
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
