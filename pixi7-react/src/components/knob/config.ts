export const KNOB_CONFIG = {
  ARC_ANGLE: 270,
  SIZE: {
    BORDER: 10,
    GAP: 0,
    LABEL_FONT: 11,
  },
  COLOR: {
    BORDER: 'hsl(0, 0%, 75%)',
    BG: 'hsl(0, 0%, 85%)',
    LABEL: 'hsl(0, 0%, 40%)',
    ARC_BG: 'hsl(0, 0%, 85%)',
    // ARC_BG: 'hsl(210, 65%, 85%)',
    ARC_VALUE: 'hsl(0, 0%, 65%)',
    // ARC_VALUE: 'hsl(210, 65%, 65%)',
    STROKE_OUTER: 'hsl(0, 0%, 95%)',
    STROKE_INNER: 'hsl(0, 0%, 65%)',
  },
  getHeight(radius: number) {
    return (
      radius * 2 +
      KNOB_CONFIG.SIZE.BORDER * 2 +
      KNOB_CONFIG.SIZE.GAP +
      KNOB_CONFIG.SIZE.LABEL_FONT
    )
  },
} as const
