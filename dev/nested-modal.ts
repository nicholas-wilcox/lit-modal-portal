import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { portal } from '../src/portal';
import LargeModal from './large-modal';

import '../src/lib/confirm-modal.ts';
import '../src/lib/modal-overlay.ts';

@customElement('nested-modal')
export default class NestedModal extends LargeModal {
  @state()
  showConfirmModal: boolean = false;

  render() {
    return html`
      <modal-overlay label="Nested Modal Example" .containerStyles=${{ padding: '4rem' }}>
        <div class="modal-content">
          <p>This is an example of a modal that can spawn "nested" submodals.</p>
          <button @click=${() => this.showConfirmModal = true}>Show Submodal</button>
          <button @click=${() => this.closeModal()}>Close Modal</button>
        </div>
      </modal-overlay>
      ${portal(
        this.showConfirmModal,
        html`<confirm-modal .confirmCallback=${() => console.log('Action confirmed')}></confirm-modal>`,
        () => this.showConfirmModal = false
      )}
    `;
  }
}
