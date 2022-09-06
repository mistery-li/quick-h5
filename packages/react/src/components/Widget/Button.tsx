import { getWidgetStyle } from "./util";
const Button = (props) => {
  const { propValue, styles } = props;

  const newStyles = getWidgetStyle(styles);
  return (
    <button
      style={newStyles}
      className="group bg-white color-black border border-gray-200 rounded select-none overflow-hidden space-y-1  hover:shadow-lg hover:border-blue-400 hover:text-blue-400"
    >
      {propValue}
    </button>
  );
};

export default Button;
