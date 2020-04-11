// @flow weak

import { useRef, useState } from "react"

export default (imageSrc, onImageLoaded) => {
  const [imageLoaded, changeImageLoaded] = useState(false)
  const image = useRef(null)
  if (image.current === null) {
    image.current = new Image()
    image.current.onload = () => {
      changeImageLoaded(true)
      if (onImageLoaded)
        onImageLoaded({
          width: image.current.naturalWidth,
          height: image.current.naturalHeight,
        })
    }
    image.current.src = imageSrc
  }
  return [image.current, imageLoaded]
}
