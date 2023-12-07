const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  launchapp: (e) => ipcRenderer.invoke('launchapp', e),
})