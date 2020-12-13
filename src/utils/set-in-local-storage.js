export default (key, val) => {
  window.localStorage.setItem(
    `__REACT_IMAGE_ANNOTATE_${key}`,
    JSON.stringify(val)
  )
}
