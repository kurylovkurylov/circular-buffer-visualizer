import * as PIXI from 'pixi.js'
import { config } from './config'

const appOptions: Partial<PIXI.ApplicationOptions> = {
  width: config.width,
  height: config.height,
  background: config.background,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
  powerPreference: 'high-performance',
  clearBeforeRender: false,
  preserveDrawingBuffer: false,
}

export const createApp = async () => {
  const app = new PIXI.Application()
  // @ts-ignore
  globalThis.__PIXI_APP__ = app

  await app.init(appOptions)
  app.canvas.className = 'visualiser'
  document.body.appendChild(app.canvas)

  return app
}
