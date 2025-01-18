import { FC } from 'react'
import { Container } from '@pixi/react'
import { Grid } from './grid'
import { Plot } from './plot'
import { Size } from '../../types/global'
import { Labels } from './labels'

const MIN_DB_FROM_BACKEND = -100

const numSteps = 10
const maxDb = 12
const stepDb = 6
const minDb = maxDb - stepDb * numSteps
const dbRange = maxDb - minDb
const plotScale = MIN_DB_FROM_BACKEND / dbRange / MIN_DB_FROM_BACKEND

interface VisualiserProps {
  size: Size
}

export const Visualiser: FC<VisualiserProps> = ({ size }) => {
  const zeroDbY = (size.height / numSteps) * (maxDb / stepDb)

  return (
    <Container>
      <Grid
        size={size}
        numSteps={numSteps}
        maxDb={maxDb}
        stepDb={stepDb}
      />
      <Plot
        size={size}
        zeroDbY={zeroDbY}
        plotScale={plotScale}
      />
      <Labels
        size={size}
        numSteps={numSteps}
        maxDb={maxDb}
        stepDb={stepDb}
      />
    </Container>
  )
}
