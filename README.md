# lit-modal-portal

The `lit-modal-portal` package provides a [custom Lit directive](https://lit.dev/docs/templates/custom-directives/), `portal`, that renders a Lit template elsewhere in the DOM.
Its main goals are:

1. to provide an API that is similar to React's [`createPortal`](https://react.dev/reference/react-dom/createPortal) function, and
2. to rely on the existing Lit API wherever possible.

## :warning: Notice on version 0.6 (currently unreleased)

This package was heavily altered between versions 0.4 and 0.6.
Changes include:

- Add support for Lit v3 and fixed dependency declaration for v0.5. (Thanks, [klasjersevi](https://github.com/klasjersevi).)
- Removed the following code:
  - Dependency of the [immutable](https://www.npmjs.com/package/immutable) package.
  - The `<modal-portal>` component and the singleton `modalController`.
  - All pre-made components, such as the `<confirm-modal>`.
- Refactor the `portal` directive to use Lit's `render` function.
  - This was primarily inspired by [ronak-lm](https://github.com/ronak-lm)'s [lit-portal](https://www.npmjs.com/package/lit-portal) package, which more closely resembles React's portal API than previous versions of this package.
  - This simplifies usage of the package and expands the potential use cases.

## Installation and Usage

You can install `lit-modal-portal` via NPM.

```
npm install lit-modal-portal
```

Suppose we have the following Lit application:

```html
<!-- index.html -->
<!doctype html>
<html>
  <head>
    <title>lit-modal-portal Usage Example</title>
    <!-- Your bundle/script -->
    <script type="module" src="main.js"></script>
  </head>
  <body>
    <!-- Your custom element -->
    <app-root></app-root>
  </body>
</html>
```

```js
// index.ts (source code for main.js)
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { portal } from 'lit-modal-portal';

@customElement('app-root')
export class AppRoot extends LitElement {
  render() {
    return html`
      <h1>lit-modal-portal Usage Example</h1>
      ${portal(html`<p>portal content</p>`, document.body)}
    `;
  }
}
```

When the `<app-root>` component renders, it will activate the `portal` directive, which will return `nothing` but use Lit's API to asynchronously render the content in a container `<div>` and append that container to `document.body`.

When the portal's content is updated, the directive will re-render the new content in the same container. Additionally, if the target changes, then the container will be removed from the old target and appended to the new target.

## API

```ts
portal(
  value: unknown,
  targetOrSelector: HTMLElement | string | Promise<HTMLElement | string>
): DirectiveResult<typeof PortalDirective>
```

Parameters:

- `value`: The content of the portal. This argument is passed as the same `value` argument in [Lit's `render` function](https://lit.dev/docs/api/templates/#render).
- `targetOrSelector`: An element or a string (or a promise that resolves to an element or a string) that identifies the portal's target.

  If the value (or the resolved value) is a string, then it is treated as a query selector and passed to `document.querySelector()` in order to locate the portal target.
  If no element is found with the selector, then an error is thrown.

This function will always return [Lit's `nothing` value](https://lit.dev/docs/api/templates/#nothing), because nothing is supposed to render where the portal is used.

## Advanced Usage

### Modals and dialogs

This package no longer provides modal components. Instead, it focuses on a directive that is simple to use in different ways and encourages users to implement their own modals.

One recommended approach is to use the [`dialog`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element and its [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) method,
which can be accessed using [Lit's `ref` directive](https://lit.dev/docs/templates/directives/#referencing-rendered-dom).

Consider the following:

```ts
// example-app.ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { portal } from 'lit-modal-portal';

import './lit-dialog';

@customElement('example-app')
export class ExampleApp extends LitElement {
  dialogRef = createRef<HTMLDialogElement>();

  render() {
    return html`
      <h1>lit-modal-portal Dialog Example</h1>
      <button @click=${() => this.dialogRef.value?.showModal()}>Show Dialog</button>
      ${portal(html`<lit-dialog .dialogRef=${this.dialogRef}></lit-dialog>`, document.body)}
    `;
  }
}
```

```ts
// lit-dialog.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';

@customElement('lit-dialog')
export class LitDialog extends LitElement {
  @property({ attribute: false })
  dialogRef: Ref<HTMLDialogElement> = createRef();

  render() {
    return html`
      <dialog ${ref(this.dialogRef)}>
        <p>This is the dialog</p>
        <button @click=${() => this.dialogRef.value?.close()}>Close Dialog</button>
      </dialog>
    `;
  }
}
```

In this example, we have a `<lit-dialog>` component that accepts a `dialogRef` from the parent `<example-app>`.
This allows the parent to open the dialog and the child to imperatively close it on a button's `@click` event.

This basic pattern can be extended as necessary. Examples include:

- Listening to the dialog's `close` event, which would trigger if the dialog was closed with the Escape key.
- Adding styles to the `<lit-dialog>` component.
- Adding callback function properties to `<lit-dialog>`.
- Using slotted content in the dialog component's template.

### Targeting elements in the Shadow DOM

Using a DOM node in a Lit component as a target for a portal is tricky (and perhaps useless or inadvisable), for a number of reasons:

1. The `querySelector` method does not penetrate through the shadow root, so running queries on the `document` node won't return anything.
2. The `portal` directive is _asynchronous_, so if it renders at the same time as the component's first render, _then the target might not even exist yet_.

We cannot simply call `querySelector` on a different render root, such as a component's shadow root, because it might be empty. However, this is still possible to accomplish safely with the use of [Lit's `queryAsync` decorator](https://lit.dev/docs/api/decorators/#queryAsync).

```ts
import { LitElement, html } from 'lit';
import { customElement, queryAsync } from 'lit/decorators.js';
import { portal } from 'lit-modal-portal';

@customElement('example-component')
export class ExampleComponent extends LitElement {
  @queryAsync('#portal-target')
  portalTarget: Promise<HTMLElement>;

  render() {
    return html`<div>
      ${portal(html`<p>Portal content</p>`, this.portalTarget)}
      <p>The portal isn't rendered before this paragraph, but in the following div.</p>
      <div id="portal-target"></div>
    </div>`;
  }
}
```

In this example, `this.portalTarget` is a promise that resolves to the `<div id="portal-target>` element after the `<example-component>` renders.

See [Lit's documentation](https://lit.dev/docs/components/shadow-dom/) for more information on components and the Shadow DOM.

### Styling portal content

Another consquence of the Shadow DOM is that only [inherited CSS properties](https://lit.dev/docs/components/styles/#inheritance) affect elements inside a shadow root. Coupled with the fact that a portal serves to render content in a different location, this makes it difficult for a component that uses the `portal` directive to style the portal's content.

**It is recommended that the content of a portal should be another Lit component that can own its CSS.** Alternatively, the [`styleMap` directive](https://lit.dev/docs/templates/directives/#stylemap) can be used in the template provided to the `portal` directive.

See [Lit's documentation](https://lit.dev/docs/components/styles/#shadow-dom) for more information on working with CSS styles and the Shadow DOM.

## Documentation

More in-depth documentation for this package is included in the repo, under the `/docs` directory.
It is also [hosted on GitHub Pages](https://nicholas-wilcox.github.io/lit-modal-portal/index.html).

## Development

For demonstration and testing purposes, you can start a local development server by running `npm run dev`.
There are multiple examples of the `portal` directive that explain its features and supported usage.

The default host is `localhost:8000`, and you may override the port number by setting the PORT environment variable.

The development server is [Modern Web's server](https://modern-web.dev/docs/dev-server/overview/),
running in watch mode, so you can see code changes reloaded into the browser automatically.
Note the middleware in `web-dev-server.config.mjs` that rewrites requests for the root so that `dev/index.html` is served.

## Contributing and Bug Reports

Currently, there is no standard procedure for contributing to this project.
You are absolutely welcome to fork the repository and make a pull request,
and to file issues if you encounter problems while using it.
