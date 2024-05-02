import { Action, MainLayoutStateBase } from "../../MainLayout/types.ts";
import { ImmutableObject } from "seamless-immutable";

export default <T extends ImmutableObject<MainLayoutStateBase>>(
    ...reducers: ((state: T, action: Action) => T)[]
  ) =>
  (state: T, action: Action) => {
    for (const reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
