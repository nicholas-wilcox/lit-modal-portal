/**
 * [immutable]: https://immutable-js.com/docs
 * This is an excerpt of a utility module used to manage typed, immutable state.
 * Please refer to [the immutable-js documentation][immutable].
 *
 * @module
 */
import { ReactiveElement } from 'lit';
import { Map, is } from 'immutable';

/**
 * A typed (immutable) [Map](https://immutable-js.com/docs/v4.1.0/Map/)
 * whose keys are parameterized to be the union type of all the keys of `T`.
 *
 * @typeParam T An [object type](https://www.typescriptlang.org/docs/handbook/2/objects.html)
 */
export type MapOf<T> = Map<keyof T, any>;

/**
 * Returns the result of merging `newState` into `existingState`.
 *
 * @typeParam T The type of the managed state, assumed to be an
 * [object type](https://www.typescriptlang.org/docs/handbook/2/objects.html)
 */
export function applyState<T>(existingState: MapOf<T>, newState: Partial<T>): MapOf<T> {
  if (newState === undefined || Object.keys(newState).length == 0) {
    return existingState;
  }

  return existingState.merge(Object.entries(newState) as [keyof T, any]);
}

/**
 * The StatefulElement interface is ideally implemented by a component whose state
 * is managed by a Lit controller. It declares an `offerState()` method that can be used
 * to update the component's state from the controller.
 *
 * @typeParam T The type of the managed state, assumed to be an
 * [object type](https://www.typescriptlang.org/docs/handbook/2/objects.html)
 */
export interface StatefulElement<T> extends ReactiveElement {
  /**
   * Consumes `state`, performing render updates and other actions as necessary.
   */
  offerState(state: MapOf<T>): void;
}

/**
 * Typed wrapper around membership checking for [[`MapOf`]]'s.
 * Returns true if `newState` has the property given by `name` defined
 * and the value of `newState.get(name)` is different than `current`.
 *
 * See [`Map.has()`](https://immutable-js.com/docs/v4.1.0/Map/#has())
 * and [`is()`](https://immutable-js.com/docs/v4.1.0/is()/).
 *
 * @typeParam T An [object type](https://www.typescriptlang.org/docs/handbook/2/objects.html)
 */
export function isNew<T>(newState: MapOf<T>, name: keyof T, current: any) {
  return newState.has(name) && !is(newState.get(name), current);
}
