import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ref } from 'lit/directives/ref.js';
import { WithLitDialog } from './with-lit-dialog';

import './lit-dialog.ts';

@customElement('confirm-modal')
export default class ConfirmModal extends WithLitDialog(LitElement) {
  static styles = [
    css`
      .confirmation-dialog {
        background: white;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 2px solid black;
        max-width: 480px;
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

  @property({ type: Boolean, attribute: false })
  closeOnConfirmation: boolean = true;

  @property({ type: Boolean, attribute: false })
  enableLightDismiss: boolean = true;

  handleConfirm() {
    if (this.confirmCallback) {
      this.confirmCallback();
      if (this.closeOnConfirmation) {
        this.closeDialog();
      }
    }
  }

  handleSecondaryAction() {
    if (this.secondaryAction) {
      this.secondaryAction();
      this.closeDialog();
    }
  }

  render() {
    return html`
      <lit-dialog
        ${ref(this.litDialogRef)}
        label=${this.confirmLabel}
        .enableLightDismiss=${this.enableLightDismiss}>
        <div class="confirmation-dialog">
          <div>
            <slot>
              <p>
                This is the message that asks the user to confirm the action.
                This component also has properties for a secondary action.
              </p>
            </slot>
          </div>
          <div class="button-row">
            <button @click=${() => this.closeDialog()} autofocus>${this.cancelLabel}</button>
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
      </lit-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'confirm-modal': ConfirmModal;
  }
}
