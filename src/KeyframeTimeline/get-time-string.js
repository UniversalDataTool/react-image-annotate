// @flow

const getTimeString = (ms, precision = 1) => {
  if (ms < 1000) {
    return ms + "ms"
  } else {
    const secs = ms / 1000
    if (secs < 60) {
      if (Number.isInteger(secs)) {
        return secs + "s"
      } else {
        return secs.toFixed(precision) + "s"
      }
    } else {
      const mins = secs / 60
      if (Number.isInteger(mins)) {
        return mins + "m"
      } else {
        return mins.toFixed(precision) + "m"
      }
    }
  }
}

export default getTimeString
