import { LitElement, html, css } from 'lit';
import { customElement, queryAsync } from 'lit/decorators.js';
import { portal } from '../src/portal';

@customElement('demo-modify-container')
export class DemoModifyContainer extends LitElement {
  static styles = [
    css`
      .portal-target {
        border: 1px solid black;
        padding: 0.25rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 0.25rem;
        line-height: 1;
      }
    `,
  ];

  @queryAsync('#portal-target')
  portalTarget: Promise<HTMLElement>;

  render() {
    return html`<h2>Modifying Portal Containers</h2>
      <p>
        Portals wrap their content in a container <code>&lt;div&gt;</code>. If you need to make
        adjustments to a portal's container, you may provide a <code>modifyContainer</code> function
        to the <code>portal</code> directive's options.
      </p>
      <p>
        In the example below, the portal's container is styled directly using a
        <code>modifyContainer</code> function.
      </p>
      <div id="portal-target" class="portal-target">
        <h3>Portal target</h3>
      </div>
      ${portal(
        html`<p>This is the portal content. Its container has a red border and some padding.</p>`,
        this.portalTarget,
        {
          modifyContainer: (c) => {
            c.style.border = '2px solid red';
            c.style.padding = '0.5rem';
          },
        },
      )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-modify-container': DemoModifyContainer;
  }
}
