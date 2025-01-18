import { useCallback, useState } from 'react'

type UseDragConfig = {
  onDragStart?: () => void
  onDrag?: (e: PointerEvent) => void
  onDragEnd?: () => void
}

export const useDrag = (config: UseDragConfig = {}) => {
  const { onDrag, onDragStart, onDragEnd } = config
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback(
    (e: PointerEvent) => {
      if (!onDrag) return
      onDrag(e)
    },
    [onDrag]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)

    window.removeEventListener('pointermove', handleDrag)
    window.removeEventListener('pointerup', handleDragEnd)

    if (onDragEnd) onDragEnd()
  }, [handleDrag, onDragEnd])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)

    window.addEventListener('pointermove', handleDrag)
    window.addEventListener('pointerup', handleDragEnd)

    if (onDragStart) onDragStart()
  }, [handleDrag, handleDragEnd, onDragStart])

  return {
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
  }
}
