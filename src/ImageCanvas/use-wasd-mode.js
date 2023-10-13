import { useEffect } from "react"
import { useSettings } from "../SettingsProvider"

export default ({ getLatestMat, changeMat }) => {
  const { wasdMode } = useSettings()
  useEffect(() => {
    if (!wasdMode) return
    const vel = 10
    const dirs = {
      w: [0, -vel],
      a: [-vel, 0],
      s: [0, vel],
      d: [vel, 0],
    }
    const keysDown = {}
    const keys = Object.keys(dirs)
    const keyDownListener = (e) => {
      if (keys.includes(e.key)) {
        keysDown[e.key] = true
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const keyUpListener = (e) => {
      if (keys.includes(e.key)) {
        keysDown[e.key] = false
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const interval = setInterval(() => {
      let newMat = getLatestMat().clone()
      let somethingChanged = false
      for (const key in keysDown) {
        if (keysDown[key]) {
          newMat = newMat.translate(...dirs[key])
          somethingChanged = true
        }
      }
      if (somethingChanged) changeMat(newMat)
    }, 16)
    window.addEventListener("keydown", keyDownListener)
    window.addEventListener("keyup", keyUpListener)
    return () => {
      clearInterval(interval)
      window.removeEventListener("keydown", keyDownListener)
      window.removeEventListener("keyup", keyUpListener)
    }
  }, [wasdMode])
}
