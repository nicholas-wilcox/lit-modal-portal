import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { LitModal } from '../src/lib/lit-modal';

import '../src/lib/modal-overlay.ts';

@customElement('large-modal')
export default class LargeModal extends LitModal {
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
      <modal-overlay label="Large Modal Example" .containerStyles=${{ padding: '4rem' }}>
        <div class="modal-content">
          <p>This is an example of a large modal that necessitates vertical scrolling.</p>
          <button @click=${() => this.closeModal()}>Close Modal</button>
        </div>
      </modal-overlay>
    `;
  }
}
