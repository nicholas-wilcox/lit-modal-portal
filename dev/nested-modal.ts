import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import ModalController from '../src/modal-controller';
import LargeModal from './large-modal';

import '../src/lib/confirm-modal.ts';
import '../src/lib/lit-dialog.ts';

@customElement('nested-modal')
export default class NestedModal extends LargeModal {
  pushSubmodal() {
    ModalController.getInstance().push(
      html`
        <confirm-modal .confirmCallback=${() => console.log('Action confirmed')}></confirm-modal>
      `
    );
  }

  render() {
    return html`
      <lit-dialog ${ref(this.litDialogRef)} label="Nested Modal Example" .enableLightDismiss=${true} size=large>
        <div class="modal-content">
          <p>This is an example of a modal that can spawn "nested" submodals.</p>
          <button @click=${() => this.pushSubmodal()} autofocus>Show Submodal</button>
          <button @click=${() => this.closeDialog()}>Close Modal</button>
        </div>
      </lit-dialog>
    `;
  }
}
