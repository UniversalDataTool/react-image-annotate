var getTimeString = function getTimeString(ms) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (ms < 1000) {
    return ms + "ms";
  } else {
    var secs = ms / 1000;

    if (secs < 60) {
      if (Number.isInteger(secs)) {
        return secs + "s";
      } else {
        return secs.toFixed(precision) + "s";
      }
    } else {
      var mins = secs / 60;

      if (Number.isInteger(mins)) {
        return mins + "m";
      } else {
        return mins.toFixed(precision) + "m";
      }
    }
  }
};

export default getTimeString;