import { ComponentProps, FC, useEffect } from 'react'
import { Container, Text } from '@pixi/react'
import { animated, useSpring } from '@react-spring/web'
import { KNOB_CONFIG } from './config'

const AnimatedText = animated(Text)
type AnimatedTextStyle = ComponentProps<typeof AnimatedText>['style']

const animatedTextStyle: AnimatedTextStyle = {
  fontSize: KNOB_CONFIG.SIZE.LABEL_FONT,
  fill: KNOB_CONFIG.COLOR.LABEL,
  textAlign: 'center',
  // textBaseline: 'middle',
  padding: 8,
}

interface LabelProps {
  name: string
  scaledValue: number
  label?: string
  radius: number
  isUsed: boolean
}

export const Label: FC<LabelProps> = ({
  name,
  scaledValue,
  label,
  radius,
  isUsed,
}) => {
  const topTextY = radius * 2 + KNOB_CONFIG.SIZE.GAP
  const displayedValue = `${scaledValue.toFixed(1)}${label}`

  const [springs, setSprings] = useSpring(() => ({
    topTextY,
    topTextAlpha: 1,
    bottomTextY: topTextY + 16,
    bottomTextAlpha: 0,
  }))

  useEffect(() => {
    setSprings({
      topTextY: isUsed ? topTextY - 16 : topTextY,
      topTextAlpha: isUsed ? 0 : 1,
      bottomTextY: isUsed ? topTextY : topTextY + 16,
      bottomTextAlpha: isUsed ? 1 : 0,
    })
  }, [isUsed, setSprings, radius, topTextY])

  return (
    <Container>
      <AnimatedText
        x={radius}
        y={springs.topTextY}
        text={name}
        style={animatedTextStyle}
        anchor={[0.5, 0]}
        alpha={springs.topTextAlpha}
      />
      <AnimatedText
        x={radius}
        y={springs.bottomTextY}
        text={displayedValue}
        style={animatedTextStyle}
        anchor={[0.5, 0]}
        alpha={springs.bottomTextAlpha}
      />
    </Container>
  )
}
