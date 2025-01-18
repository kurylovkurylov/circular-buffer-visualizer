import { Size } from '../types/global'
import { Stage } from './stage'
import { Dynamics } from './dynamics'
import { Settings } from './settings'

const size: Size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

export const App = () => {
  return (
    <div>
      <Stage>
        <Dynamics size={size} />
        <Settings parentSize={size} />
      </Stage>
    </div>
  )
}
