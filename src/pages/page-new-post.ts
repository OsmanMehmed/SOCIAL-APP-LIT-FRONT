import { LitElement, html, css, unsafeCSS } from "lit";
import componentsCSS from "../design-system/components.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";

@customElement("page-new-post")
export class PageNewPost extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: String }) body = "";
  @property({ attribute: false }) images: File[] = [];

  @state() private errorMessage: string | null = null;
  @state() private draggingIndex: number | null = null;

  static styles = [
    unsafeCSS(componentsCSS),
    css`
      .new-post-title {
        margin-block: 1em;
        font-size: 1.3rem;
        font-weight: 600;
        text-align: center;
      }

      .new-post-card {
        width: 50em;
      }

      .form {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }

      .form-label {
        margin-left: 1em;
        margin-bottom: 0.5em;
        margin-top: 1em;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--red-dark);
      }

      textarea.input {
        min-height: 140px;
        resize: vertical;
      }

      .form-actions {
        margin-top: 0.6rem;
      }

      .error {
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: var(--red-dark);
      }

      .images-list {
        margin: 0.5rem 0 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .image-item {
        width: 96%;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.4rem 0.6rem;
        border-radius: 0.4rem;
        border: 1px solid var(--border-subtle, #ddd);
        background-color: var(--bg-subtle, #fafafa);
      }

      .image-item.dragging {
        opacity: 0.7;
        outline: 1px dashed var(--primary, #c00);
      }

      .drag-handle {
        border: none;
        background: transparent;
        padding: 0.2rem 0.3rem;
        cursor: grab;
        font-size: 1rem;
      }

      .drag-handle:active {
        cursor: grabbing;
      }

      .file-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }

      .file-name {
        font-size: 0.85rem;
        font-weight: 500;
      }

      .file-size {
        font-size: 0.75rem;
        opacity: 0.7;
      }

      .remove-btn {
        width: 10em;
        font-size: 0.8rem;
        white-space: nowrap;
      }

      .input {
        width: 95%;
      }

      .recipe-images::file-selector-button,
      .recipe-images::-webkit-file-upload-button {
        font-family: var(--font-sans);
        font-size: 0.8rem;
        border-radius: 999px;
        border: 1px solid transparent;
        padding: 0.35rem 0.9rem;
        background: transparent;
        color: var(--foreground);
        cursor: pointer;
        transition: background-color 0.16s ease, border-color 0.16s ease,
          color 0.16s ease;
      }

      .recipe-images::file-selector-button:hover,
      .recipe-images::-webkit-file-upload-button:hover {
        background-color: var(--btn-ghost-bg, rgba(0, 0, 0, 0.03));
        border-color: var(--border-subtle);
      }

      .file-input-wrapper {
        position: relative;
      }

      .file-input-display {
        width: 25em;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        pointer-events: none; /* el click pasa al input real */
      }

      .file-input-trigger {
        pointer-events: none;
      }

      .file-input-text {
        font-family: var(--font-sans);
        font-size: 0.9rem;
        color: var(--muted-foreground, #555);
        white-space: nowrap;
      }

      .recipe-images {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }
    `,
  ];

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
          f.lastModified === file.lastModified
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

  private handleSubmit(e: Event) {
    e.preventDefault();

    const trimmedTitle = this.title.trim();
    const trimmedBody = this.body.trim();

    if (!trimmedTitle || !trimmedBody) {
      this.errorMessage = "Debes indicar al menos título y cuerpo.";
      return;
    }

    const payload = {
      title: trimmedTitle,
      body: trimmedBody,
      images: this.images, // File[] en el orden establecido
    };

    this.errorMessage = null;

    this.dispatchEvent(
      new CustomEvent("recipe-submit", {
        detail: payload,
        bubbles: true,
        composed: true,
      })
    );
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
                            class="btn btn-ghost remove-btn"
                            @click=${() => this.removeImage(index)}
                          >
                            Eliminar
                          </button>
                        </li>
                      `
                    )}
                  </ul>
                `
              : null}
          </div>

          <div class="form-field">
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

          ${this.errorMessage
            ? html`<div class="error">${this.errorMessage}</div>`
            : null}

          <div class="form-actions">
            <button class="btn" type="submit">Guardar receta</button>
          </div>
        </form>
      </div>
    `;
  }
}
