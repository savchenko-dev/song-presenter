const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendText: (text) => ipcRenderer.send("text-entered", text),
  onReceiveText: (callback) =>
    ipcRenderer.on("display-text", (event, text) => callback(text)),
  sendColors: (colors) => ipcRenderer.send("send-colors", colors),
  onReceiveColors: (callback) =>
    ipcRenderer.on("update-colors", (event, colors) => callback(colors)),
  sendImage: (imageData) => ipcRenderer.send("send-image", imageData),
  onReceiveImage: (callback) =>
    ipcRenderer.on("update-image", (event, imageData) => callback(imageData)),
});
