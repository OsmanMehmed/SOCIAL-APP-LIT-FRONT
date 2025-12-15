import { LitElement, html, unsafeCSS } from "lit";
import componentsCSS from "../css/components.css?inline";
import "../components/app-fallback";
import pageNewPostCSS from "../css/page-new-post.css?inline";
import { customElement, property, state } from "lit/decorators.js";
import { CONSTANTS } from "../shared/constants";
import { postService } from "../servicios/core/post-service";
import { authStore } from "../state/auth-store";
import { navigate } from "../router";

@customElement("page-new-post")
export class PageNewPost extends LitElement {
  @property({ attribute: false }) params?: { id?: string };
  @property({ type: Boolean }) isEdit = false;
  @property({ type: String }) title = "";
  @property({ type: String }) description = "";
  @property({ type: String }) body = "";
  @property({ attribute: false }) images: File[] = [];

  @state() private errorMessage: string | null = null;
  @state() private draggingIndex: number | null = null;
  @state() private tags: string[] = [];
  @state() private newTag = "";
  @state() private isLoading = false;
  @state() private existingImages: string[] = [];
  @state() private loadedPostId = "";
  @state() private existingStats = {
    likes: 0,
    comments: 0,
    saves: 0,
    banned: false,
  };

  static styles = [unsafeCSS(componentsCSS), unsafeCSS(pageNewPostCSS)];

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

