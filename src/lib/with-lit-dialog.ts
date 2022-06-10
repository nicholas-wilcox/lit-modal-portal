import { LitElement } from 'lit';
import { createRef, Ref } from 'lit/directives/ref.js';
import LitDialog from './lit-dialog';

/** @ignore */
type Constructor<T = {}> = new (...args: any[]) => T;

/** An interface for classes that use the [[WithLitDialog]] mixin. */
export declare class WithLitDialogInterface {
  /** A reference to a [[LitDialog | `<lit-dialog>`]] element. */
  litDialogRef: Ref<LitDialog>;

  /** A convenience wrapper around [[LitDialog.close]]. */
  closeDialog(): void;
}

/**
 * A mixin for any custom element that uses a [[LitDialog | `<lit-dialog>`]] in its composition.
 * It adds a reference to the `<lit-dialog>` (that you still need to manually apply
 * using the [ref](https://lit.dev/docs/templates/directives/#ref) directive)
 * and a wrapper around [[LitDialog.close]].
 *
 * See [Lit documentation for mixins](https://lit.dev/docs/composition/mixins/).
 */
export const WithLitDialog = <T extends Constructor<LitElement>>(superclass: T) => {
  class LitElementWithLitDialog extends superclass {
    litDialogRef: Ref<LitDialog> = createRef();

    closeDialog() {
      this.litDialogRef.value?.close();
    }
  }

  return LitElementWithLitDialog as Constructor<WithLitDialogInterface> & T;
};
