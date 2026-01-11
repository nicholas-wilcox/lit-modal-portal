import { render as litRender, nothing } from 'lit';
import { directive } from 'lit-html/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

/**
 * The acceptable types used to specify a portal target.
 */
export type TargetOrSelector = Node | string;

/**
 * @property placeholder - When provided, `placeholder` will be immediately rendered in the portal.
 * Assuming that `content` is a promise, it will replace the placeholder once it resolves.
 *
 * @property modifyContainer - When provided, the `modifyContainer` function will be called with
 * the portal's container given as the argument. This allows you to programmatically control the
 * container before the portal renders.
 */
export interface PortalOptions {
  placeholder?: unknown;
  modifyContainer?: (container: HTMLElement) => void;
}

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
   *
   * For clarity's sake, here is the outline of the function body::
   *
   * - Resolve `targetOrSelector` to an element.
   *
   * - If the directive's `container` property is `undefined`,
   *   - then create the container element and store it in the property.
   *
   * - If `modifyContainer` is provided in the `options`,
   *   - then call `modifyContainer(container)`.
   *
   * - If the target has changed from one element to another,
   *   - then migrate `container` to the new target and reassign the directive's `target` property.
   *
   * - If the directive's `target` property is `undefined`,
   *   - then store the target element in the property.
   *
   *   - If a `placeholder` is provided in the `options`,
   *     - then append `container` to `target` (if necessary) and render `placeholder` in `container`.
   *
   * - Resolve `content` (awaited).
   *
   * - Append `container` to `target` (if necessary) and render `content` in `container`.
   *
   * The steps are organized this way to balance the initalization and refreshing of crucial properties
   * like `container` and `target` while ensuring that `container` isn't added to the DOM until
   * the directive is about to render something (either `placeholder` or `content`).
   *
   * @param content - The content of the portal.
   * This parameter is passed as the `value` parameter in [Lit's `render` function](https://lit.dev/docs/api/templates/#render).
   *
   * The `content` parameter can be a promise, which will be rendered in the portal once it resolves.
   *
   * @param targetOrSelector - The "target" for the portal.
   * If the value is a string, then it is treated as a query selector and passed to `document.querySelector()` in order to locate the portal target.
   * If no element is found with the selector, then an error is thrown.
   *
   * @param options - See {@link PortalOptions}.
   *
   * @returns This function always returns Lit's [`nothing`](https://lit.dev/docs/api/templates/#nothing) value,
   * because nothing ever renders where the portal is used.
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
      const newTarget = getTarget(targetOrSelector);

      // Create container if it doesn't already exist.
      if (!this.container) {
        const newContainer = document.createElement('div');
        newContainer.id = this.containerId;
        if (options?.modifyContainer) {
          options.modifyContainer(newContainer);
        }
        this.container = newContainer;
      }

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