  private onDescriptionInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.description = target.value;
    this.errorMessage = null;
  }

  private onImagesChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    const current = [...this.images];
    const incoming = Array.from(files);

    let rejected = false;
    for (const file of incoming) {
      const isImage =
        (file.type && file.type.startsWith("image/")) ||
        /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name);
      if (!isImage) {
        rejected = true;
        continue;
      }

      const exists = current.some(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified
      );
      if (!exists) current.push(file);
    }

    this.images = current;
    if (rejected) {
      this.errorMessage = CONSTANTS.NEW_POST_ONLY_IMAGES_ERROR;
    }
    input.value = "";
  }

  private removeImage(index: number) {
    this.images = this.images.filter((_, i) => i !== index);
  }

  private removeExistingImage(index: number) {
    this.existingImages = this.existingImages.filter((_, i) => i !== index);
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

  protected firstUpdated() {
    if (this.isEdit && this.params?.id) {
      this.loadExisting(this.params.id);
    }
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (this.isEdit && (changed.has("params") || changed.has("isEdit"))) {
      const id = this.params?.id ?? "";
      if (id && id !== this.loadedPostId) {
        this.loadExisting(id);
      }
    }
  }

  private async loadExisting(id: string) {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const data = await postService.fetchPostDetails(id);
      this.title = data.title ?? "";
      this.description = data.description ?? "";
      this.body = data.caption ?? "";
      this.loadedPostId = data.id ?? id;
      this.existingImages =
        data.imageUrls && data.imageUrls.length
          ? data.imageUrls
          : data.imageUrl
            ? [data.imageUrl]
            : [];
      this.existingStats = {
        likes: data.likes ?? 0,
        comments: data.comments ?? data.commentsList?.length ?? 0,
        saves: data.saves ?? 0,
        banned: Boolean(data.banned),
      };
      this.images = [];
      this.tags = data.tags ?? [];
      this.newTag = "";
    } catch (_err) {
      this.errorMessage = CONSTANTS.NO_RESULTS_TEXT;
    } finally {
      this.isLoading = false;
    }
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.isEdit && !this.params?.id) {
      this.errorMessage = CONSTANTS.NO_RESULTS_TEXT;
      return;
    }

    const trimmedTitle = this.title.trim();
    const trimmedDescription = this.description.trim();
    const trimmedBody = this.body.trim();

    if (!trimmedTitle || !trimmedDescription || !trimmedBody) {
      this.errorMessage = CONSTANTS.NEW_POST_REQUIRED_ERROR;
      return;
    }

    this.errorMessage = null;

    if (this.isEdit && this.params?.id) {
      const postId = this.params.id;
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("description", trimmedDescription);
      formData.append("caption", trimmedBody);
      this.images.forEach((file) => formData.append("images", file));
      this.existingImages.forEach((url) =>
        formData.append("existingImages", url)
      );
      if (this.tags.length > 0) {
        this.tags.forEach((tag) => formData.append("tags", tag));
      }
      const updated = await postService.updateWithImages(postId, formData);

      if (updated.id) {
        this.goBack();
      } else {
        this.errorMessage = CONSTANTS.NO_RESULTS_TEXT;
      }
      return;
    }

    const formData = new FormData();
    formData.append("title", trimmedTitle);
    formData.append("description", trimmedDescription);
    formData.append("caption", trimmedBody);
    if (this.tags.length > 0) {
      this.tags.forEach((tag) => formData.append("tags", tag));
    }
    this.images.forEach((file) => formData.append("images", file));

    const created = await postService.upload(formData);
    if (created.id) {
      navigate(`/post/${created.id}`);
    } else {
      this.errorMessage = CONSTANTS.NO_RESULTS_TEXT;
    }
  }

  private formatSize(size: number): string {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(size / 1024).toFixed(1)} KB`;
  }

  private goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else if (this.params?.id) {
      navigate(`/post/${this.params.id}`);
    } else {
      navigate("/");
    }
  }

  private handleCancel() {
    this.goBack();
  }

  render() {
    const header = this.isEdit
      ? CONSTANTS.EDIT_POST_HEADER
      : CONSTANTS.NEW_POST_HEADER;
    const submitLabel = this.isEdit
      ? CONSTANTS.EDIT_POST_SAVE_BUTTON
      : CONSTANTS.NEW_POST_SAVE_BUTTON;
    if (this.isEdit && this.isLoading) {
      return html`
        <app-fallback
          type="loading"
          message=${CONSTANTS.LOADING_TEXT}
        ></app-fallback>
      `;
    }
    return html`
      <div class="card new-post-card">
        <div class="new-post-title">
          <span>${header}</span>
        </div>

        <form class="form" @submit=${this.handleSubmit}>
          <div class="form-field">
            <label class="form-label" for="recipe-title"
              >${CONSTANTS.NEW_POST_TITLE_LABEL}</label
            >
            <input
              id="recipe-title"
              class="input"
              type="text"
              .value=${this.title}
              @input=${this.onTitleInput}
              placeholder=${CONSTANTS.NEW_POST_TITLE_PLACEHOLDER}
              required
            />
          </div>

          <div class="form-field">
            <label class="form-label" for="recipe-images"
              >${CONSTANTS.NEW_POST_IMAGES_LABEL}</label
            >

            <div class="file-input-wrapper">
              <div class="file-input-display">
                <button
                  type="button"
                  class="btn btn-ghost file-input-trigger"
                  tabindex="-1"
                >
                  ${CONSTANTS.NEW_POST_SELECT_BUTTON}
                </button>
                <span class="file-input-text">
                  ${this.images.length === 0
                    ? CONSTANTS.NEW_POST_NO_FILES_SELECTED
                    : this.images.length === 1
                      ? CONSTANTS.NEW_POST_ONE_FILE_SELECTED
                      : `${this.images.length} ${CONSTANTS.NEW_POST_MULTIPLE_FILES_SELECTED}`}
                </span>
              </div>

              <input
                id="recipe-images"
                class="input recipe-images"
                type="file"
                multiple
                accept="image/*"
                @change=${this.onImagesChange}
              />
            </div>

            ${this.isEdit && this.existingImages.length
              ? html`
                  <div class="images-list-container">
                    <ul class="images-list">
                      ${this.existingImages.map(
                        (url, index) => html`
                          <li class="image-item">
                            <div class="file-info">
                              <span class="file-name">
                                ${CONSTANTS.EDIT_POST_CURRENT_IMAGE}
                                ${index + 1}
                              </span>
                              <span class="file-size">${url}</span>
                            </div>
                            <img
                              src=${url}
                              alt=${this.title}
                              style="width:56px;height:56px;object-fit:cover;border-radius:8px;"
                            />
                            <button
                              type="button"
                              class="btn-no-fill btn-ghost remove-btn"
                              @click=${() => this.removeExistingImage(index)}
                            >
                              ${CONSTANTS.NEW_POST_REMOVE_IMAGE}
                            </button>
                          </li>
                        `
                      )}
                    </ul>
                  </div>
                `
              : null}
            ${this.images.length
              ? html`
                  <div class="images-list-container">
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
                              aria-label=${CONSTANTS.NEW_POST_REORDER_IMAGE_ARIA}
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
                              ${CONSTANTS.NEW_POST_REMOVE_IMAGE}
                            </button>
                          </li>
                        `
                      )}
                    </ul>
                  </div>
                `
              : null}
          </div>

          <div class="form-field">
            <label class="form-label" for="recipe-description"
              >${CONSTANTS.NEW_POST_DESCRIPTION_LABEL}</label
            >
            <textarea
              id="recipe-description"
              class="input recipe-description"
              .value=${this.description}
              @input=${this.onDescriptionInput}
              placeholder=${CONSTANTS.NEW_POST_DESCRIPTION_PLACEHOLDER}
              required
            ></textarea>
          </div>

          <div class="form-field recipe-body-container">
            <label class="form-label" for="recipe-body"
              >${CONSTANTS.NEW_POST_BODY_LABEL}</label
            >
            <textarea
              id="recipe-body"
              class="input recipe-body"
              .value=${this.body}
              @input=${this.onBodyInput}
              placeholder=${CONSTANTS.NEW_POST_BODY_PLACEHOLDER}
              required
            ></textarea>
          </div>

          <label class="form-label" for="recipe-body"
            >${CONSTANTS.NEW_POST_TAGS_LABEL}</label
          >
          <div class="tag-input-row">
            <input
              class="input tag-input"
              placeholder=${CONSTANTS.NEW_POST_TAG_PLACEHOLDER}
              .value=${this.newTag}
              @input=${this.onTagInput}
              @keydown=${this.onTagKey}
            />
            <button
              type="button"
              class="btn-no-fill btn-pill btn-sm tag-add-btn"
              @click=${this.addTag}
            >
              ${CONSTANTS.NEW_POST_TAG_ADD_BUTTON}
            </button>
          </div>
          <div class="tags-container">
            ${this.tags.map(
              (t) => html`
                <span class="tag">
                  #${t}
                  <button type="button" @click=${() => this.removeTag(t)}>
                    ${CONSTANTS.NEW_POST_TAG_REMOVE}
                  </button>
                </span>
              `
            )}
          </div>

          ${this.errorMessage
            ? html`<div class="error">${this.errorMessage}</div>`
            : null}
          <div class="form-actions">
            ${this.isEdit
              ? html`
                  <button
                    class="btn-no-fill btn-sm"
                    type="button"
                    @click=${this.handleCancel}
                    style="margin-right: 1em; width: auto;"
                  >
                    ${CONSTANTS.EDIT_POST_CANCEL_BUTTON ?? "Cancelar"}
                  </button>
                `
              : null}
            <button class="btn btn-sm save-button" type="submit">
              ${submitLabel}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}
