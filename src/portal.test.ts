import { LitElement, html, PropertyValueMap } from 'lit';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { customElement, state, property } from 'lit/decorators.js';
import { expect, fixture, nextFrame } from '@open-wc/testing';
import { portal } from './portal';
import sinon, { spy } from 'sinon';

@customElement('example-component-manager')
export class ExampleComponentManager extends LitElement {
  @state()
  enablePortal = false;

  @property({ attribute: false })
  buttonRef: Ref<HTMLButtonElement>;

  @property({ attribute: false })
  exampleComponentRef: Ref<ExampleComponent>;

  render() {
    return html`
      <button
        ${ref(this.buttonRef)}
        @click=${() => (this.enablePortal = !this.enablePortal)}
      ></button>
      ${when(this.enablePortal, () =>
        portal(html`<example-component></example-component>`, document.body),
      )}
    `;
  }
}

@customElement('example-component')
export class ExampleComponent extends LitElement {
  // If there is a better way to test the lifecycle methods than through a side-effect spy,
  // then I would like to hear about it.
  static lifecycleSpy = spy();

  constructor() {
    super();
    ExampleComponent.lifecycleSpy('constructor');
  }

  connectedCallback(): void {
    super.connectedCallback();
    ExampleComponent.lifecycleSpy('connectedCallback');
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    ExampleComponent.lifecycleSpy('willUpdate');
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    ExampleComponent.lifecycleSpy('firstUpdated');
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    ExampleComponent.lifecycleSpy('updated');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    ExampleComponent.lifecycleSpy('disconnectedCallback');
  }

  render() {
    return html`<p>${PORTAL_CONTENT}</p>`;
  }
}

const PORTAL_CONTENT = 'portal content';
const PORTAL_CONTAINER_ID_REGEX = /portal(-[0-9a-f])+/;

async function createPortalFixture(portalTarget: HTMLElement | string) {
  await fixture(html`${portal(html`<p>${PORTAL_CONTENT}</p>`, portalTarget)}`);
}

async function createPortalFixtureWithToggledComponent() {
  const buttonRef: Ref<HTMLButtonElement> = createRef();
  const exampleComponentRef: Ref<ExampleComponent> = createRef();
  const clickButtonAsync = async () => {
    buttonRef.value.click();
    await nextFrame();
  };

  await fixture(html`
    <example-component-manager
      .buttonRef=${buttonRef}
      .exampleComponentRef=${exampleComponentRef}
    ></example-component-manager>
  `);

  return { exampleComponentRef, clickButtonAsync };
}

async function createAsynchronousPortalFixture(
  portalTarget: HTMLElement | string,
  delay = 1000,
  placeholder?: unknown,
) {
  const sleepPromise = new Promise((resolve) => setTimeout(resolve, delay));
  await fixture(
    html`${portal(
      sleepPromise.then(() => html`<p>${PORTAL_CONTENT}</p>`),
      portalTarget,
      { placeholder },
    )}`,
  );
}

