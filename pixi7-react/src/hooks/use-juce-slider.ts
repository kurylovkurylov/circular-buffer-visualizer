import { useEffect, useRef, useState } from 'react'
// @ts-expect-error no type definitions
import * as Juce from '../juce'

export const useJuceSlider = (id: string) => {
  // TODO: use ref to juce state
  const sliderState = useRef(Juce.getSliderState(id))
  const [value, setValue] = useState<number>(
    sliderState.current.getNormalisedValue()
  )

  useEffect(() => {
    const currentSliderState = sliderState.current

    const sliderListenerId = currentSliderState.valueChangedEvent.addListener(
      () => {
        setValue(currentSliderState.getNormalisedValue())
      }
    )

    return () => {
      currentSliderState.valueChangedEvent.removeListener(sliderListenerId)
    }
  }, [sliderState])

  const properties: { name: string; label: string } =
    sliderState.current.properties
  const { name, label } = properties

  //   const setNormalisedValue: (newValue: number) => void =
  //     sliderState.current.setNormalisedValue.bind(sliderState)
  const setNormalisedValue = (newValue: number) => {
    sliderState.current.setNormalisedValue(newValue)
  }

  const getNormalisedValue = () => {
    return sliderState.current.getNormalisedValue()
  }

  const getScaledValue = () => {
    return sliderState.current.getScaledValue()
  }

  return {
    name,
    label,
    value,
    setNormalisedValue,
    getNormalisedValue,
    getScaledValue,
  }
}
