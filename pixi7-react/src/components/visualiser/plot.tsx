import { FC, useCallback, useEffect, useRef } from 'react'
import { Graphics } from '@pixi/react'
import { Graphics as IGraphics, Color, LineStyle } from 'pixi.js'
import { LevelData, Size } from '../../types/global'
import { fetchLevels } from '../../utils/fetch-levels'

type PlotLineStyle = Partial<LineStyle>
type Point = { x: number; y: number }

const lineStyles: Record<string, PlotLineStyle> = {
  peak: {
    width: 1,
    color: new Color('hsl(0,0%,70%)').toNumber(),
  },
  vu: {
    width: 1.5,
    color: new Color('hsl(0,0%,45%)').toNumber(),
  },
  gr: {
    width: 1,
    color: new Color('hsl(0,0%,45%)').toNumber(),
  },
} as const

const PLOT_CONFIG = {
  FETCH_INTERVAL: 30,
  DEFAULT_Y_OFFSET: 0,
} as const

const calculatePoints = (
  data: Float32Array,
  plotSize: Size,
  plotScale: number,
  yOffset?: number
) => {
  const { width, height } = plotSize
  yOffset = yOffset || PLOT_CONFIG.DEFAULT_Y_OFFSET

  const points = [{ x: -1, y: height + 1 }]

  for (let i = 0; i < data.length; i++) {
    const level = -data[i] * plotScale
    const x = (i / data.length) * width
    const y = level * height + yOffset

    if (i === 0) {
      points.push({ x: x - 1, y })
    }

    points.push({ x, y })

    if (i === data.length - 1) {
      points.push({ x: width + 1, y })
      points.push({ x: width + 1, y: height + 1 })
    }
  }

  return points
}

const drawLevel = (g: IGraphics, points: Point[], lineStyle: PlotLineStyle) => {
  g.lineStyle(lineStyle)
  g.drawPolygon(points)
}

interface PlotProps {
  size: Size
  zeroDbY: number
  plotScale: number
}

export const Plot: FC<PlotProps> = ({ size, zeroDbY, plotScale }) => {
  const graphicsRef = useRef<IGraphics>(null)

  const draw = useCallback(
    (data: LevelData) => {
      const g = graphicsRef.current
      if (!g) return

      const peakPoints = calculatePoints(
        data.peakHistory,
        size,
        plotScale,
        zeroDbY
      )
      const vuPoints = calculatePoints(data.vuHistory, size, plotScale, zeroDbY)
      const grHistory = data.grHistory.map(x => -x)
      const grPoints = calculatePoints(grHistory, size, plotScale)

      g.clear()
      drawLevel(g, peakPoints, lineStyles.peak)
      drawLevel(g, vuPoints, lineStyles.vu)
      // TODO: Fix GR line 1px offset
      drawLevel(g, grPoints, lineStyles.gr)
    },
    [size, plotScale, zeroDbY]
  )

  useEffect(() => {
    const fetchIntervalId = setInterval(async () => {
      try {
        const data = await fetchLevels()
        draw(data)
      } catch (error) {
        console.error('Failed to fetch levels:', error)
      }
    }, PLOT_CONFIG.FETCH_INTERVAL)

    return () => clearInterval(fetchIntervalId)
  }, [draw])

  return <Graphics ref={graphicsRef} />
}
