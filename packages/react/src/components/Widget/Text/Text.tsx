const Text = ({
  propValue,
  isEdit,
}: {
  propValue?: string
  isEdit: boolean
}) => {
  return <div>{propValue && isEdit ? propValue : '正文内容'}</div>
}

export default Text
