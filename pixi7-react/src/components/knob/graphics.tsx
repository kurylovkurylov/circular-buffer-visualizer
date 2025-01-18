import { FC, useCallback } from 'react'
import { Container, Graphics } from '@pixi/react'
import { DEG_TO_RAD, Graphics as IGraphics, LINE_CAP } from 'pixi.js'
import { KNOB_CONFIG } from './config'

const drawArcBg = (g: IGraphics, radius: number) => {
  g.lineStyle({
    width: KNOB_CONFIG.SIZE.BORDER,
    color: KNOB_CONFIG.COLOR.ARC_BG,
    cap: LINE_CAP.ROUND,
    alignment: 0,
  })
  g.arc(radius, radius, radius, 0, KNOB_CONFIG.ARC_ANGLE * DEG_TO_RAD)
  g.endFill()
}

const drawArcValue = (g: IGraphics, radius: number, value: number) => {
  const endAngle = 0.5 + value * (KNOB_CONFIG.ARC_ANGLE - 0.5)

  g.lineStyle({
    width: KNOB_CONFIG.SIZE.BORDER,
    color: KNOB_CONFIG.COLOR.ARC_VALUE,
    cap: LINE_CAP.ROUND,
    alignment: 0,
  })
  g.arc(radius, radius, radius, 0, endAngle * DEG_TO_RAD)
  g.endFill()
}

const drawHandleOuter = (g: IGraphics, radius: number) => {
  g.lineStyle({
    width: 0.75,
    color: KNOB_CONFIG.COLOR.STROKE_OUTER,
    alignment: 1,
  })

  g.beginFill(KNOB_CONFIG.COLOR.BORDER)
  g.drawCircle(radius, radius, radius - KNOB_CONFIG.SIZE.BORDER / 2)
  g.endFill()
}

const drawHandleInner = (g: IGraphics, radius: number) => {
  g.lineStyle({
    width: 0.75,
    color: KNOB_CONFIG.COLOR.STROKE_INNER,
    alignment: 1,
  })
  g.beginFill(KNOB_CONFIG.COLOR.BG)
  g.drawCircle(radius, radius, radius - KNOB_CONFIG.SIZE.BORDER)
  g.endFill()
}

interface KnobGraphicsProps {
  radius: number
  value: number
}

export const KnobGraphics: FC<KnobGraphicsProps> = ({ radius, value }) => {
  const drawBg = useCallback(
    (g: IGraphics) => {
      g.clear()

      // TODO: Add arc mask
      drawArcBg(g, radius)
      drawArcValue(g, radius, value)

      drawHandleOuter(g, radius)
      drawHandleInner(g, radius)
    },
    [value, radius]
  )

  const drawPoint = useCallback(
    (g: IGraphics) => {
      g.clear()
      g.beginFill(KNOB_CONFIG.COLOR.STROKE_INNER)
      g.drawCircle(radius, 16, 1.5)
      g.endFill()
    },
    [radius]
  )

  return (
    <Container>
      {/* TODO: Draw dynamic elements separately */}
      <Graphics
        draw={drawBg}
        x={radius}
        y={radius}
        pivot={radius}
        // TODO: Fix angle based on KNOB_CONFIG.ARC_ANGLE
        angle={KNOB_CONFIG.ARC_ANGLE / 2}
      />
      <Container
        pivot={radius}
        x={radius}
        y={radius}
        angle={-KNOB_CONFIG.ARC_ANGLE / 2 + value * KNOB_CONFIG.ARC_ANGLE}
      >
        <Graphics draw={drawPoint} />
      </Container>
    </Container>
  )
}
