const Title = ({
  propValue,
  isEdit,
}: {
  propValue?: string
  isEdit: boolean
}) => {
  return <div>{propValue && isEdit ? propValue : '标题'}</div>
}

export default Title
