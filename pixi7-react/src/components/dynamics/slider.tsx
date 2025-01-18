import { FC, useCallback, useEffect } from 'react'
import { Container, Graphics, Text } from '@pixi/react'
import { Graphics as IGraphics, Color, LineStyle, TextStyle } from 'pixi.js'
import { useJuceSlider } from '../../hooks/use-juce-slider'
import { Size } from '../../types/global'
import { useDrag } from '../../hooks/use-drag'

type PlotLineStyle = Partial<LineStyle>

const SLIDER_CONFIG = {
  LINE_WIDTH: 2,
  LABEL_WIDTH: 64,
  LABEL_HEIGHT: 16,
  LABEL_BORDER_RADIUS: 2,
  LABEL_FONT_SIZE: 12,
  // LABEL_FONT_COLOR: 'hsl(0,0%,40%)',
  LABEL_FONT_COLOR: '#fff',
  // COLOR: new Color('hsl(0,0%,70%)'),
  // COLOR: new Color('hsl(210, 65%, 65%)'),
  COLOR: new Color('hsl(0, 0%, 65%)'),
}

const lineStyle: PlotLineStyle = {
  width: SLIDER_CONFIG.LINE_WIDTH,
  color: SLIDER_CONFIG.COLOR.toNumber(),
} as const

const labelStyle = new TextStyle({
  fontSize: 12,
  fill: SLIDER_CONFIG.LABEL_FONT_COLOR,
})

const drawSlider = (g: IGraphics, y: number, width: number, color: number) => {
  const labelX = width / 2 - SLIDER_CONFIG.LABEL_WIDTH / 2
  const labelY = y - SLIDER_CONFIG.LABEL_HEIGHT / 2

  g.clear()
  g.lineStyle(lineStyle)
  g.moveTo(0, y)
  g.lineTo(width, y)
  g.beginFill(color)
  g.drawRoundedRect(
    labelX,
    labelY,
    SLIDER_CONFIG.LABEL_WIDTH,
    SLIDER_CONFIG.LABEL_HEIGHT,
    SLIDER_CONFIG.LABEL_BORDER_RADIUS
  )
  g.endFill()
}

interface SliderProps {
  id: string
  color?: Color
  parentSize: Size
}

export const Slider: FC<SliderProps> = ({ id, color, parentSize }) => {
  const { name, value, getNormalisedValue, setNormalisedValue } =
    useJuceSlider(id)

  const onDrag = useCallback(
    (e: PointerEvent) => {
      if (e.movementY === 0) return
      const sliderValue = getNormalisedValue()

      const newValue = sliderValue - e.movementY / parentSize.height
      setNormalisedValue(newValue)
    },
    [getNormalisedValue, parentSize.height, setNormalisedValue]
  )

  const { isDragging, handleDragStart } = useDrag({ onDrag })

  const y = (1 - value) * parentSize.height
  const textX = parentSize.width / 2

  const sliderColor = color || SLIDER_CONFIG.COLOR
  const sliderColorHex = sliderColor.toNumber()

  const sliderCursor = isDragging ? 'grabbing' : 'grab'

  const draw = useCallback(
    (g: IGraphics) => drawSlider(g, y, parentSize.width, sliderColorHex),
    [parentSize, y, sliderColorHex]
  )

  useEffect(() => {
    document.body.style.cursor = isDragging ? 'grabbing' : 'auto'
  }, [isDragging])

  return (
    <Container
      eventMode='dynamic'
      cursor={sliderCursor}
      onpointerdown={handleDragStart}
    >
      <Graphics draw={draw} />
      <Text
        text={name.toUpperCase()}
        anchor={0.5}
        x={textX}
        y={y}
        style={labelStyle}
      />
    </Container>
  )
}
