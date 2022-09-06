export default async function runAnimation($el, animations = []) {
  const play = (animation) => new Promise((resolve: Function) => {
      const { animationTime, value = '', isLoop } = animation
      console.log($el.style, 'el');
      $el.style.setProperty('--time', animationTime + 's')
      console.log(value, 'value')
      $el.classList.add(value, 'animated', utilsHandle(isLoop))
      const removeAnimation = () => {
          $el.removeEventListener('animationend', removeAnimation)
          $el.removeEventListener('animationcancel', removeAnimation)
          $el.classList.remove(value, 'animated', utilsHandle(isLoop))
          $el.style.removeProperty('--time')
          resolve()
      }
          
      $el.addEventListener('animationend', removeAnimation)
      $el.addEventListener('animationcancel', removeAnimation)
  })

  console.log(animations, 'animations');
  for (let i = 0, len = animations.length; i < len; i++) {
      await play(animations[i])
  }
}

function utilsHandle(isLoop) {
  return isLoop ? 'infinite' : 'no-infinite'
}
