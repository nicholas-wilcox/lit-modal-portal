import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { WithLitDialog } from '../src/lib/with-lit-dialog';

import '../src/lib/lit-dialog.ts';

@customElement('large-modal')
export default class LargeModal extends WithLitDialog(LitElement) {
  static styles = [
    css`
      .modal-content {
        background: white;
        min-height: 100%;
        height: 1000px;
        border-radius: 0.5rem;
        padding: 1rem;
      }
    `
  ];

  render() {
    return html`
      <lit-dialog ${ref(this.litDialogRef)} label="Large Modal Example">
        <div class="modal-content">
          <p>This is an example of a large modal that necessitates vertical scrolling.</p>
          <button @click=${() => this.closeDialog()} autofocus>Close Modal</button>
        </div>
      </lit-dialog>
    `;
  }
}
