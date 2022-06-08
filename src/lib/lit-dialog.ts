import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, ref, createRef } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';

type ModalSize = 'small' | 'large';

@customElement('lit-dialog')
export default class LitDialog extends LitElement {
  static styles = [
    css`
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

      dialog[size=small] {
        align-items: center;
      }

      dialog[size=large] {
        padding: 4rem;
      }
    `
  ];

  private dialogRef: Ref<HTMLDialogElement> = createRef();
  private get dialog(): HTMLDialogElement | undefined { return this.dialogRef.value; }

  @property()
  label: string = '';

  @property({ type: Boolean, attribute: false })
  enableLightDismiss: boolean = false;

  @property()
  size: ModalSize = 'small';

  @property({ type: Boolean, attribute: false })
  unsetStyles: boolean = true;

  get classes() {
    return { 'unset': this.unsetStyles };
  }

  close() {
    this.dialog?.close();
  }

  onDialogClose() {
    this.dispatchEvent(new Event('removeModal', { bubbles: true, composed: true }));
  }

  firstUpdated() {
    this.dialog.showModal();
    this.dialog.addEventListener('close', () => this.onDialogClose());

    if (this.enableLightDismiss) {
      this.dialog.addEventListener('click', e => this.onClick(e));
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
        aria-labelledby="${this.label}"
        aria-modal="true">
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
