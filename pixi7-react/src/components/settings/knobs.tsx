import { FC } from 'react'
import { Container } from '@pixi/react'
import { KNOB_IDS, SETTINGS_CONFIG } from './config'
import { Knob } from '../knob'

export const Knobs: FC = () => {
  return (
    <Container
      x={SETTINGS_CONFIG.PADDING}
      y={SETTINGS_CONFIG.PADDING}
    >
      {KNOB_IDS.map((id, idx) => {
        const x =
          idx * SETTINGS_CONFIG.KNOB_RADIUS * 2 + SETTINGS_CONFIG.GAP * idx

        return (
          <Knob
            id={id}
            key={id}
            x={x}
            radius={SETTINGS_CONFIG.KNOB_RADIUS}
          />
        )
      })}
    </Container>
  )
}
