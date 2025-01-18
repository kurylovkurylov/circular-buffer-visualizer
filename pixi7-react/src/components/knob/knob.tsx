import { FC, useCallback, useEffect, useState } from 'react'
import { Container } from '@pixi/react'
import { useJuceSlider } from '../../hooks/use-juce-slider'
import { useDrag } from '../../hooks/use-drag'
import { KnobGraphics } from './graphics'
import { Label } from './label'

interface KnobProps {
  id: string
  radius: number
  x?: number
  y?: number
}

export const Knob: FC<KnobProps> = ({ id, radius, x = 0, y = 0 }) => {
  const {
    name,
    label,
    value,
    getScaledValue,
    getNormalisedValue,
    setNormalisedValue,
  } = useJuceSlider(id)

  const onDrag = useCallback(
    (e: MouseEvent) => {
      const { movementY } = e
      if (e.movementY === 0) return
      let multiplier = 1
      if (e.shiftKey) multiplier = 0.175

      const knobValue = getNormalisedValue()
      const delta = (-movementY * 0.08 * multiplier) / radius

      const newValue = Math.max(0, Math.min(1, knobValue + delta))
      setNormalisedValue(newValue)
    },
    [radius, getNormalisedValue, setNormalisedValue]
  )

  const { isDragging, handleDragStart } = useDrag({ onDrag })
  const [isHovered, setIsHovered] = useState(false)

  const scaledValue = getScaledValue()
  const cursor = isDragging ? 'grabbing' : 'grab'

  useEffect(() => {
    document.body.style.cursor = isDragging ? 'grabbing' : 'auto'
  }, [isDragging])

  return (
    <Container
      x={x}
      y={y}
      eventMode='dynamic'
      cursor={cursor}
      onpointerdown={handleDragStart}
      onpointerenter={() => setIsHovered(true)}
      onpointerleave={() => setIsHovered(false)}
    >
      <Label
        radius={radius}
        name={name}
        scaledValue={scaledValue}
        label={label}
        isUsed={isDragging || isHovered}
      />
      <KnobGraphics
        value={value}
        radius={radius}
      />
    </Container>
  )
}
