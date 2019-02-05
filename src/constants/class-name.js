const id = chrome.runtime.id

export default {
  injected: `${id}-injected`,
  focused: `${id}-focused`,
  controls: `${id}-controls`,
  smallControls: `${id}-small-controls`
}
