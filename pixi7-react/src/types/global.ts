import { Stage } from '@pixi/react'
import { ComponentProps } from 'react'

export type PixiStageOptions = ComponentProps<typeof Stage>['options']

export type Size = { width: number; height: number }

export type HorizontalPosition = 'left' | 'right'
export type VerticalPosition = 'top' | 'bottom'
export type Position = HorizontalPosition | VerticalPosition

export type LevelData = {
  peakHistory: Float32Array
  vuHistory: Float32Array
  grHistory: Float32Array
}
