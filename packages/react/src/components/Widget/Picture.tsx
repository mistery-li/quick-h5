import { getWidgetStyle } from './util'
const Picture = ({ propValue, styles, openEvent, eventData }) => {
  const newStyles = getWidgetStyle(styles)
  const handleClick = () => {
    if (openEvent) {
      if (eventData.type === 'outerChain') {
        console.log('click')
        window.location.href = eventData.link
      }
    }
  }
  return (
    <div className="image-wrapper" style={newStyles} onClick={handleClick}>
      <img
        style={{ ...newStyles, width: '100%', height: '100%' }}
        src={propValue}
        alt=""
      />
    </div>
  )
}

export default Picture
