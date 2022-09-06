export const getComponentStyles = (oldStyles) => {
  if (!oldStyles) return;
  const newStyles = {...oldStyles};

  // 增加底部、右边距离作为对齐线计算
  newStyles.bottom = newStyles.top + newStyles.height;
  newStyles.right = newStyles.left = newStyles.width;
  newStyles.linePos = {
    l: newStyles.left,   // 左对齐线
    r: newStyles.left + newStyles.width,   // 右对齐线
    t: newStyles.top,   // 顶部对齐线
    b: newStyles.top + newStyles.height,   // 底部对齐线
    lr: newStyles.left + (newStyles.width / 2),  // 纵向居中线
    tb: newStyles.height + (newStyles.height / 2)   // 横向居中线
  }
  return newStyles;
}

export const getComponentLineData = (styles) => {
  if (!styles) return {}
  return {
    w: styles.width,
    h: styles.height,
    x: styles.left,
    y: styles.top,
    l: styles.left,   // 左对齐线
    lr: styles.left + (styles.width / 2),  // 纵向居中线
    r: styles.left + styles.width,   // 右对齐线
    t: styles.top,   // 顶部对齐线
    tb: styles.top + (styles.height / 2),   // 横向居中线
    b: styles.top + styles.height,   // 底部对齐线
  }
}