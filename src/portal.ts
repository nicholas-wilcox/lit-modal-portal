import { TemplateResult } from 'lit';
import { Directive, directive } from 'lit/directive.js';

import ModalController, { ModalRegistry } from './modal-controller';

class PortalDirective extends Directive {
  modalRegistry?: ModalRegistry;

  getTemplate(templateOrSupplier: TemplateResult | (() => TemplateResult)): TemplateResult {
    if (templateOrSupplier instanceof Function) {
      return templateOrSupplier();
    } else {
      return templateOrSupplier;
    }
  }

  render(
    showModal: boolean | Function,
    template: TemplateResult | (() => TemplateResult),
    closeCallback?: Function
  ) {
    // Reduce function to boolean if necessary.
    if (showModal instanceof Function) {
      showModal = showModal();
    }

    // If a modal registry already exists for this directive,
    // then we are either replacing or removing.
    if (this.modalRegistry) {
      if (showModal) {
        this.modalRegistry.replace(this.getTemplate(template), closeCallback);
      } else {
        this.modalRegistry.remove();
        this.modalRegistry = undefined;
      }
    } else if (showModal) {
      this.modalRegistry = ModalController.getInstance().push(
        this.getTemplate(template),
        closeCallback
      );
    }
  }
}

export const portal = directive(PortalDirective);
