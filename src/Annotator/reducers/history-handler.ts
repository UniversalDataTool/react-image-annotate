

import { Action, MainLayoutImageAnnotationState, MainLayoutState } from "../../MainLayout/types";
import moment from "moment";
import { produce } from "immer";
import { omit } from "lodash";

const typesToSaveWithHistory: Record<string, string> = {
  BEGIN_BOX_TRANSFORM: "Transform/Move Box",
  BEGIN_MOVE_POINT: "Move Point",
  DELETE_REGION: "Delete Region",
};

export const saveToHistory = <T extends MainLayoutState>(
  state: T,
  name: string
): T => produce(state, (draft) => {
  const newValue = {
    time: moment().toDate(),
    state: { ...state, history: undefined },
    name,
  };

  const prevItems = draft.history || [];
  draft.history = [newValue, ...prevItems].slice(0, 9);
});

export default (
  reducer: (
    state: MainLayoutState,
    action: Action
  ) => MainLayoutState
) => {
  return (state: MainLayoutState, action: Action) => {
    const prevState = state;
    const nextState = reducer(state, action);

    if (action.type === "RESTORE_HISTORY") {
      if (state.history.length > 0) {
        const newState = produce(nextState.history[0].state, (draft) => {
          draft.history = nextState.history.slice(1);
        });
        return newState;
      }
    } else {
      if (
        prevState !== nextState &&
        Object.keys(typesToSaveWithHistory).includes(action.type)
      ) {
        const historyItem = {
          time: moment().toDate(),
          state: omit(prevState, "history") as MainLayoutImageAnnotationState,
          name: typesToSaveWithHistory[action.type] || action.type,
        };
      
        const nextStateWithHistory = produce(nextState, (draft) => {
          const prevItems = draft.history || [];
          draft.history = [historyItem, ...prevItems].slice(0, 9);
        });
      
        return nextStateWithHistory;
      }
    }

    return nextState;
  };
};
