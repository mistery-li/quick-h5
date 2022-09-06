export const getWidgetStyle = (styles) => {
  const newStyles = Object.assign({}, styles);
  ["position", "left", "top"].forEach(cssAttr => {
    if (cssAttr in styles) {
      delete newStyles[cssAttr];
    }
  })
  return newStyles;
}