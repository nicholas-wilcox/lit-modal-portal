import { LitElement, html } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';
import { Ref, ref, createRef } from 'lit/directives/ref.js';

@customElement('lit-dialog')
export default class LitDialog extends LitElement {
  private dialogRef: Ref<HTMLDialogElement> = createRef();
  private get dialog(): HTMLDialogElement | undefined { return this.dialogRef.value; }

  @property()
  label: string = '';

  close() {
    this.dialog?.close();
  }

  onDialogClose() {
    this.dispatchEvent(new Event('removeModal', { bubbles: true, composed: true }));
  }

  firstUpdated() {
    this.dialog.showModal();
    this.dialog.addEventListener('click', e => this.onClick(e));
    this.dialog.addEventListener('close', () => this.onDialogClose());
  }

  onClick(event: MouseEvent) {
    if (event.target === this.dialog) {
      this.close();
    }
  }

  render() {
    return html`
      <dialog ${ref(this.dialogRef)} aria-labelledby="${this.label}" aria-modal="true">
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
