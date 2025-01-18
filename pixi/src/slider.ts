import * as PIXI from 'pixi.js'
import { colors, config } from './config'
import { getHSLString } from './utils'

const getLevelY = (db: number) => {
  const peakNormalized = -(db - config.maxDb) * 0.01
  const y = (peakNormalized / config.dbRangeMul) * config.height
  return y
}

const handleMaxY = getLevelY(config.minDb + 3)
const handleMinY = getLevelY(config.maxDb - 3)

const getNormalisedValueForY = (y: number) => {
  const yMin = handleMinY
  const yMax = handleMaxY
  const dbMin = 0
  const dbMax = 1

  return 1 - (dbMin + (y - yMin) * ((dbMax - dbMin) / (yMax - yMin)))
}

const sliderConfig = {
  padding: 24,
  labelWidth: 64,
  labelHeight: 16,
  getLabelX() {
    return config.width / 2 - sliderConfig.labelWidth / 2
  },
  getLabelY() {
    return 0 - sliderConfig.labelHeight / 2
  },
}

export class Slider {
  private container: PIXI.Container
  private graphics: PIXI.Graphics
  private label: PIXI.Text

  private labelText: string
  private color = getHSLString(colors.handle)

  private onChange: (value: number) => void

  constructor(
    labelText: string,
    onChange: (value: number) => void,
    color?: string
  ) {
    this.container = new PIXI.Container()
    this.graphics = new PIXI.Graphics()
    this.label = new PIXI.Text()

    this.container.addChild(this.graphics)
    this.container.addChild(this.label)

    this.labelText = labelText
    if (color) this.color = color

    this.drawGraphics()
    this.drawLabel()

    this.onChange = onChange

    this.container.interactive = true
    this.container.cursor = 'grab'

    this.container.on('pointerdown', this.handleDragStart.bind(this))
  }

  private drawGraphics() {
    this.graphics
      .moveTo(sliderConfig.padding, 0)
      .lineTo(config.width - sliderConfig.padding, 0)
      .stroke({ color: this.color, width: 2 })
      .rect(
        sliderConfig.getLabelX(),
        sliderConfig.getLabelY(),
        sliderConfig.labelWidth,
        sliderConfig.labelHeight
      )
      .fill(this.color)
  }

  private drawLabel() {
    this.label.text = this.labelText
    this.label.style = {
      fontSize: 12,
      fill: '#fff',
    }

    this.label.x = config.width / 2
    this.label.y = 0
    this.label.anchor.set(0.5, 0.5)
  }

  private handleDragStart() {
    document.body.style.cursor = 'grabbing'
    this.container.cursor = 'grabbing'

    window.addEventListener('pointermove', this.handleDrag.bind(this))
    window.addEventListener('pointerup', this.handleDragEnd.bind(this))
  }

  private handleDrag(e: PointerEvent) {
    const { movementY } = e
    this.container.y += movementY
    this.container.y = Math.max(
      handleMinY,
      Math.min(this.container.y, handleMaxY)
    )
    const value = getNormalisedValueForY(this.container.y)
    this.onChange(value)
  }

  private handleDragEnd() {
    window.removeEventListener('pointermove', this.handleDrag)
    window.removeEventListener('pointerup', this.handleDragEnd)

    document.body.style.cursor = 'auto'
    this.container.cursor = 'grab'
  }

  getSlider() {
    return this.container
  }

  setValue(value: number) {
    this.container.y =
      getLevelY(value) -
      (1 - value) * (getLevelY(config.maxDb) - getLevelY(config.minDb))
  }
}
