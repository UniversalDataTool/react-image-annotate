// @flow

import {setIn, updateIn, without} from "seamless-immutable"
import moment from "moment"

const typesToSaveWithHistory = {
  BEGIN_BOX_TRANSFORM: "Transform/Move Box",
  BEGIN_MOVE_POINT: "Move Point",
  DELETE_REGION: "Delete Region",
}

export const saveToHistory = (state, name) =>
  updateIn(state, ["history"], (h) =>
    [
      {
        time: moment().toDate(),
        state: without(state, "history"),
        name,
      },
    ].concat((h || []).slice(0, 9))
  )

export default (reducer) => {
  return (state, action) => {
    const prevState = state
    const nextState = reducer(state, action)

    if (action.type === "RESTORE_HISTORY") {
      if (state.history.length > 0) {
        return setIn(
          nextState.history[0].state,
          ["history"],
          nextState.history.slice(1)
        )
      }
    } else {
      if (
        prevState !== nextState &&
        Object.keys(typesToSaveWithHistory).includes(action.type)
      ) {
        return setIn(
          nextState,
          ["history"],
          [
            {
              time: moment().toDate(),
              state: without(prevState, "history"),
              name: typesToSaveWithHistory[action.type] || action.type,
            },
          ]
            .concat(nextState.history || [])
            .slice(0, 9)
        )
      }
    }

    return nextState
  }
}
