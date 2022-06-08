import { LitElement } from 'lit';
import { createRef, Ref } from 'lit/directives/ref.js';
import LitDialog from './lit-dialog';

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class WithLitDialogInterface {
  litDialogRef: Ref<LitDialog>;
  closeDialog(): void;
}

export const WithLitDialog = <T extends Constructor<LitElement>>(superclass: T) => {
  class LitElementWithLitDialog extends superclass {
    litDialogRef: Ref<LitDialog> = createRef();

    closeDialog() {
      this.litDialogRef.value?.close();
    }
  }

  return LitElementWithLitDialog as Constructor<WithLitDialogInterface> & T;
};
