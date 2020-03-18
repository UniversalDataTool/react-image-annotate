// @flow

const getTimeString = ms => {
  if (ms < 1000) {
    return ms + "ms"
  } else {
    const secs = ms / 1000
    if (secs < 60) {
      if (Number.isInteger(secs)) {
        return secs + "s"
      } else {
        return secs.toFixed(1) + "s"
      }
    } else {
      const mins = secs / 60
      if (Number.isInteger(mins)) {
        return mins + "m"
      } else {
        return mins.toFixed(1) + "m"
      }
    }
  }
}

export default getTimeString
