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
        height: 1000px;
        width: 100%;
        border-radius: 1rem;
        border: 2px solid black;
        padding: 1rem;
        position: relative;
      }
    `
  ];

  render() {
    return html`
      <lit-dialog ${ref(this.litDialogRef)} label="Large Modal Example" .enableLightDismiss=${true} size=large>
        <div class="modal-content">
          <p>This is an example of a large modal that necessitates vertical scrolling.</p>
          <button @click=${() => this.closeDialog()} autofocus>Close Modal</button>
        </div>
      </lit-dialog>
    `;
  }
}
