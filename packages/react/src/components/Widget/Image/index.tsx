const Image = ({ propValue, style }) => {
  return (
    <div style={style}>
      <img src={propValue} />
    </div>
  )
}

export default Image
