import { FC } from 'react'
import { Stage as PixiStage } from '@pixi/react'
import type { StageOptions } from './types/global'

const stageOptions: StageOptions = {
  background: '#ddd',
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  autoDensity: true,
  powerPreference: 'high-performance',
}

type StageProps = React.PropsWithChildren

export const Stage: FC<StageProps> = ({ children }) => {
  return (
    <PixiStage
      width={window.innerWidth}
      height={window.innerHeight}
      options={stageOptions}
    >
      {children}
    </PixiStage>
  )
}
