import { LitElement, CSSResultGroup, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, ref, createRef } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';

export type ModalSize = 'small' | 'large';

/**
 * A wrapper around the `<dialog>` element that hooks into the [[ModalPortal]] API.
 * The dialog's `showModal()` function is called after this component is first
 * rendered in the DOM.
 * The `"removeModal"` event is triggered whenever the dialog closes.
 *
 * This custom element resets some of the default styles of `<dialog>` and effectively
 * makes its `<dialog>` a fixed flexbox container with all 0 insets.
 * In other words, it acts as a container for whatever is the content of the modal.
 * Whatever is put into this component's `<slot>` is responsible for having a border,
 * a fully opaque background, etc.
 */
@customElement('lit-dialog')
export default class LitDialog extends LitElement {
  static styles = css`
    dialog {
      display: flex;
      justify-content: center;
    }

    dialog.unset {
      border: unset;
      background: unset;
      max-width: unset;
      max-height: unset;
      height: unset;
      width: unset;
      margin: unset;
    }

    dialog::backdrop {
      background: var(--lit-dialog-backdrop-bg, hsl(0 0% 0% / 0.3));
    }

    dialog[size='small'] {
      align-items: center;
    }

    dialog[size='large'] {
      padding: 4rem;
    }
  ` as CSSResultGroup;

  /** Reference for the `<dialog>` element. */
  protected dialogRef: Ref<HTMLDialogElement> = createRef();

  /** Accessor for the value stored in [[dialogRef]]. */
  protected get dialog(): HTMLDialogElement | undefined {
    return this.dialogRef.value;
  }

  /** Used for the `<dialog>`'s `aria-label` attribute. */
  @property()
  label: string = '';

  /**
   * Boolean flag to determine if this modal should close when the user clicks
   * outside of the modal content and in the backdrop area.
   */
  @property({ type: Boolean, attribute: false })
  enableLightDismiss: boolean = false;

  /**
   * A size parameter that affects the styles of the `<dialog>` element. */
  @property()
  size: ModalSize = 'small';

  @property({ type: Boolean, attribute: false })
  unsetStyles: boolean = true;

  get classes() {
    return { unset: this.unsetStyles };
  }

  /** Convenience wrapper for the `<dialog>`'s `close()` function. */
  close() {
    this.dialog?.close();
  }

  /**
   * Handler for the `<dialog>`'s `"close"` event.
   * Triggers the `"removeModal"` event.
   * @event removeModal
   */
  onDialogClose() {
    this.dispatchEvent(new Event('removeModal', { bubbles: true, composed: true }));
  }

  firstUpdated() {
    this.dialog.showModal();
    this.dialog.addEventListener('close', () => this.onDialogClose());

    if (this.enableLightDismiss) {
      this.dialog.addEventListener('click', (e) => this.onClick(e));
    }
  }

  onClick(event: MouseEvent) {
    if (event.target === this.dialog) {
      this.close();
    }
  }

  render() {
    return html`
      <dialog
        ${ref(this.dialogRef)}
        class=${classMap(this.classes)}
        size=${this.size}
        aria-label="${this.label}"
        aria-modal="true"
      >
        <slot></slot>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-dialog': LitDialog;
  }
}
