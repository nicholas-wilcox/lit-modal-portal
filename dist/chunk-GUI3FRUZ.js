// src/lib/with-lit-dialog.ts
import { createRef } from "lit/directives/ref.js";
var WithLitDialog = (superclass) => {
  class LitElementWithLitDialog extends superclass {
    constructor() {
      super(...arguments);
      this.litDialogRef = createRef();
    }
    closeDialog() {
      var _a;
      (_a = this.litDialogRef.value) == null ? void 0 : _a.close();
    }
  }
  return LitElementWithLitDialog;
};

export {
  WithLitDialog
};
