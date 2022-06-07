import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import ModalOverlay from '../src/lib/modal-overlay';

@customElement('large-modal')
export default class LargeModal extends ModalOverlay {
  static styles = [
    ModalOverlay.styles,
    css`
      .modal-container {
        padding: 4rem;
      }

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
      <modal-backdrop label="Large Modal Example">
        <div class="modal-container">
          <div class="modal-content">
            <p>This is an example of a large modal that necessitates vertical scrolling.</p>
            <button @click=${() => this.closeModal()}>Close Modal</button>
          </div>
        </div>
      </modal-backdrop>
    `;
  }
}
