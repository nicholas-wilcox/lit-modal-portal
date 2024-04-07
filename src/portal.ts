import { render as litRender, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

type TargetOrSelector = HTMLElement | string;

/**
 * Utility function to get an HTMLElement by reference or by a document query selector.
 */
function getTarget(targetOrSelector: TargetOrSelector): HTMLElement {
  let target = targetOrSelector;
  // Treat the argument as a query selector if it's a string.
  if (typeof target === 'string') {
    target = document.querySelector(target) as HTMLElement;
    if (target === null) {
      throw Error(`Could not locate portal target with selector "${targetOrSelector}".`);
    }
  }

  return target;
}

/**
 * A directive to render a Lit template somewhere in the DOM.
 *
 * See [Lit docs on Custom Directives](https://lit.dev/docs/templates/custom-directives/).
 */
export class PortalDirective extends AsyncDirective {
  protected containerId = `portal-${self.crypto.randomUUID()}`;
  protected _container: HTMLElement | undefined;
  protected target: HTMLElement | undefined;

  /**
   * Dynamic getter to safeguard a reference to the portal container that might not be initialized yet.
   * This allows the main render function to not worry about the difference between the first render and subsequent renders.
   */
  get container() {
    if (this._container) {
      return this._container;
    }

    // Create new container, assign the id, and update the private reference.
    const newContainer = document.createElement('div');
    newContainer.id = this.containerId;
    this._container = newContainer;

    return this._container;
  }

  /**
   * Main render function for the directive.
   * It uses references to other DOM elements to render elsewhere.
   *
   * This directive always returns `nothing` because nothing ever renders where the portal is used.
   */
  render(value: unknown, targetOrSelector: TargetOrSelector | Promise<TargetOrSelector>) {
    Promise.resolve(targetOrSelector).then((targetOrSelector: TargetOrSelector) => {
      if (!targetOrSelector) {
        throw Error(
          "Target was falsy. Are you using a Lit ref before its value is defined? If so, try using Lit's @queryAsync decorator instead (https://lit.dev/docs/api/decorators/#queryAsync).",
        );
      }

      const target = getTarget(targetOrSelector);

      // Move container to new target when it changes.
      if (target !== this.target) {
        this.target?.removeChild(this.container);
        target.appendChild(this.container);
        this.target = target;
      }

      litRender(value, this.container);
    });

    return nothing;
  }

  protected disconnected(): void {
    // Remove container from target when the directive is disconnected.
    this.target?.removeChild(this._container);
  }

  protected reconnected(): void {
    // Append container to target when the directive is reconnected.
    this.target?.appendChild(this._container);
  }
}

/**
 * To be used in Lit templates.
 *
 * See [[PortalDirective.render]]
 */
export const portal = directive(PortalDirective);
