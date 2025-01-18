import { FC } from 'react'
import { Container } from '@pixi/react'
import { Size } from '../../types/global'
import { Slider } from './slider'

interface ControlsProps {
  size: Size
}

export const Controls: FC<ControlsProps> = ({ size }) => {
  return (
    <Container>
      <Slider
        id='clipThresholdSlider'
        parentSize={size}
      />
      <Slider
        id='saturationThresholdSlider'
        parentSize={size}
      />
    </Container>
  )
}
