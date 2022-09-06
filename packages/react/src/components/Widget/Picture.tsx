import { getWidgetStyle } from './util'
const Picture = ({ propValue, styles }) => {
  const newStyles = getWidgetStyle(styles)
  return (
    <div className="image-wrapper" style={newStyles}>
      <img
        style={{ ...newStyles, width: '100%', height: '100%' }}
        src={propValue}
        alt=""
      />
    </div>
  )
}

export default Picture
