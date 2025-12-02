import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import newPostCSS from "../design-system/page-new-post.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import { postService } from "../servicios/core/post-service";
import { authStore } from "../state/auth-store";
import { navigate } from "../router";

@customElement("page-new-post")
export class PageNewPost extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: String }) body = "";
  @property({ attribute: false }) images: File[] = [];

  @state() private errorMessage: string | null = null;
  @state() private draggingIndex: number | null = null;
  @state() private tags: string[] = [];
  @state() private newTag = "";

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(newPostCSS)];

  private addTag() {
    let t = this.newTag.trim();
    if (!t) return;

    if (t.startsWith("#")) {
      t = t.slice(1).trim();
    }

    if (!t || this.tags.includes(t)) return;
    this.tags = [...this.tags, t];
    this.newTag = "";
  }

  private removeTag(t: string) {
    this.tags = this.tags.filter((x) => x !== t);
  }

  private onTagInput(e: any) {
    this.newTag = e.target.value;
  }

  private onTagKey(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.addTag();
    }
  }

  private onTitleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.title = target.value;
    this.errorMessage = null;
  }

  private onBodyInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.body = target.value;
    this.errorMessage = null;
  }

  private onImagesChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    const current = [...this.images];
    const incoming = Array.from(files);

    for (const file of incoming) {
      const exists = current.some(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified,
      );
      if (!exists) current.push(file);
    }

    this.images = current;
    input.value = "";
  }

  private removeImage(index: number) {
    this.images = this.images.filter((_, i) => i !== index);
  }

  private onDragStart(e: DragEvent, index: number) {
    this.draggingIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    }
  }

  private onDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  private onDrop(e: DragEvent, targetIndex: number) {
    e.preventDefault();

    let fromIndex = this.draggingIndex;
    if (fromIndex == null && e.dataTransfer) {
      const data = e.dataTransfer.getData("text/plain");
      const parsed = Number.parseInt(data, 10);
      if (!Number.isNaN(parsed)) {
        fromIndex = parsed;
      }
    }

    if (
      fromIndex == null ||
      fromIndex < 0 ||
      fromIndex >= this.images.length ||
      fromIndex === targetIndex
    ) {
      this.draggingIndex = null;
      return;
    }

    const updated = [...this.images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(targetIndex, 0, moved);
    this.images = updated;
    this.draggingIndex = null;
  }

  private onDragEnd() {
    this.draggingIndex = null;
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const trimmedTitle = this.title.trim();
    const trimmedBody = this.body.trim();

    if (!trimmedTitle || !trimmedBody) {
      this.errorMessage = "Debes indicar al menos título y cuerpo.";
      return;
    }

    this.errorMessage = null;

    try {
      const created = await postService.create({
        id: "",
        caption: `${trimmedTitle} - ${trimmedBody}`,
        authorId: authStore.currentUserId || CONSTANTS.CURRENT_USER_ID,
        likes: 0,
        comments: 0,
        saves: 0,
      });
      if (created.id) {
        navigate(`/post/${created.id}`);
      } else {
        this.errorMessage = CONSTANTS.NO_RESULTS_TEXT;
      }
    } catch (err) {
      console.warn("Create post error", err);
      this.errorMessage = CONSTANTS.NO_RESULTS_TEXT;
    }
  }

  private formatSize(size: number): string {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(size / 1024).toFixed(1)} KB`;
  }

  render() {
    return html`
      <div class="card new-post-card">
        <div class="new-post-title">
          <span>Crear nueva receta</span>
        </div>

        <form class="form" @submit=${this.handleSubmit}>
          <div class="form-field">
            <label class="form-label" for="recipe-title">Título</label>
            <input
              id="recipe-title"
              class="input"
              type="text"
              .value=${this.title}
              @input=${this.onTitleInput}
              placeholder="Título de la receta"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-label" for="recipe-images">Imágenes</label>

            <div class="file-input-wrapper">
              <div class="file-input-display">
                <button
                  type="button"
                  class="btn btn-ghost file-input-trigger"
                  tabindex="-1"
                >
                  Elegir archivos
                </button>
                <span class="file-input-text">
                  ${this.images.length === 0
                    ? "Ningún archivo seleccionado"
                    : `${this.images.length} archivo${
                        this.images.length > 1 ? "s" : ""
                      } seleccionados`}
                </span>
              </div>

              <input
                id="recipe-images"
                class="input recipe-images"
                type="file"
                multiple
                @change=${this.onImagesChange}
              />
            </div>

            ${this.images.length
              ? html`
                  <ul class="images-list">
                    ${this.images.map(
                      (file, index) => html`
                        <li
                          class="image-item ${this.draggingIndex === index
                            ? "dragging"
                            : ""}"
                          draggable="true"
                          @dragstart=${(e: DragEvent) =>
                            this.onDragStart(e, index)}
                          @dragover=${this.onDragOver}
                          @drop=${(e: DragEvent) => this.onDrop(e, index)}
                          @dragend=${this.onDragEnd}
                        >
                          <button
                            type="button"
                            class="drag-handle"
                            aria-label="Reordenar imagen"
                          >
                            ⠿
                          </button>
                          <div class="file-info">
                            <span class="file-name">${file.name}</span>
                            <span class="file-size"
                              >${this.formatSize(file.size)}</span
                            >
                          </div>
                          <button
                            type="button"
                            class="btn-no-fill btn-ghost remove-btn"
                            @click=${() => this.removeImage(index)}
                          >
                            Eliminar
                          </button>
                        </li>
                      `,
                    )}
                  </ul>
                `
              : null}
          </div>

          <div class="form-field recipe-body-container">
            <label class="form-label" for="recipe-body">Cuerpo</label>
            <textarea
              id="recipe-body"
              class="input"
              .value=${this.body}
              @input=${this.onBodyInput}
              placeholder="Describe la receta, pasos, ingredientes..."
              required
            ></textarea>
          </div>

          <label class="form-label" for="recipe-body">Etiquetas</label>
          <div class="tag-input-row">
            <input
              class="input tag-input"
              placeholder="Añadir etiqueta..."
              .value=${this.newTag}
              @input=${this.onTagInput}
              @keydown=${this.onTagKey}
            />
            <button
              type="button"
              class="btn-no-fill btn-pill btn-sm tag-add-btn"
              @click=${this.addTag}
            >
              Añadir
            </button>
          </div>
          <div class="tags-container">
            ${this.tags.map(
              (t) => html`
                <span class="tag">
                  #${t}
                  <button @click=${() => this.removeTag(t)}>×</button>
                </span>
              `,
            )}
          </div>

          ${this.errorMessage
            ? html`<div class="error">${this.errorMessage}</div>`
            : null}

          <div class="form-actions">
            <button class="btn save-button" type="submit">
              Guardar receta
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
