import { LitElement, html, css } from 'lit';
import { customElement, queryAsync } from 'lit/decorators.js';
import { portal } from '../src/portal';

@customElement('demo-async')
export class DemoAsync extends LitElement {
  static styles = [
    css`
      .wrapper {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid black;
        align-items: stretch;
        gap: 0.5rem;
        padding: 0.25rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 0.25rem;
        line-height: 1;
      }

      .portal-target {
        flex-basis: 0;
        flex-grow: 1;
      }
    `,
  ];

  @queryAsync('#portal-target')
  portalTarget: Promise<HTMLElement>;

  getAsynchronousContent() {
    const sleepPromise = new Promise((resolve) => setTimeout(resolve, 3000));
    return sleepPromise.then(() => html`<p>This portal renders three seconds later.</p>`);
  }

  render() {
    return html`
      <h2>Asynchronous Content</h2>
      <p>
        You can provide a
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"
          ><code>Promise</code></a
        >
        to the <code>portal</code> directive, both for the content of the portal as well as the
        target.
      </p>
      <p>
        Using a promise for the target can be useful when the target is part of a Lit component that
        may have not yet rendered or can change. The examples earlier in this demo used Lit's
        <a target="_blank" href="https://lit.dev/docs/api/decorators/#queryAsync"
          ><code>queryAsync</code></a
        >
        decorator for exactly these reasons.
      </p>
      <p>
        Using a promise for the portal content is useful when the content relies on asynchronous
        data, such as that received from an HTTPRequest.
      </p>
      <div class="wrapper">
        <p>
          This example renders one portal immediately when the page loads and another portal after a
          few seconds. You may refresh this webpage in order to repeat the example.
        </p>
        ${portal(html`<p>This portal renders immediately.</p>`, this.portalTarget)}
        ${portal(this.getAsynchronousContent(), this.portalTarget)}
        <div id="portal-target" class="portal-target">
          <h3>Portal target</h3>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-async': DemoAsync;
  }
}
