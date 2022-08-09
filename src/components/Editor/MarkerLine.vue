<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'

  import { getMaxDistance, unique, checkArrayWithPush } from '../../utils/utils'
  import { useComponentStore } from '../../store/component'
  import type { Entries } from '../../types'

  interface IPos {
    x: number
    y: number
  }

  interface IComponentPosData {
    i: number
    x: number
    y: number
    w: number
    h: number
    l: number
    r: number
    t: number
    b: number
    lr: number
    tb: number
  }

  interface ILine {
    i: number
    length: number
    value: number
    origin: number
  }

  const props = defineProps<{
    isStart: boolean
    isMove: boolean
    pos: IPos
  }>()

  const componentStore = useComponentStore()

  const markerlines = reactive({
    indices: [] as number[],
    vLines: [] as ILine[],
    hLines: [] as ILine[],
  })

  const defaultMarkerLineData = reactive({
    threshold: 5,
  })

  watch(
    () => props.isStart,
    (val) => {
      if (val) {
        getComponentsCalcMarkerlineStyles()
      }
    }
  )

  watch(
    () => props.pos,
    (val) => {
      calcMarkerline(val)
    }
  )

  watch(
    () => props.isMove,
    (val) => {
      console.log(val, 'val')
      if (!val) {
        markerlines.indices = []
        markerlines.hLines = []
        markerlines.vLines = []
      }
    }
  )

  const componentListStyle = ref<IComponentPosData[]>([])
  const getComponentsCalcMarkerlineStyles = () => {
    // 获取组件样式计算标记线
    componentListStyle.value = componentStore.components.map((comp, i) => {
      const x = comp.x
      const y = comp.y
      const w = Number(comp.style.width)
      const h = Number(comp.style.height)
      return {
        i,
        x,
        y,
        w,
        h,
        l: x,
        r: x + w,
        t: y,
        b: y + h,
        lr: x + w / 2,
        tb: y + h / 2,
      }
    })
  }

  const calcLineValues = (
    values: IPos,
    target: IComponentPosData,
    compare: IComponentPosData,
    key: string
  ) => {
    const { x, y } = values
    const { h: H, w: W } = target
    const { l, r, t, b } = compare
    const T = y,
      B = y + H,
      L = x,
      R = x + W

    const direValues: { [index: string]: number[] } = {
      x: [t, b, T, B],
      y: [l, r, L, R],
    }
    const length = getMaxDistance(direValues[key])
    const origin = Math.min(...direValues[key])
    return { length, origin }
  }

  const calcPosValuesSingle = (
    values: IPos,
    dire: string,
    target: IComponentPosData,
    compare: IComponentPosData,
    key: 'x' | 'y'
  ) => {
    const { x, y } = values
    const W = target.w
    const H = target.h
    const { l, r, t, b, lr, tb, x: xCompare } = compare
    const { origin, length } = calcLineValues({ x, y }, target, compare, key)

    const result = {
      // 距离是否达到吸附阈值
      // Whether the distance reaches the adsorption threshold
      near: false,
      // 距离差
      // Distance difference
      dist: Number.MAX_SAFE_INTEGER,
      // 辅助线坐标
      // Auxiliary line coordinates
      value: 0,
      // 辅助线长度
      length,
      // 辅助线起始坐标（对应绝对定位的top/left）
      // Starting coordinates of auxiliary line (corresponding to top/left of absolute positioning)
      origin,
    }

    switch (dire) {
      case 'lr': {
        const sides = []
        sides.push({ dist: x - r, value: r }) // right side
        sides.push({ dist: x + W - xCompare, value: l }) // left side
        sides.forEach((side) => {
          if (Math.abs(side.dist) < Math.abs(result.dist)) {
            result.dist = side.dist
            result.value = side.value
          }
        })
        break
      }
      case 'll':
        result.dist = x - l
        result.value = l
        break
      case 'rr':
        result.dist = x + W - r
        result.value = r
        break
      case 'tt':
        result.dist = y - t
        result.value = t
        break
      case 'bb':
        result.dist = y + H - b
        result.value = b
        break
      case 'tb': {
        const sides = []
        sides.push({ dist: y + H - t, value: t }) // top side
        sides.push({ dist: y - b, value: b }) // bottom side
        sides.forEach((side) => {
          if (Math.abs(side.dist) < Math.abs(result.dist)) {
            result.dist = side.dist
            result.value = side.value
          }
        })
        break
      }
      case 'mv': // middle vertical
        result.dist = y + H / 2 - tb
        result.value = tb
        break
      case 'mh': // middle horizontal
        result.dist = x + W / 2 - lr
        result.value = lr
        break
    }

    if (Math.abs(result.dist) < defaultMarkerLineData.threshold + 1) {
      result.near = true
    }

    return result
  }

  const calcPosValues = (
    values: IPos,
    target: IComponentPosData,
    compares: IComponentPosData[],
    key: 'x' | 'y'
  ) => {
    const results = {} as { [index: number]: Array<ILine> }

    const directions: { [index: string]: string[] } = {
      x: ['ll', 'rr', 'lr', 'rl', 'mh'],
      y: ['tt', 'bb', 'tb', 'mv'],
    }

    // filter unnecessary directions
    const validDirections = directions[key].filter((dire) =>
      ['tt', 'bb', 'll', 'rr', 'tb', 'lr', 'rl', 'mv', 'mh'].includes(dire)
    )

    compares.forEach((compare) => {
      validDirections.forEach((dire) => {
        const { near, dist, value, origin, length } = calcPosValuesSingle(
          values,
          dire,
          target,
          compare,
          key
        )
        if (near) {
          checkArrayWithPush(results, dist, {
            i: compare.i,
            // $: compare.$,
            value,
            origin,
            length,
          })
        }
      })
    })

    const resultArray = Object.entries(results) as unknown as Entries<{
      [index: number]: Array<ILine>
    }>
    if (resultArray.length) {
      const [minDistance, activeCompares] = resultArray.sort(
        ([dist1], [dist2]) => Math.abs(dist1) - Math.abs(dist2)
      )[0]
      const dist = parseInt(String(minDistance))
      return {
        v: values[key] - dist,
        dist: dist,
        lines: activeCompares,
        indices: activeCompares.map(({ i }) => i),
      }
    }

    return {
      v: values[key],
      dist: 0,
      lines: [],
      indices: [],
    }
  }

  const calcAndDrawLines = (
    values: IPos,
    target: IComponentPosData,
    compares: IComponentPosData[]
  ) => {
    const {
      v: x,
      indices: indices_x,
      lines: vLines,
    } = calcPosValues(values, target, compares, 'x')
    const {
      v: y,
      indices: indices_y,
      lines: hLines,
    } = calcPosValues(values, target, compares, 'y')

    const indices = unique(indices_x.concat(indices_y))
    if (markerlines.vLines.length && markerlines.hLines.length) {
      markerlines.vLines.forEach((line) => {
        const compare = compares.find(({ i }) => i === line.i)!
        const { length, origin } = calcLineValues(
          { x, y },
          target,
          compare,
          'x'
        )

        line.length = length
        line.origin = origin
      })

      markerlines.hLines.forEach((line) => {
        const compare = compares.find(({ i }) => i === line.i)!
        const { length, origin } = calcLineValues(
          { x, y },
          target,
          compare,
          'y'
        )

        line.length = length
        line.origin = origin
      })
    }
    markerlines.hLines = hLines
    markerlines.vLines = vLines
    markerlines.indices = indices

    return { x, y }
  }

  const calcMarkerline = ({ x, y }) => {
    const index = componentStore.components.findIndex(
      (comp) => comp.uuid === componentStore.curComponent?.uuid
    )

    const target = componentListStyle.value[index]
    const compares = componentListStyle.value.filter((_, i) => i !== index)
    return calcAndDrawLines({ x, y }, target, compares)
  }
</script>

<template>
  <span
    v-for="line in markerlines.vLines"
    :key="line.i"
    class="v-line line"
    :style="{
      left: line.value + 'px',
      top: line.origin + 'px',
      height: line.length + 'px',
      width: '1px',
    }"
  ></span>
  <span
    v-for="line in markerlines.hLines"
    :key="line.i"
    class="h-line line"
    :style="{
      top: line.value + 'px',
      left: line.origin + 'px',
      width: line.length + 'px',
      height: '1px',
    }"
  ></span>
</template>

<style lang="scss" scoped>
  .line {
    position: absolute;
    background-color: rgb(118, 200, 233);
  }
</style>
