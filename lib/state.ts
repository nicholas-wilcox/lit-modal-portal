/**
 * This is an excerpt of a utility module used to manage typed, immutable state.
 *
 */

import { ReactiveElement } from "lit";
import { Map } from "immutable";

/**
 * Creates a typed (immutable) Map whose keys are parameterized to be
 * the union type of all the keys of the given object type.
 */
export type MapOf<T> = Map<keyof T, any>;

/**
 * The StateManager is ideally extended by a controller that manages state for a component.
 * It can use the applyState function to update the existing state with partial members.
 */
export class StateManager<T> {
  protected constructor() {}

  applyState(existingState: MapOf<T>, newState: Partial<T>): MapOf<T> {
    if ((newState === undefined) || Object.keys(newState).length == 0) {
      return existingState;
    }

    return existingState.merge(Object.entries(newState) as [keyof T, any]);
  }
};

/**
 * The StatefulElement interface is ideally implemented by a component whose state
 * is managed by a StateManager. It declares an offerState method that can be used
 * to update the component's state from the controller.
 */
export interface StatefulElement<T> extends ReactiveElement {
  offerState(state: MapOf<T>): void
};
