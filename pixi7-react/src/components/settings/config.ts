import { Color } from 'pixi.js'
import { KNOB_CONFIG } from '../knob/config'

export const KNOB_IDS = [
  'saturationThresholdSlider',
  'clipThresholdSlider',
  'inGainSlider',
  'outGainSlider',
  'mixSlider',
] as const

export const SETTINGS_CONFIG = {
  // HEIGHT: 112,
  BORDER_RADIUS: 8,
  MARGIN_BOTTOM: 16,
  PADDING: 16,
  GAP: 12,
  BORDER_WIDTH: 0.5,
  COLOR: {
    BACKGROUND: new Color('hsl(0, 0%, 95%)'),
    BORDER: new Color('hsl(0, 0%, 70%)'),
  },
  KNOB_RADIUS: 32,
  getWidth: () => {
    return (
      KNOB_IDS.length * SETTINGS_CONFIG.KNOB_RADIUS * 2 +
      SETTINGS_CONFIG.PADDING * 2 +
      (KNOB_IDS.length - 1) * SETTINGS_CONFIG.GAP
    )
  },
  getHeight: () => {
    return (
      KNOB_CONFIG.getHeight(SETTINGS_CONFIG.KNOB_RADIUS) +
      SETTINGS_CONFIG.PADDING
    )
  },
} as const
