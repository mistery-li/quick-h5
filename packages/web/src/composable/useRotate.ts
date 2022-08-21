import { cloneDeep } from 'lodash'
import { Ref, ref, toRef } from 'vue'
import { useStore } from '../store'

import { mod360 } from '../utils/styles'

export const useRotate = () => {
  const rotate = ref(0)
  const store = useStore()
  const moveDone = ref(false)
  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    moveDone.value = false
    const editorRect = document
      .getElementById('editor')
      ?.getBoundingClientRect()!
    const startData = cloneDeep(store.curComp!)

    const { rotate: startRotate, left, top, width, height } = startData?.style

    const { clientX, clientY } = event
    const centerPos = {
      x: editorRect.left + Number(left) + Number(width) / 2 - 15,
      y: editorRect.top + Number(top) + Number(height) / 2 + 10,
    }

    const rotateBefore =
      Math.atan2(centerPos.y - clientY, clientX - centerPos.x) / (Math.PI / 180)

    const handleRotate = (moveEvent: MouseEvent) => {
      const { pageX: moveX, pageY: moveY } = moveEvent
      const curX = moveX - centerPos.x
      const curY = centerPos.y - moveY
      const rotateAfter = Math.atan2(curY, curX) / (Math.PI / 180)
      rotate.value = startRotate! + rotateBefore - rotateAfter
      store.curComp!.style.rotate = mod360(rotate.value)
    }

    const handleMouseUp = () => {
      store.addHistory({
        type: 'update',
        value: [startData, cloneDeep(store.curComp!)],
      })
      moveDone.value = true
      document.removeEventListener('mousemove', handleRotate)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleRotate)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return {
    rotate,
    onMouseDown,
    moveDone,
  }
}
