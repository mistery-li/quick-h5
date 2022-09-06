import {getWidgetStyle} from './util'
const Input = (props) => {
  const { isEdit, propValue, styles } = props;

  const newStyles = getWidgetStyle(styles);
  return (
    <>
      {isEdit ? (
        <input
          style={newStyles}
          className="px-4 py-3 leading-5 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
          type="text"
          defaultValue={propValue}
        />
      ) : (
        <span>{propValue}</span>
      )}
    </>
  );
};

export default Input;
