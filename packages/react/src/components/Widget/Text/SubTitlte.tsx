const SubTitle = ({
  propValue,
  isEdit,
}: {
  propValue?: string
  isEdit: boolean
}) => {
  return <div>{propValue && isEdit ? propValue : '副标题'}</div>
}

export default SubTitle
