import { html } from 'lit';
import { expect, fixture } from '@open-wc/testing';
import { portal } from './portal';

const PORTAL_CONTENT = 'portal content';
const PORTAL_CONTAINER_ID_REGEX = /portal(-[0-9a-f])+/;

async function createPortalFixture(portalTarget: HTMLElement | string) {
  await fixture(html`${portal(html`<p>${PORTAL_CONTENT}</p>`, portalTarget)}`);
}

describe('portal', async () => {
  const getPortalsInDocumentBody = () => document.body.querySelectorAll('[id|=portal]');

  afterEach(() => {
    getPortalsInDocumentBody().forEach((portal) => portal.remove());
  });

  it('creates a portal in document.body', async () => {
    await createPortalFixture(document.body);

    expect(document.body.lastElementChild).to.be.instanceof(HTMLDivElement);
    expect(document.body.lastElementChild.id).match(PORTAL_CONTAINER_ID_REGEX);
    expect((document.body.lastElementChild as HTMLDivElement).innerText).to.equal(PORTAL_CONTENT);
  });

  it('creates a portal in a div using a query selector', async () => {
    const portalTarget = document.createElement('div');
    const portalTargetId = `portal-target`;
    portalTarget.id = portalTargetId;

    document.body.appendChild(portalTarget);
    await createPortalFixture('#portal-target');

    expect(portalTarget.lastElementChild).to.be.instanceof(HTMLDivElement);
    expect(portalTarget.lastElementChild.id).match(PORTAL_CONTAINER_ID_REGEX);
    expect((portalTarget.lastElementChild as HTMLDivElement).innerText).to.equal(PORTAL_CONTENT);
  });

  describe('test cleanup', async () => {
    it('expects no portals on document.body before adding a portal', async () => {
      expect(getPortalsInDocumentBody()).to.be.empty;
      await createPortalFixture(document.body);
      expect(getPortalsInDocumentBody()).to.not.be.empty;
    });

    it('expects (again) no portals on document.body before adding a portal', async () => {
      expect(getPortalsInDocumentBody()).to.be.empty;
      await createPortalFixture(document.body);
      expect(getPortalsInDocumentBody()).to.not.be.empty;
    });
  });
});
