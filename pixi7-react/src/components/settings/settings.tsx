import { FC } from 'react'
import { Container } from '@pixi/react'
import { Size } from '../../types/global'
import { Background } from './background'
import { SETTINGS_CONFIG } from './config'
import { Knobs } from './knobs'

interface SettingsProps {
  parentSize: Size
}

export const Settings: FC<SettingsProps> = ({ parentSize }) => {
  return (
    <Container
      x={parentSize.width / 2 - SETTINGS_CONFIG.getWidth() / 2}
      y={
        parentSize.height -
        SETTINGS_CONFIG.getHeight() -
        SETTINGS_CONFIG.MARGIN_BOTTOM
      }
      anchor={0}
    >
      <Background />
      <Knobs />
    </Container>
  )
}
