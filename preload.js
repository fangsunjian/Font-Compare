const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemLocale: () => ipcRenderer.invoke('get-system-locale'),
  getSystemFonts: () => ipcRenderer.invoke('get-system-fonts'),
  setZoomLevel: (level) => ipcRenderer.invoke('set-zoom-level', level),
  getZoomLevel: () => ipcRenderer.invoke('get-zoom-level'),
  getAllRenderedFonts: (selectors) => ipcRenderer.invoke('get-all-rendered-fonts', selectors),
  onZoomChanged: (callback) => {
    const listener = (event, level) => callback(level);
    ipcRenderer.on('zoom-changed', listener);
    return () => {
      ipcRenderer.removeListener('zoom-changed', listener);
    };
  },
  syncMenuLanguage: (langCode) => ipcRenderer.send('sync-menu-language', langCode),
  onLanguageChanged: (callback) => {
    const listener = (event, lang) => callback(lang);
    ipcRenderer.on('change-language', listener);
    return () => {
      ipcRenderer.removeListener('change-language', listener);
    };
  }
});
