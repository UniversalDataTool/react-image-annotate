export default (function () {
  for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (state, action) {
    for (var _i = 0, _reducers = reducers; _i < _reducers.length; _i++) {
      var reducer = _reducers[_i];
      state = reducer(state, action);
    }

    return state;
  };
});