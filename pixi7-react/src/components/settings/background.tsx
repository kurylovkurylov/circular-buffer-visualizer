import { FC } from 'react'
import { Graphics } from '@pixi/react'
import { Graphics as IGraphics, LineStyle as ILineStyle } from 'pixi.js'
import { SETTINGS_CONFIG } from './config'

const borderStyle: Partial<ILineStyle> = {
  width: SETTINGS_CONFIG.BORDER_WIDTH,
  color: SETTINGS_CONFIG.COLOR.BORDER.toNumber(),
}

const drawBg = (g: IGraphics) => {
  g.clear()
  g.beginFill(SETTINGS_CONFIG.COLOR.BACKGROUND)
  g.lineStyle(borderStyle)
  g.drawRoundedRect(
    0,
    0,
    SETTINGS_CONFIG.getWidth(),
    SETTINGS_CONFIG.getHeight(),
    SETTINGS_CONFIG.BORDER_RADIUS
  )
  g.endFill()
}

export const Background: FC = () => {
  return (
    <>
      <Graphics draw={drawBg} />
    </>
  )
}
