import { FC, useCallback } from 'react'
import { Graphics } from '@pixi/react'
import { Color, LineStyle, Graphics as PixiGraphics } from 'pixi.js'
import { Size } from '../../types/global'

type PlotLineStyle = Partial<LineStyle>

const lineStyle: PlotLineStyle = {
  width: 0.5,
  color: new Color('hsl(0,0%,80%)').toNumber(),
} as const

interface GridProps {
  size: Size
  numSteps: number
  maxDb: number
  stepDb: number
}

export const Grid: FC<GridProps> = ({ size, numSteps }) => {
  const { width, height } = size

  const drawLines = useCallback(
    (g: PixiGraphics) => {
      g.clear()
      g.lineStyle(lineStyle)

      for (let i = 1; i < numSteps; i++) {
        const y = (height / numSteps) * i
        g.moveTo(0, y)
        g.lineTo(width, y)
      }
    },
    [width, height, numSteps]
  )

  return <Graphics draw={drawLines} />
}
