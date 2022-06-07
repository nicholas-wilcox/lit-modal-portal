import { LitElement } from 'lit'; 

export abstract class LitModal extends LitElement {
  closeModal() {
    this.dispatchEvent(new Event('closeModal', { bubbles: true, composed: true }));
  }
}
