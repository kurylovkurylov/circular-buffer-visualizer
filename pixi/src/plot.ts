import * as PIXI from 'pixi.js'
import { colors, config } from './config'
import { HSLColor, LevelData } from './types'
import { getHSLString } from './utils'

export class Plot {
  private graphics: PIXI.Graphics
  private levelGradient: PIXI.FillGradient
  private grGradient: PIXI.FillGradient

  constructor() {
    this.graphics = new PIXI.Graphics()

    this.levelGradient = this.createPlotGradient(colors.level)
    this.grGradient = this.createPlotGradient(colors.gr)
  }

  update(data: LevelData) {
    const { peakHistory, vuHistory, grHistory } = data
    const peakPoints: PIXI.PointData[] = []
    const vuPoints: PIXI.PointData[] = []
    const grPoints: PIXI.PointData[] = []

    for (let x = 0; x < peakHistory.length; x++) {
      const peakY = this.getLevelY(peakHistory[x])
      const vuY = this.getLevelY(vuHistory[x])
      const grY = this.getGrY(grHistory[x])

      this.graphics.clear()

      peakPoints.push({
        x,
        y: peakY,
      })
      vuPoints.push({
        x,
        y: vuY,
      })
      grPoints.push({
        x,
        y: grY,
      })
    }

    this.graphics.poly(peakPoints, false)
    this.graphics.stroke({
      fill: this.levelGradient,
      width: 1,
      alignment: 0.5,
      alpha: 0.5,
    })

    this.graphics.poly(vuPoints, false)
    this.graphics.stroke({
      fill: this.levelGradient,
      width: 2,
      alignment: 0.5,
      alpha: 0.75,
    })

    this.graphics.poly(grPoints, false)
    this.graphics.stroke({
      fill: this.grGradient,
      width: 1,
      alignment: 0.5,
    })
  }

  getPlot() {
    return this.graphics
  }

  private getLevelY(db: number) {
    const peakNormalized = -(db - config.maxDb) * 0.01
    const y = (peakNormalized / config.dbRangeMul) * config.height + 1
    return y
  }

  private getGrY(gr: number) {
    const grNormalized = gr * 0.01
    const y = (grNormalized / config.dbRangeMul) * config.height - 1
    return y
  }

  private createPlotGradient(color: HSLColor, width = config.width) {
    const gradient = new PIXI.FillGradient(0, 0, width, 0)

    gradient.addColorStop(0, getHSLString(color, 0))
    gradient.addColorStop(0.01, getHSLString(color, 0))
    gradient.addColorStop(0.1, getHSLString(color))
    gradient.addColorStop(0.9, getHSLString(color))
    gradient.addColorStop(0.99, getHSLString(color, 0))
    gradient.addColorStop(1, getHSLString(color, 0))

    return gradient
  }
}
