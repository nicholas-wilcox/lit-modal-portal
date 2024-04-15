import { LitElement, html, css } from 'lit';
import { customElement, state, queryAsync } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { portal } from '../src/portal';

import './example-component';

@customElement('demo-reactive')
export class DemoReactive extends LitElement {
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

      .current-time,
      .portal-target {
        border: 1px solid black;
        padding: 0.25rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 0.25rem;
        line-height: 1;
      }

      .multi-portal-target-wrapper {
        flex-grow: 1;
      }
      .multi-portal-target-subwrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .multi-portal-target-subwrapper .portal-target {
        flex-basis: 0;
        flex-grow: 1;
      }

      #component-portal-target {
        flex-basis: 100%;
      }
    `,
  ];

  @state()
  timeString = new Date().toLocaleTimeString();

  @state()
  multiPortalTargetIndex = 0;

  intervalId = undefined;

  @queryAsync('#single-portal-target')
  singlePortalTarget: Promise<HTMLElement>;

  @queryAsync('.portal-target[data-current-portal-target=true]')
  multiPortalTarget: Promise<HTMLElement>;

  @state()
  showComponentPortal = false;

  @queryAsync('#component-portal-target')
  componentPortalTarget: Promise<HTMLElement>;

  connectedCallback() {
    super.connectedCallback();
    this.intervalId = setInterval(() => {
      this.timeString = new Date().toLocaleTimeString();
      this.multiPortalTargetIndex = (this.multiPortalTargetIndex + 1) % 3;
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.intervalId);
  }

  render() {
    return html`
      <h2>Reactive Updates</h2>
      <p>
        When the component that consumes the <code>portal</code> directive re-renders and changes
        the content of the portal, the directive will re-render the new content in the same
        container. In other words, portals are reactive.
      </p>
      <p>
        This section of the demo is a component that manages an
        <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/setInterval"
          >interval</a
        >
        to update its internal reactive state once per second. The current time is rendered both
        directly in the component's template and also in the content of a portal.
      </p>
      <div class="wrapper">
        <div class="current-time">
          <h3>Current time</h3>
          <p>${this.timeString}</p>
          ${portal(html`<p>${this.timeString}</p>`, this.singlePortalTarget)}
        </div>
        <div id="single-portal-target" class="portal-target">
          <h3>Portal target</h3>
        </div>
      </div>

      <!-- Dynamically changing the portal target -->
      <p>
        In addition to updating the content of a portal,
        <em>you can also update a portal's target</em>. This will remove the portal's content from
        the old target and append it to the new target. (Credit to
        <a target="_blank" href="https://github.com/ronak-lm/lit-portal"
          >ronak-lm's <code>lit-portal</code> package</a
        >
        for designing and implementing this behavior before I did.)
      </p>
      <div class="wrapper">
        <div class="current-time">
          <h3>Current time</h3>
          <p>${this.timeString}</p>
          ${portal(html`<p>${this.timeString}</p>`, this.multiPortalTarget)}
        </div>
        <div class="multi-portal-target-wrapper">
          <h3>Portal targets</h3>
          <div class="multi-portal-target-subwrapper">
            <div
              id="multi-portal-target-0"
              class="portal-target"
              data-current-portal-target=${this.multiPortalTargetIndex === 0}
            ></div>
            <div
              id="multi-portal-target-1"
              class="portal-target"
              data-current-portal-target=${this.multiPortalTargetIndex === 1}
            ></div>
            <div
              id="multi-portal-target-2"
              class="portal-target"
              data-current-portal-target=${this.multiPortalTargetIndex === 2}
            ></div>
          </div>
        </div>
      </div>

      <!-- Send another Lit component through a portal -->
      <p>
        Finally, as you would expect, a Lit component can be rendered through a portal and still
        work.
      </p>
      <div class="wrapper">
        ${when(this.showComponentPortal, () =>
          portal(html`<example-component></example-component>`, this.componentPortalTarget),
        )}
        <p>
          Right above this paragraph's <code>&lt;p&gt;</code> tag is a <code>portal</code> directive
          that renders an example component in the following portal target <code>&lt;div&gt;</code>.
        </p>
        <p>
          The portal can be toggled using the button below this text. You can observe that the
          components lifecycle methods are called appropriately by looking at the console logs.
        </p>
        <button @click=${() => (this.showComponentPortal = !this.showComponentPortal)}>
          Toggle Portal
        </button>
        <div id="component-portal-target" class="portal-target">
          <h3>Portal target</h3>
        </div>
      </div>
    `;
  }
}
