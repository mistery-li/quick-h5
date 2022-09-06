import { CSSProperties, useState } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { useDispatch } from 'react-redux'
import { setCurCompStyle, updateComps } from '../../store/components'

const PickColor = ({
  styleKey,
  colorValue,
}: {
  styleKey: string | keyof CSSProperties
  colorValue: string
}) => {
  console.log(styleKey, 'styleKey')
  const [showColor, setShowColor] = useState(false)
  const dispatch = useDispatch()

  const handleClick = () => {
    setShowColor((pre) => !pre)
  }

  const handleClose = () => {
    setShowColor(false)
  }

  const handleChange = (color) => {
    // setColor(color.rgb)
    console.log(color, 'color')
    let style = {}
    style[styleKey] = color.hex
    console.log(style, 'stylesss')
    dispatch(setCurCompStyle(style))
    dispatch(updateComps())
  }

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `${colorValue}`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  })

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {showColor ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker color={colorValue} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  )
}

export default PickColor
