import { FC } from 'react'
import { Container } from '@pixi/react'
import { Size } from '../../types/global'
import { Visualiser } from '../visualiser'
import { Controls } from './controls'

interface DynamicsProps {
  size: Size
}

export const Dynamics: FC<DynamicsProps> = ({ size }) => {
  return (
    <Container>
      <Visualiser size={size} />
      <Controls size={size} />
    </Container>
  )
}
