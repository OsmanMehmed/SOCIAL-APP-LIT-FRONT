import { LitElement, html, unsafeCSS } from "lit";
import "../components/app-mini-profile";
import componentsCSS from "../css/components.css?inline";
import pageProfileSettingsCSS from "../css/page-profile-settings.css?inline";
import { customElement, state, property } from "lit/decorators.js";
import { navigate } from "../router";
import { CONSTANTS } from "../shared/constants";
import type { UserProfile } from "../modelos/user-profile";
import { profileService } from "../servicios/core/profile-service";
import { authStore } from "../state/auth-store";

@customElement("page-profile-settings")
export class PageProfileSettings extends LitElement {
  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageProfileSettingsCSS)];

  @property({ attribute: false }) params?: { id?: string };
  @state() private name = "";
  @state() private specialty = "";
  @state() private url = "";
  @state() private error = "";
  @state() private profile?: UserProfile;
  @state() private isSaving = false;

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

    const username =
      this.name.trim() || this.profile?.username?.replace(/^@/, "") || "";
    const subtitle = this.specialty.trim() || this.profile?.subtitle || "";
    const profileUrl = this.url.trim() || this.profile?.url || "";
    const profileId =
      this.profile?.id || authStore.currentUserId || CONSTANTS.CURRENT_USER_ID;
    if (!username) {
      this.error = "El nombre es obligatorio.";
      return;
    }
    this.isSaving = true;
    this.error = "";
    profileService
      .updateProfile(profileId, {
        username,
        subtitle,
        url: profileUrl,
        avatarUrl: this.profile?.avatarUrl,
        friend: Boolean(this.profile?.friend),
        banned: Boolean(this.profile?.banned),
      })
      .then((updated) => {
        this.profile = updated;
        this.goBack();
      })
      .catch((err) => {
        this.error = err?.message || "No se pudo guardar el perfil.";
      })
      .finally(() => {
        this.isSaving = false;
      });
  }

  private cancel() {
    this.goBack();
  }

  protected firstUpdated(): void {
    const profileId =
      this.params?.id || authStore.currentUserId || CONSTANTS.CURRENT_USER_ID;
    profileService.fetchProfile(profileId).then((profile) => {
      this.profile = profile;
      this.name = profile.username?.replace(/^@/, "") || "";
      this.specialty = profile.subtitle || "";
      this.url = profile.url || "";
    });
  }

  private handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const profileId =
        this.profile?.id ||
        authStore.currentUserId ||
        CONSTANTS.CURRENT_USER_ID;
      if (!profileId) return;

      this.isSaving = true;
      this.error = "";
      profileService
        .uploadAvatar(profileId, file)
        .then((updated) => {
          this.profile = updated;
        })
        .catch((err) => {
          this.error = "Error al subir la imagen";
        })
        .finally(() => {
          this.isSaving = false;
        });
    }
  }

  private triggerFileUpload() {
    const input = this.shadowRoot?.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    input?.click();
  }

  render() {
    return html`
      <div class="component-container">
        <form class="edit-profile-card card" @submit=${this.save}>
          <div class="chip-muted">${CONSTANTS.PROFILE_SETTINGS_TITLE}</div>

          <div
            style="margin: 1rem 0; cursor: pointer; display: flex; justify-content: center;"
            @click=${this.triggerFileUpload}
          >
            <app-mini-profile
              .username=${this.name || this.profile?.username || ""}
              .subtitle=${this.specialty ||
              this.profile?.subtitle ||
              "Click para cambiar foto"}
              .avatarUrl=${this.profile?.avatarUrl || ""}
              .supressProfileRoute=${true}
              .onlyAvatar=${true}
              .large=${true}
            ></app-mini-profile>
          </div>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            style="display: none"
            @change=${this.handleFileChange}
          />

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
            <button class="btn btn-sm" type="submit" ?disabled=${this.isSaving}>
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
