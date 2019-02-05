import logger from './utils/logger'
import className from './constants/class-name'

const addControl = () => {
  const leftControls = parent.document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  const rightControls = parent.document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-right-controls'
  )
  if (!leftControls || !rightControls) {
    return
  }

  const top = document.querySelector('div#top')
  const buttons = document.querySelector('div#message-buttons')
  if (!top || !buttons) {
    return
  }

  const input = top.querySelector('div#input')
  if (!input) {
    return
  }
  input.addEventListener('keydown', (e) => {
    e.stopPropagation()
    if (e.keyCode === 27) {
      e.target.blur()
    }
  })
  input.addEventListener('focus', () => {
    parent.document.body.classList.add(className.focused)
  })
  input.addEventListener('blur', () => {
    parent.document.body.classList.remove(className.focused)
  })

  // TODO: put description "Chat Form is Moved to Bottom Controls"

  const controls = document.createElement('div')
  controls.classList.add(className.controls)
  controls.style.opacity = 0
  controls.style.transition = 'opacity 1s'
  // TODO: adjust size if controls size changed
  controls.style.left = `${leftControls.offsetWidth}px`
  controls.style.right = `${rightControls.offsetWidth}px`
  controls.append(top)
  controls.append(buttons)

  rightControls.parentNode.insertBefore(controls, rightControls)

  // fade in...
  setTimeout(() => {
    controls.style.opacity = 1
  }, 0)
}

const removeControl = () => {
  const button = parent.document.querySelector(`.${className.controls}`)
  button && button.remove()
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ id: 'contentLoaded' })

  addControl()

  window.addEventListener('unload', () => {
    removeControl()
  })
})

logger.log('content script loaded')