describe('portal', async function () {
  const getPortalsInDocumentBody = () => document.body.querySelectorAll('[id|=portal]');

  afterEach(function () {
    getPortalsInDocumentBody().forEach((portal) => portal.remove());
    sinon.restore();
    ExampleComponent.lifecycleSpy.resetHistory();
  });

  it('creates a portal in document.body', async function () {
    await createPortalFixture(document.body);

    expect(document.body.lastElementChild).to.be.instanceof(HTMLDivElement);
    expect(document.body.lastElementChild.id).match(PORTAL_CONTAINER_ID_REGEX);
    expect((document.body.lastElementChild as HTMLDivElement).innerText).to.equal(PORTAL_CONTENT);
  });

  it('creates a portal in a div using a query selector', async function () {
    const portalTarget = document.createElement('div');
    const portalTargetId = `portal-target`;
    portalTarget.id = portalTargetId;

    document.body.appendChild(portalTarget);
    await createPortalFixture('#portal-target');

    expect(portalTarget.lastElementChild).to.be.instanceof(HTMLDivElement);
    expect(portalTarget.lastElementChild.id).match(PORTAL_CONTAINER_ID_REGEX);
    expect((portalTarget.lastElementChild as HTMLDivElement).innerText).to.equal(PORTAL_CONTENT);
  });

  describe('Lit lifecycle methods for components in portals', async function () {
    let clickButtonAsync: Function;

    beforeEach(async function () {
      ({ clickButtonAsync } = await createPortalFixtureWithToggledComponent());
      expect(ExampleComponent.lifecycleSpy).to.have.not.been.called;
    });

    it("calls a component's constructor method", async function () {
      await clickButtonAsync();
      expect(ExampleComponent.lifecycleSpy.getCall(0).calledWith('constructor'));
      await clickButtonAsync();
    });

    it("calls a component's connectedCallback method", async function () {
      await clickButtonAsync();
      expect(ExampleComponent.lifecycleSpy.getCall(1).calledWith('connectedCallback'));
      await clickButtonAsync();
    });

    it("calls a component's willUpdate method", async function () {
      await clickButtonAsync();
      expect(ExampleComponent.lifecycleSpy.getCall(2).calledWith('willUpdate'));
      await clickButtonAsync();
    });

    it("calls a component's firstUpdated method", async function () {
      await clickButtonAsync();
      expect(ExampleComponent.lifecycleSpy.getCall(3).calledWith('firstUpdated'));
      await clickButtonAsync();
    });

    it("calls a component's updated method", async function () {
      await clickButtonAsync();
      expect(ExampleComponent.lifecycleSpy.getCall(4).calledWith('updated'));
      await clickButtonAsync();
    });

    it("calls a component's disconnectedCallback method", async function () {
      await clickButtonAsync();
      await clickButtonAsync();
      expect(ExampleComponent.lifecycleSpy).callCount(6);
      expect(ExampleComponent.lifecycleSpy.getCall(5).calledWith('disconnectedCallback'));
    });
  });

  describe('Asynchronous behavior', async function () {
    it("doesn't render a portal with asynchronous content until it resolves", async function () {
      this.timeout(2000);

      await createAsynchronousPortalFixture(document.body, 1000);
      expect(getPortalsInDocumentBody()).to.be.empty;

      await new Promise((resolve) => setTimeout(resolve, 1500));
      expect(getPortalsInDocumentBody()).to.not.be.empty;
    });

    it('renders a placeholder while asynchronous content resolves', async function () {
      this.timeout(2000);

      await createAsynchronousPortalFixture(document.body, 1000, html`<p>placeholder</p>`);
      const portals = getPortalsInDocumentBody();
      expect(portals).to.not.be.empty;
      expect((portals[0] as HTMLElement).innerText).to.equal('placeholder');

      await new Promise((resolve) => setTimeout(resolve, 1500));
      expect((portals[0] as HTMLElement).innerText).to.equal(PORTAL_CONTENT);
    });
  });

  describe('test helpers', async function () {
    describe('afterEach', function () {
      it('expects no portals on document.body before adding a portal', async function () {
        expect(getPortalsInDocumentBody()).to.be.empty;
        await createPortalFixture(document.body);
        expect(getPortalsInDocumentBody()).to.not.be.empty;
      });

      it('expects (again) no portals on document.body before adding a portal', async function () {
        expect(getPortalsInDocumentBody()).to.be.empty;
        await createPortalFixture(document.body);
        expect(getPortalsInDocumentBody()).to.not.be.empty;
      });
    });

    describe('createPortalFixtureWithToggledComponent', async function () {
      it('creates and removes a portal with the returned values', async function () {
        const { clickButtonAsync } = await createPortalFixtureWithToggledComponent();

        await clickButtonAsync();
        expect(getPortalsInDocumentBody()).to.not.be.empty;

        await clickButtonAsync();
        expect(getPortalsInDocumentBody()).to.be.empty;
      });
    });
  });
});

declare global {
  interface HTMLElementTagNameMap {
    'example-component-manager': ExampleComponentManager;
    'example-component': ExampleComponent;
  }
}
