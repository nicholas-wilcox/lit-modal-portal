import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import ModalOverlay from './modal-overlay';

import './modal-backdrop.ts';

@customElement('confirm-modal')
export default class ConfirmModal extends ModalOverlay {
  static styles = [
    ModalOverlay.styles,
    css`
      .modal-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .confirmation-dialog {
        background: white;
        flex-basis: 480px;
        padding: 1rem;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .button-row {
        display: flex;
        gap: 1rem;
      }

      .spacer {
        flex-grow: 1;
      }
    `
  ];

  @property({ attribute: 'cancel-label' })
  cancelLabel: string = 'Cancel';

  @property({ attribute: 'confirm-label' })
  confirmLabel: string = 'Confirm';

  @property({ attribute: false })
  confirmCallback: Function | undefined;

  @property({ attribute: 'secondary-label' })
  secondaryLabel: string = 'Alternative';

  @property({ attribute: false })
  secondaryAction: Function | undefined;

  @property({ type: Boolean })
  closeOnConfirmation: boolean = true;

  handleConfirm() {
    if (this.confirmCallback) {
      this.confirmCallback();
      if (this.closeOnConfirmation) {
        this.closeModal();
      }
    }
  }

  handleSecondaryAction() {
    if (this.secondaryAction) {
      this.secondaryAction();
      this.closeModal();
    }
  }

  render() {
    return html`
      <modal-backdrop label=${this.confirmLabel}>
        <div class="modal-container">
          <div class="confirmation-dialog">
            <div>
              <slot>This is the message that asks the user to confirm the action.</slot>
            </div>
            <div class="button-row">
                <button @click=${this.closeModal}>${this.cancelLabel}</button>
                <span class="spacer"></span>
                ${when(
                  this.secondaryAction,
                  () => html`
                    <button @click=${() => this.handleSecondaryAction()}>${this.secondaryLabel}</button>
                  `
                )}
                <button @click=${() => this.handleConfirm()}>${this.confirmLabel}</button>
            </div>
          </div>
        </div>
      </modal-backdrop>
    `;
  }
}
