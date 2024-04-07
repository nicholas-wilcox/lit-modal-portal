import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, ref, createRef } from 'lit/directives/ref.js';

@customElement('confirmation-dialog')
export default class ConfirmationDialog extends LitElement {
  @property({ attribute: false })
  dialogRef: Ref<HTMLDialogElement> = createRef();

  render() {
    return html`
      <dialog
        ${ref(this.dialogRef)}
        @close=${(e: CloseEvent) => {
          this.dispatchEvent(new CloseEvent('close', { ...e }));
        }}
      >
        <p>This is the confirmation dialog</p>
        <button @click=${() => this.dialogRef.value?.close('cancelled')}>Cancel</button>
        <button @click=${() => this.dialogRef.value?.close('confirmed')}>Confirm Action</button>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'confirmation-dialog': ConfirmationDialog;
  }
}
