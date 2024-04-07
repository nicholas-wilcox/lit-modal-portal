import { html } from 'lit';
import { expect, fixture } from '@open-wc/testing';
import { portal } from './portal';

const PORTAL_CONTENT = 'portal content';
const PORTAL_CONTAINER_ID_REGEX = /portal(-[0-9a-f])+/;

async function createPortalFixture(portalTarget: HTMLElement | string) {
  await fixture(html`${portal(html`<p>${PORTAL_CONTENT}</p>`, portalTarget)}`);
}

describe('portal', async () => {
  it('creates a portal in document.body', async () => {
    await createPortalFixture(document.body);

    expect(document.body.lastElementChild).to.be.instanceof(HTMLDivElement);
    expect(document.body.lastElementChild.id).match(PORTAL_CONTAINER_ID_REGEX);
    expect((document.body.lastElementChild as HTMLDivElement).innerText).to.equal(PORTAL_CONTENT);

    // Manual cleanup
    document.body.removeChild(document.body.lastChild);
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

    // Manual cleanup
    portalTarget.removeChild(portalTarget.lastChild);
  });
});
