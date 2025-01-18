import * as PIXI from 'pixi.js'
import { getHSLString } from './utils'
import { colors } from './config'

export class Grid {
  private container = new PIXI.Container()
  private grid: PIXI.Graphics

  private maxDb: number
  private minDb: number
  private numSteps: number

  private labelPadding = 4

  constructor(
    size: { width: number; height: number },
    maxDb: number,
    minDb: number,
    numSteps: number
  ) {
    this.maxDb = maxDb
    this.minDb = minDb
    this.numSteps = numSteps
    this.grid = new PIXI.Graphics()
    this.createGrid(size.width, size.height)
  }

  private createGrid(width: number, height: number) {
    const step = height / this.numSteps
    for (let i = 0; i < this.numSteps; i++) {
      if (!!i) {
        this.grid.moveTo(0, i * step)
        this.grid.lineTo(width, i * step)
      }
      const alpha = 1 - (i / this.numSteps) * 0.65

      this.grid.stroke({ color: '#bbb', width: 1, alpha })

      const levelLabelText = (
        this.maxDb -
        i * ((this.maxDb - this.minDb) / this.numSteps)
      ).toFixed(0)

      const grLabelText = i * ((this.maxDb - this.minDb) / this.numSteps)

      const levelLabel = new PIXI.Text({
        text: levelLabelText,
        style: {
          fontSize: 12,
          fill: getHSLString(colors.level),
        },
      })
      levelLabel.anchor.set(1, 0)
      levelLabel.x = width - this.labelPadding
      levelLabel.y = i * step + this.labelPadding

      const grLabel = new PIXI.Text({
        text: grLabelText,
        style: {
          fontSize: 12,
          fill: getHSLString(colors.gr),
        },
      })

      grLabel.anchor.set(0, 0)
      grLabel.x = this.labelPadding
      grLabel.y = i * step + this.labelPadding

      this.container.addChild(levelLabel)
      this.container.addChild(grLabel)
    }
    const levelHeading = new PIXI.Text({
      text: 'GAIN',
      style: {
        fontSize: 12,
        fill: getHSLString(colors.level),
      },
    })
    levelHeading.anchor.set(1, 1)
    levelHeading.x = width - this.labelPadding
    levelHeading.y = height - this.labelPadding
    this.container.addChild(levelHeading)

    const grHeading = new PIXI.Text({
      text: 'REDUCTION',
      style: {
        fontSize: 12,
        fill: getHSLString(colors.gr),
      },
    })

    grHeading.anchor.set(0, 1)
    grHeading.x = this.labelPadding
    grHeading.y = height - this.labelPadding
    this.container.addChild(grHeading)

    this.container.addChild(this.grid)
  }

  getGrid() {
    return this.container
  }
}
