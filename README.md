# lit-modal-portal

https://user-images.githubusercontent.com/10066251/174079212-95af47cf-685b-47a6-8b56-9bc7b3d1033f.mov

The `lit-modal-portal` package provides a specialized portal mechanism for modals, developed with the [Lit](https://lit.dev) framework.
It is inspired by [React Portals](https://reactjs.org/docs/portals.html) and also developed with
the intent to utilize the Lit API wherever possible.

Specifically, the package exports a `<modal-portal>` Lit component that should be added to the bottom of your application's DOM
and implements a modal stack that can be manipulated via a singleton `modalController` that is attached to the `<modal-portal>`.
The package also provides a `portal()` directive that encapsulates the behavior of evaluating the template
for a modal and pushing/popping it from the modal stack based on a given boolean expression.

### Note on UI/UX Best Practices for Modals, Dialogs, Overlays, etc.

A fair number of guides on how to design and develop modals can be found online,
and we encourage you to consult resources such as these when using this package.
Many common suggestions fall into one of the two following categories:

1. What types of content should appear in a modal, or what a modal's visual appearance should be.
2. When and how a modal should (dis)appear.

The responsibilities of the first category, as well as most of the second category, are left to you
as the consumer of this package.

Ironically, the ability to "nest" modals inside (or rather, _in front of_) each other is considered bad practice.
While we do not expect you to purposefully creating a large modal stack in production, the code in this package
was designed with a specific use case in mind, in which a modal contains buttons whose actions require confirmation.

Without further ado, let's dive in.

## Installation and Usage

You can install `lit-modal-portal` via NPM.

```
npm install lit-modal-portal
```

Suppose we have the following Lit application:

#### `index.html`

```html
<!DOCTYPE html>
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

#### `index.ts` (source code for `main.js`)

```javascript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-root')
export class AppRoot extends LitElement {
  render() {
    return html`
      <h1>lit-modal-portal Usage Example</h1>
      <hr />
      <button>Show Modal</button>
    `;
  }
}
```

To install the modal portal, add an `import 'lit-modal-portal/modal-portal.js'` statement to your main script,
and then add the `<modal-portal>` custom element to your HTML, preferably at the bottom of the `<body>` element.

Next, to send a modal through the portal, you can use the `modalController` or the `portal` exports.
Here is an example of what the code might look like:

#### `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>lit-modal-portal Usage Example</title>
    <script type="module" src="main.js"></script>
  </head>
  <body>
    <app-root></app-root>
    <!-- Added modal portal element -->
    <modal-portal></modal-portal>
  </body>
</html>
```

#### `index.ts` (source code for `main.js`)

```javascript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

// Added imports
import { modalController } from 'lit-modal-portal';
import 'lit-modal-portal/modal-portal.js';

// An example custom element from your project
import './path/to/your-custom-modal.js';

function pushModal() {
  modalController.push(html`<your-custom-modal></your-custom-modal>`);
}

@customElement('app-root')
export class AppRoot extends LitElement {
  render() {
    return html`
      <h1>lit-modal-portal Usage Example</h1>
      <hr />
      <button @click=${pushModal}>Show Modal</button>
    `;
  }
}
```

When the button is clicked, the Lit template will be sent to the `<modal-portal>` element, which will render it.

### Using the `portal` Directive

The `portal` directive offers a way for a modal to be more integrated with the component that is responsible
for sending it through the portal in the first place.
Observe the following example (`import`s removed for brevity):

```javascript
@customElement('app-root')
export class AppRoot extends LitElement {
  @state()
  showModal = false;

  render() {
    return html`
      <h1>lit-modal-portal Usage Example</h1>
      <hr />
      <button @click=${() => (this.showModal = true)}>Show Modal</button>
      ${portal(
        this.showModal,
        html`<your-custom-modal></your-custom-modal>`,
        () => (this.showModal = false)
      )}
    `;
  }
}
```

Here, the modal will appear as soon as the `AppRoot` component updates after setting `showModal = true`.
Once the modal closes, the callback function (`() => this.showModal = false`) will execute.
If the `AppRoot`'s template changes, including changes to the nested template inside of the `portal` directive,
then those changes will propagate to the modal currently rendered in the `<modal-portal>`.

## Overview

The exports of the main module are the following:

- `ModalPortal`: The class of the `<modal-portal>` element,
- `modalController`: A singleton controller to manage the modal portal, and
- `portal`: A directive to manage the behavior of conditionally and dynamically rendering a modal.

There is also a `lib` module with the following exports:

- `LitDialog`:
  The class for a `<lit-dialog>` custom element,
  which wraps a `<dialog>` inside itself in order to integrate it with the `ModalPortal`.
- `WithLitDialog`:
  A mixin for any web component that is composed with a `<lit-dialog>` element.
  It provides a bit of boilerplate to manage the `<lit-dialog>`;
- `ConfirmModal`: The class for an example component that uses `LitDialog`.

Of course, these components should be imported directly if they are being used as custom elements,
like the modal portal (i.e. `import 'lit-modal-portal/lib/confirm-modal.js'`).

## Documentation

The documentation for this package is included in the repo, under the `/docs` directory.
It is also [hosted on GitHub Pages](https://cirrus-logic.github.io/lit-modal-portal/index.html).

## Development

To see more examples of the package working in the browser, you can use `npm run dev`.
This will launch a dev server on your localhost, where a sandbox is hosted at `localhost:<PORT>/dev`.
You can change code from the example _or_ the package's source code,
and see those changes in the browser upon reload, which should happen automatically.

## Contributing and Bug Reports

Currently, there is no standard procedure for contributing to this project.
You are absolutely welcome to fork the repository and make a pull request,
and to file issues if you encounter problems while using it.

However, this is currently a side project of a single engineer that was developed in between sprints.
So, I ask for you patience as I acclimate to the task of maintaining an open source repository.
