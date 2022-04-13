# lit-modal-portal

The `lit-modal-portal` package provides a specialized portal mechanism for modals, developed with the [Lit](https://lit.dev) framework.
It is inspired by [React Portals](https://reactjs.org/docs/portals.html) and also developed with
a focus on utilizing the Lit API wherever possible, with the intent to both provide flexibility and abide by the
[principle of least surprise](https://en.wikipedia.org/wiki/Principle_of_least_astonishment).

Specifically, the package exports a `<modal-portal>` Lit component that is added to the bottom of your app root
and implements a modal stack that can be consumed from *anywhere* in your component hierarchy
(even from within a modal).

### Note on UI/UX Best Practices for Modals, Dialogs, Overlays, etc.

A fair number of guides on how to design and develop modals can be found online,
and we encourage you to consult resources such as these when using this package.
Many common suggestions fall into one of the two following categories:

1. What types of content should appear in a modal, or what a modal's visual appearance should be.
2. When and how a modal should (dis)appear.

The responsibilities of the first category, as well as most of the second category, are left to you
as the consumer of this package.
We *do* provide some accessibility features and common behaviors (see below).
Ironically, the ability to "nest" modals inside (or rather, *in front of*) each other is considered bad practice.

Without further ado, let's dive in.

## Feature Overview
