import { TemplateResult } from 'lit';
import { Directive, directive } from 'lit/directive.js';

import modalC, { ModalRegistry } from './modal-controller';

/**
 * A directive to automate the act of managing a [[ModalRegistry]] based on a boolean condition.
 *
 * See [Lit docs on Custom Directives](https://lit.dev/docs/templates/custom-directives/).
 */
export class PortalDirective extends Directive {
  /** Registry for a modal that is currently in the modal stack. */
  modalRegistry?: ModalRegistry;

  /** Resolves the template argument if it is a supplier function. */
  getTemplate(templateOrSupplier: TemplateResult | (() => TemplateResult)): TemplateResult {
    if (templateOrSupplier instanceof Function) {
      return templateOrSupplier();
    } else {
      return templateOrSupplier;
    }
  }

  /**
   * The core logic of the [[portal | `portal`]] directive.
   *
   * If `showModal` is true, or if it is a Function that produces a truthy result,
   * then the given `template` and optional `closeCallback` will be pushed to the [[ModalPortal | `<modal-portal>`]].
   *
   * If there already exists a registry for a modal sent using this exact directive,
   * then it will be replaced using the new arguments.
   *
   * If `showModal` is falsy, then the modal is removed and the registry is reset.
   */
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
      this.modalRegistry = modalC.push(this.getTemplate(template), closeCallback);
    }
  }
}

/**
 * To be used in Lit templates.
 *
 * See [[PortalDirective.render]]
 */
export const portal = directive(PortalDirective);
