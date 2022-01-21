export default (...reducers) =>
  (state, action) => {
    for (const reducer of reducers) {
      state = reducer(state, action)
    }
    return state
  }
