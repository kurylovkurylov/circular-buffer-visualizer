import { Container, Graphics, Text } from '@pixi/react'
import { Color, TextStyle } from 'pixi.js'
import { HorizontalPosition, Size } from '../../types/global'
import { FC, useMemo } from 'react'

const labelPadding = 4
const labelStyle = new TextStyle({
  fontSize: 10,
  fill: 'hsl(0,0%,70%)',
})

const createLabels = (
  width: number,
  height: number,
  numSteps: number,
  from: number,
  step: number,
  position: HorizontalPosition,
  style: TextStyle
) => {
  const labels = []

  const x: Record<HorizontalPosition, number> = {
    left: labelPadding,
    right: width - labelPadding,
  }
  const xAnchor: Record<HorizontalPosition, number> = {
    left: 0,
    right: 1,
  }

  for (let i = 0; i < numSteps; i++) {
    const y = (height / numSteps) * i + labelPadding
    const labelText = `${i * step + from}`
    labels.push(
      <Text
        key={i}
        anchor={[xAnchor[position], 0]}
        text={labelText}
        style={style}
        x={x[position]}
        y={y}
      />
    )
  }
  return labels
}

interface LabelProps {
  size: Size
  numSteps: number
  maxDb: number
  stepDb: number
}

export const Labels: FC<LabelProps> = ({ size, numSteps, maxDb, stepDb }) => {
  const { width, height } = size

  const reductionLabels = useMemo(
    () => createLabels(width, height, numSteps, 0, stepDb, 'left', labelStyle),
    [width, height, numSteps, stepDb]
  )

  const gainLabels = useMemo(
    () =>
      createLabels(
        width,
        height,
        numSteps,
        maxDb,
        -stepDb,
        'right',
        labelStyle
      ),
    [width, height, numSteps, maxDb, stepDb]
  )

  return (
    <Container>
      {/* TODO: add background */}
      <Graphics
        draw={g => {
          g.beginFill(new Color('hsl(0,0%,95%)'))
          g.drawRect(0, 0, 24, height)
          g.drawRect(width - 24, 0, 24, height)
          g.endFill()
        }}
      />
      {reductionLabels}
      {gainLabels}
    </Container>
  )
}
