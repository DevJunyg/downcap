const {
  contextBridge,
  ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "ipcRenderer", {
  send: ipcRenderer.send,
  sendSync: ipcRenderer.sendSync,
  invoke: ipcRenderer.invoke,
  on: (channel, func) => ipcRenderer.on(channel, func),
  once: (channel, func) => ipcRenderer.once(channel, func),
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

