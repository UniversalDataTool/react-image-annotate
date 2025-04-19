import { Action, MainLayoutStateBase } from "../../MainLayout/types.ts";

export default <T extends MainLayoutStateBase>(
    ...reducers: ((state: T, action: Action) => T)[]
  ) =>
  (state: T, action: Action) => {
    for (const reducer of reducers) {
      state = reducer(state, action);
    }
    return state;
  };
