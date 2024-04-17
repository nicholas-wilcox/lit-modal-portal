import { render as litRender, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

export type TargetOrSelector = Node | string;

export type PortalOptions = {
  placeholder?: unknown;
};

/**
 * Utility function to get an HTMLElement by reference or by a document query selector.
 */
function getTarget(targetOrSelector: TargetOrSelector): Node {
  let target = targetOrSelector;
  // Treat the argument as a query selector if it's a string.
  if (typeof target === 'string') {
    target = document.querySelector(target) as Node;
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
  private containerId = `portal-${self.crypto.randomUUID()}`;
  private container: HTMLElement | undefined;
  private target: Node | undefined;

  /**
   * Main render function for the directive.
   * It uses references to other DOM elements to render elsewhere.
   *
   * This directive always returns `nothing` because nothing ever renders where the portal is used.
   */
  render(
    content: unknown | Promise<unknown>,
    targetOrSelector: TargetOrSelector | Promise<TargetOrSelector>,
    options?: PortalOptions,
  ) {
    // Resolve targetOrSelector first, because nothing can happen without that.
    Promise.resolve(targetOrSelector).then(async (targetOrSelector) => {
      if (!targetOrSelector) {
        throw Error(
          "Target was falsy. Are you using a Lit ref before its value is defined? If so, try using Lit's @queryAsync decorator instead (https://lit.dev/docs/api/decorators/#queryAsync).",
        );
      }

      // Create container if it doesn't already exist.
      if (!this.container) {
        const newContainer = document.createElement('div');
        newContainer.id = this.containerId;
        this.container = newContainer;
      }

      const newTarget = getTarget(targetOrSelector);

      // If we are getting a new target, then migrate the container.
      if (this.target && this.target !== newTarget) {
        this.target?.removeChild(this.container);
        newTarget.appendChild(this.container);
        this.target = newTarget;
      }

      // Set the target if it's undefined
      if (!this.target) {
        this.target = newTarget;

        // Render the placeholder if it's provided
        if (options?.placeholder) {
          // Only append the container to the target if we are about to render.
          if (!this.target.contains(this.container)) {
            this.target.appendChild(this.container);
          }
          litRender(options.placeholder, this.container);
        }
      }

      const resolvedContent = await Promise.resolve(content);

      // Add the container to the target if it isn't included already.
      if (!this.target.contains(this.container)) {
        this.target.appendChild(this.container);
      }

      litRender(resolvedContent, this.container);
    });

    return nothing;
  }

  /** Remove container from target when the directive is disconnected. */
  protected disconnected(): void {
    if (this.target?.contains(this.container)) {
      this.target?.removeChild(this.container);
    } else {
      console.warn(
        'portal directive was disconnected after the portal container was removed from the target.',
      );
    }
  }

  /** Append container to target when the directive is reconnected. */
  protected reconnected(): void {
    this.target?.appendChild(this.container);
  }
}

/**
 * To be used in Lit templates.
 *
 * See {@link PortalDirective.render | PortalDirective.render}
 */
export const portal = directive(PortalDirective);
