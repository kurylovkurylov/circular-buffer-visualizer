import { HSLColor } from './types'

export const getHSLString = (color: HSLColor, alpha = 1) => {
  return `hsla(${color.h},${color.s}%,${color.l}%,${alpha})`
}
