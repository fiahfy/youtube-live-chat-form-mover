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

  const top = document.querySelector('#action-panel #container #top')
  const buttons = document.querySelector(
    '#action-panel #container #buttons.yt-live-chat-message-input-renderer'
  )
  if (!top || !buttons) {
    return
  }

  const input = top.querySelector('div#input')
  const messageButtons = buttons.querySelector('#message-buttons')
  if (!input || !messageButtons) {
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

  // add description
  const description = document.createElement('button')
  description.textContent = 'Chat Form is Moved to Bottom Controls'
  description.style.textAlign = 'center'
  description.style.fontSize = 'smaller'
  description.style.flex = 1
  description.style.color = 'var(--yt-spec-text-secondary)'
  description.style.webkitAppearance = 'none'
  description.style.background = 'none'
  description.style.border = 'none'
  description.style.outline = 'none'
  description.style.cursor = 'pointer'
  description.addEventListener('click', () => {
    input.focus()
  })
  const wrapper = document.createElement('div')
  wrapper.style.flex = 1
  wrapper.style.display = 'flex'
  wrapper.style.alignItems = 'center'
  wrapper.append(description)
  buttons.append(wrapper)

  // add controls
  const controls = document.createElement('div')
  controls.classList.add(className.controls)
  controls.style.opacity = 0
  controls.style.transition = 'opacity 1s'
  controls.style.left = `${leftControls.offsetWidth}px`
  controls.style.right = `${rightControls.offsetWidth}px`
  controls.append(top)
  controls.append(messageButtons)
  rightControls.parentNode.insertBefore(controls, rightControls)

  // setup resize observers
  const leftControlsObserver = new ResizeObserver((entries) => {
    const [entry] = entries
    controls.style.left = `${entry.contentRect.width}px`
  })
  leftControlsObserver.observe(leftControls)
  const rightControlsObserver = new ResizeObserver((entries) => {
    const [entry] = entries
    controls.style.right = `${entry.contentRect.width}px`
  })
  rightControlsObserver.observe(rightControls)

  // fade in...
  setTimeout(() => {
    controls.style.opacity = 1
  }, 0)
}

const removeControl = () => {
  const button = parent.document.querySelector(`.${className.controls}`)
  button && button.remove()
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id } = message
  switch (id) {
    case 'cssInjected':
      parent.document.body.classList.add(className.injected)
      break
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const injected = parent.document.body.classList.contains(className.injected)
  chrome.runtime.sendMessage({ id: 'contentLoaded', data: { injected } })

  addControl()

  window.addEventListener('unload', () => {
    removeControl()
  })
})

logger.log('content script loaded')
