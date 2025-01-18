import { FC, PropsWithChildren } from 'react'
import { Stage as PixiStage } from '@pixi/react'
import { Graphics as IGraphics } from 'pixi.js'
import { PixiStageOptions } from '../types/global'

const stageOptions: PixiStageOptions = {
  background: 'hsl(0,0%,95%)',
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  autoDensity: true,
  powerPreference: 'high-performance',
  //   clearBeforeRender: false,
}

IGraphics.curves.adaptive = false

type StageProps = PropsWithChildren

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
