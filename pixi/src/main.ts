import * as PIXI from 'pixi.js'
// @ts-ignore
import * as juce from './juce'

import './style.css'
import { Grid } from './grid'
import { colors, config } from './config'
import { createApp } from './app'
import { Plot } from './plot'
import { fetchLevels } from './data'
import { getHSLString } from './utils'
import { Slider } from './slider'

const app = await createApp()

const grid = new Grid(
  { width: config.width, height: config.height },
  config.maxDb,
  config.minDb,
  10
)
app.stage.addChild(grid.getGrid())

const plot = new Plot()
app.stage.addChild(plot.getPlot())

setInterval(async () => {
  const levelData = await fetchLevels()
  if (!levelData) return
  plot.update(levelData)
}, 30)

const getLevelY = (db: number) => {
  const peakNormalized = -(db - config.maxDb) * 0.01
  const y = (peakNormalized / config.dbRangeMul) * config.height
  return y
}

const getLevelDbFromY = (y: number) => {
  const yMin = 0
  const yMax = config.height
  const dbMin = config.maxDb
  const dbMax = config.minDb

  return dbMin + (y - yMin) * ((dbMax - dbMin) / (yMax - yMin))
}

const handlePadding = 24
const handleLabelWidth = 64
const handleLabelHeight = 16
const handleLabelX = config.width / 2 - handleLabelWidth / 2
const handleLabelY = 0 - handleLabelHeight / 2

const handle = new PIXI.Container()
app.stage.addChild(handle)

const handleColor = getHSLString(colors.handle)

const handleGraphics = new PIXI.Graphics()
handleGraphics
  .moveTo(handlePadding, 0)
  .lineTo(config.width - handlePadding, 0)
  .stroke({ color: handleColor, width: 2 })
  .rect(handleLabelX, handleLabelY, handleLabelWidth, handleLabelHeight)
  .fill(handleColor)
handle.addChild(handleGraphics)

const handleLabel = new PIXI.Text({
  text: 'DIGITAL',
  style: {
    fontSize: 12,
    fill: '#fff',
  },
  x: config.width / 2,
  y: 0,
})

handleLabel.anchor.set(0.5, 0.5)
handle.addChild(handleLabel)

handle.cursor = 'grab'

const handleMaxY = getLevelY(config.minDb + 3)
const handleMinY = getLevelY(config.maxDb - 3)

const handleYRange = handleMaxY - handleMinY
console.log(handleYRange)

const clipThresholdSliderState = juce.getSliderState('clipThresholdSlider')
handle.y =
  handleMinY +
  (1 - clipThresholdSliderState.getNormalisedValue()) * handleYRange
clipThresholdSliderState.valueChangedEvent.addListener(() => {
  handle.y =
    handleMinY +
    (1 - clipThresholdSliderState.getNormalisedValue()) * handleYRange
  // console.log(clipThresholdSliderState.getValue())
})

const getNormalisedValueForY = (y: number) => {
  const yMin = handleMinY
  const yMax = handleMaxY
  const dbMin = 0
  const dbMax = 1

  return 1 - (dbMin + (y - yMin) * ((dbMax - dbMin) / (yMax - yMin)))
}

const handleDrag = (e: PointerEvent) => {
  const { movementY } = e
  handle.y += movementY
  if (handle.y > handleMaxY) {
    handle.y = handleMaxY
  } else if (handle.y < handleMinY) {
    handle.y = handleMinY
  }

  clipThresholdSliderState.setNormalisedValue(getNormalisedValueForY(handle.y))
}

const handleDragEnd = () => {
  window.removeEventListener('pointermove', handleDrag)
  window.removeEventListener('pointerup', handleDragEnd)

  document.body.style.cursor = 'auto'
  handle.cursor = 'grab'
}

handle.interactive = true
handle.on('pointerdown', () => {
  document.body.style.cursor = 'grabbing'
  handle.cursor = 'grabbing'

  window.addEventListener('pointermove', handleDrag)
  window.addEventListener('pointerup', handleDragEnd)
})

// const slider = new Slider('DIGITAL', () => {})
// app.stage.addChild(slider.getSlider())
