import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  EventsController,
  ObserveAttributesMixin,
  ObserveAttributesMixinInterface,
  event
} from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './upload.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-upload': Upload;
  }
}

export type UploadSize = 'md' | 'lg';

let nextUniqueId = 0;

/**
 * Upload component that allows users to select and upload files.
 *
 * @csspart dropzone - The dropzone area
 * @csspart file-list - The list of selected files
 * @slot default - The content shown in the dropzone
 */
@localized()
export class Upload
  extends ObserveAttributesMixin(FormControlMixin(ScopedElementsMixin(LitElement)), [
    'aria-disabled',
    'aria-label',
    'aria-labelledby'
  ])
  implements ObserveAttributesMixinInterface
{
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Track if we are dragging over the dropzone. */
  #dragCounter = 0;

  /** The files that have been selected. */
  #files: File[] = [];

  #onDragEnter = (event: DragEvent): void => {
    if (!this.dragDrop || this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.#dragCounter++;
    if (this.#dragCounter === 1) {
      this.dragOver = true;
    }
  };

  #onDragOver = (event: DragEvent): void => {
    if (!this.dragDrop || this.disabled) return;

    event.preventDefault();
    event.stopPropagation();
  };

  #onDragLeave = (event: DragEvent): void => {
    if (!this.dragDrop || this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.#dragCounter--;
    if (this.#dragCounter === 0) {
      this.dragOver = false;
    }
  };

  #onDrop = (event: DragEvent): void => {
    if (!this.dragDrop || this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.#dragCounter = 0;
    this.dragOver = false;

    const files = Array.from(event.dataTransfer?.files || []);
    this.#setFiles(files);
  };

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    dragenter: this.#onDragEnter,
    dragover: this.#onDragOver,
    dragleave: this.#onDragLeave,
    drop: this.#onDrop
  });

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when files are selected or changed. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<File[]>>;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal Emits when files are rejected due to validation. */
  @event({ name: 'sl-invalid-files' })
  invalidFilesEvent!: EventEmitter<CustomEvent<{ files: File[]; reasons: string[] }>>;

  /** Accepted file types (e.g., "image/*,.pdf"). */
  @property() accept?: string;

  /** Whether the upload is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** Whether drag-and-drop is enabled. */
  @property({ type: Boolean, attribute: 'drag-drop' }) dragDrop = true;

  /** Whether the dropzone is being hovered with dragged files. */
  @property({ type: Boolean, reflect: true, attribute: 'drag-over' }) dragOver = false;

  /** The input element in the light DOM. */
  input!: HTMLInputElement;

  /** Maximum file size in bytes. */
  @property({ type: Number, attribute: 'max-size' }) maxSize?: number;

  /** Whether multiple files can be selected. */
  @property({ type: Boolean }) multiple = false;

  /** Whether the upload is required. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the upload component.
   * @default 'md'
   */
  @property({ reflect: true }) size?: UploadSize;

  /** The list of files. */
  get files(): File[] {
    return this.#files;
  }

  /** The files as the form value. */
  override get formValue(): File[] {
    return this.#files;
  }

  override set formValue(value: File[]) {
    this.#files = Array.isArray(value) ? value : [];
    this.updateValidity();
  }

  /** The files as the component value. */
  override get value(): File[] {
    return this.#files;
  }

  override set value(files: File[]) {
    this.#files = Array.isArray(files) ? files : [];
    this.updateValidity();
    this.requestUpdate();
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[type="file"]') || document.createElement('input');
      this.input.id ||= `sl-upload-${nextUniqueId++}`;
      this.input.type = 'file';
      this.input.hidden = true;

      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }

    this.setFormControlElement(this.input);
    this.setAttributesTarget(this.input);

    this.input.addEventListener('change', this.#onInputChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.input?.removeEventListener('change', this.#onInputChange);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('accept') && this.accept) {
      this.input.accept = this.accept;
    }

    if (changes.has('disabled')) {
      this.input.disabled = !!this.disabled;
    }

    if (changes.has('multiple')) {
      this.input.multiple = this.multiple;
    }

    if (changes.has('required')) {
      this.input.required = !!this.required;
    }
  }

  override render(): TemplateResult {
    const hasFiles = this.#files.length > 0;

    return html`
      <div
        part="dropzone"
        class=${classMap({
          dropzone: true,
          'drag-over': this.dragOver,
          disabled: !!this.disabled
        })}
        @click=${this.#onDropzoneClick}
      >
        <slot>
          <div class="default-content">
            <sl-icon name="cloud-arrow-up" class="upload-icon"></sl-icon>
            <p class="upload-text">
              ${this.dragDrop ? msg('Drag and drop files here or click to browse') : msg('Click to select files')}
            </p>
          </div>
        </slot>
      </div>

      ${hasFiles
        ? html`
            <div part="file-list" class="file-list">
              ${this.#files.map(
                (file, index) => html`
                  <div class="file-item">
                    <sl-icon name="file" class="file-icon"></sl-icon>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.#formatFileSize(file.size)}</span>
                    ${!this.disabled
                      ? html`
                          <button
                            type="button"
                            class="remove-button"
                            @click=${() => this.#removeFile(index)}
                            aria-label=${msg('Remove file')}
                          >
                            <sl-icon name="xmark"></sl-icon>
                          </button>
                        `
                      : nothing}
                  </div>
                `
              )}
            </div>
          `
        : nothing}
    `;
  }

  #onDropzoneClick = (): void => {
    if (!this.disabled) {
      this.input.click();
    }
  };

  #onInputChange = (): void => {
    const files = Array.from(this.input.files || []);
    this.#setFiles(files);
  };

  #setFiles(files: File[]): void {
    const rejectedFiles: File[] = [];
    const rejectionReasons: string[] = [];

    // Filter files based on accept attribute
    let filteredFiles = files;
    if (this.accept) {
      const acceptedFiles: File[] = [];
      files.forEach(file => {
        if (this.#isFileAccepted(file)) {
          acceptedFiles.push(file);
        } else {
          rejectedFiles.push(file);
          rejectionReasons.push(`${file.name}: File type not accepted`);
        }
      });
      filteredFiles = acceptedFiles;
    }

    // Filter files based on max size
    if (this.maxSize !== undefined) {
      const sizedFiles: File[] = [];
      filteredFiles.forEach(file => {
        if (file.size <= this.maxSize!) {
          sizedFiles.push(file);
        } else {
          rejectedFiles.push(file);
          rejectionReasons.push(`${file.name}: File size exceeds maximum (${this.#formatFileSize(this.maxSize!)})`);
        }
      });
      filteredFiles = sizedFiles;
    }

    // Handle multiple files
    if (!this.multiple && filteredFiles.length > 0) {
      // Only keep the first file, reject the rest
      const extraFiles = filteredFiles.slice(1);
      extraFiles.forEach(file => {
        rejectedFiles.push(file);
        rejectionReasons.push(`${file.name}: Multiple files not allowed`);
      });
      filteredFiles = [filteredFiles[0]];
    }

    // Emit event for rejected files to inform users
    if (rejectedFiles.length > 0) {
      this.invalidFilesEvent.emit({ files: rejectedFiles, reasons: rejectionReasons });
    }

    this.#files = filteredFiles;
    this.updateValidity();
    this.requestUpdate();

    // Emit change event
    this.changeEvent.emit(this.#files);
  }

  #isFileAccepted(file: File): boolean {
    if (!this.accept) return true;

    const acceptedTypes = this.accept.split(',').map(type => type.trim());

    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        // File extension
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      } else if (type.endsWith('/*')) {
        // MIME type wildcard (e.g., "image/*")
        const mimePrefix = type.slice(0, -2);
        return file.type.startsWith(mimePrefix);
      } else {
        // Exact MIME type
        return file.type === type;
      }
    });
  }

  #removeFile(index: number): void {
    this.#files = this.#files.filter((_, i) => i !== index);
    this.updateValidity();
    this.requestUpdate();

    // Update the native input's files (this is limited by browser APIs)
    try {
      const dataTransfer = new DataTransfer();
      this.#files.forEach(file => dataTransfer.items.add(file));
      this.input.files = dataTransfer.files;
    } catch (error) {
      // DataTransfer API may fail in some browsers; the component's files array is the source of truth
      console.warn('Failed to update native input files:', error);
    }

    // Emit change event
    this.changeEvent.emit(this.#files);
  }

  #formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    i = Math.min(i, sizes.length - 1);

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  override updateInternalValidity(): void {
    if (this.required && this.#files.length === 0) {
      this.input.setCustomValidity(msg('Please select at least one file'));
    } else {
      this.input.setCustomValidity('');
    }
  }
}
