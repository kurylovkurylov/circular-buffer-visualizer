import { HSLColor } from './types'

class Config {
  width = 512
  height = 512
  background = '#ddd'
  maxDb = 12
  minDb = -48
  dbRange = this.maxDb - this.minDb
  dbRangeMul = this.dbRange / 100
}

export const config = new Config()

export const colors: Record<string, HSLColor> = {
  gr: {
    h: 350,
    s: 75,
    l: 60,
  },
  level: {
    h: 230,
    s: 75,
    l: 60,
  },
  handle: {
    h: 110,
    s: 50,
    l: 35,
  },
}
