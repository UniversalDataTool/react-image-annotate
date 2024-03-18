
export const getEnclosingBox = (region) => {
  switch (region.type) {
    case "polygon": {
      const box = {
        x: region.points[0][0],
        y: region.points[0][1],
        w: 0,
        h: 0,
      }
      return box
    }
    case "keypoints": {
      const minX = Math.min(
        ...Object.values(region.points).map(({x, y}) => x)
      )
      const minY = Math.min(
        ...Object.values(region.points).map(({x, y}) => y)
      )
      const maxX = Math.max(
        ...Object.values(region.points).map(({x, y}) => x)
      )
      const maxY = Math.max(
        ...Object.values(region.points).map(({x, y}) => y)
      )
      return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
      }
    }
    case "expanding-line": {
      const box = {
        x: Math.min(...region.points.map(({x, y}) => x)),
        y: Math.min(...region.points.map(({x, y}) => y)),
        w: 0,
        h: 0,
      }
      box.w = Math.max(...region.points.map(({x, y}) => x)) - box.x
      box.h = Math.max(...region.points.map(({x, y}) => y)) - box.y
      return box
    }
    case "line": {
      return {x: region.x1, y: region.y1, w: 0, h: 0}
    }
    case "box": {
      return {x: region.x, y: region.y, w: region.w, h: region.h}
    }
    case "point": {
      return {x: region.x, y: region.y, w: 0, h: 0}
    }
    default: {
      return {x: 0, y: 0, w: 0, h: 0}
    }
  }
}

export const moveRegion = (region, x, y) => {
  switch (region.type) {
    case "point": {
      return {...region, x, y}
    }
    case "box": {
      return {...region, x: x - region.w / 2, y: y - region.h / 2}
    }
    default: {
      return region
    }
  }
}
