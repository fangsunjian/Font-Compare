const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

let mainWindow;

function getSystemFonts() {
  return new Promise((resolve) => {
    const platform = os.platform();
    if (platform === 'win32') {
      const cmd = `powershell -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Add-Type -AssemblyName System.Drawing; [System.Drawing.Text.InstalledFontCollection]::new().Families.Name"`;
      exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing PowerShell font fetch:", error);
          resolve([
            'Arial', 'Calibri', 'Consolas', 'Courier New', 'Georgia', 
            'Microsoft YaHei', 'Segoe UI', 'SimSun', 'Times New Roman', 'Verdana'
          ]);
          return;
        }
        const fonts = stdout
          .split(/\r?\n/)
          .map(f => f.trim())
          .filter(f => f.length > 0);
        resolve([...new Set(fonts)].sort());
      });
    } else if (platform === 'darwin') {
      const cmd = `system_profiler SPFontsDataType | grep "Family:" | cut -d: -f2`;
      exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          exec('fc-list : family', (err, stdout2) => {
            if (err) {
              resolve(['Arial', 'Helvetica', 'Times New Roman', 'Courier New']);
            } else {
              const fonts = stdout2.split('\n').map(line => line.split(',')[0].trim()).filter(Boolean);
              resolve([...new Set(fonts)].sort());
            }
          });
          return;
        }
        const fonts = stdout
          .split(/\r?\n/)
          .map(f => f.trim())
          .filter(f => f.length > 0);
        resolve([...new Set(fonts)].sort());
      });
    } else {
      exec('fc-list : family', (error, stdout, stderr) => {
        if (error) {
          resolve(['Arial', 'sans-serif', 'serif', 'monospace']);
          return;
        }
        const fonts = stdout
          .split(/\r?\n/)
          .map(line => {
            const parts = line.split(':');
            return parts[1] ? parts[1].split(',')[0].trim() : '';
          })
          .filter(f => f.length > 0);
        resolve([...new Set(fonts)].sort());
      });
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'Font Compare - 字体对比工具 v1.3.0',
    backgroundColor: '#121214'
  });

  mainWindow.loadFile('index.html');

  // Create native menu
  const menuTemplate = [
    {
      label: '文件',
      submenu: [
        { label: '退出', role: 'quit' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', role: 'undo' },
        { label: '重做', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', role: 'cut' },
        { label: '复制', role: 'copy' },
        { label: '粘贴', role: 'paste' },
        { label: '全选', role: 'selectall' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '重新加载', role: 'reload' },
        { label: '强制重新加载', role: 'forcereload' },
        { label: '开发者工具', role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: '放大',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            const nextZoom = Math.min(currentZoom + 0.5, 5);
            mainWindow.webContents.setZoomLevel(nextZoom);
            mainWindow.webContents.send('zoom-changed', nextZoom);
          }
        },
        {
          label: '缩小',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            const nextZoom = Math.max(currentZoom - 0.5, -3);
            mainWindow.webContents.setZoomLevel(nextZoom);
            mainWindow.webContents.send('zoom-changed', nextZoom);
          }
        },
        {
          label: '重置缩放',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomLevel(0);
            mainWindow.webContents.send('zoom-changed', 0);
          }
        },
        { type: 'separator' },
        { label: '进入全屏', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Language / 语言',
      id: 'language-menu',
      submenu: [
        {
          label: '简体中文',
          type: 'radio',
          id: 'lang-zh-CN',
          click: () => mainWindow.webContents.send('change-language', 'zh-CN')
        },
        {
          label: 'English',
          type: 'radio',
          id: 'lang-en',
          click: () => mainWindow.webContents.send('change-language', 'en')
        },
        {
          label: '日本語',
          type: 'radio',
          id: 'lang-ja',
          click: () => mainWindow.webContents.send('change-language', 'ja')
        },
        {
          label: '한국어',
          type: 'radio',
          id: 'lang-ko',
          click: () => mainWindow.webContents.send('change-language', 'ko')
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于 Font Compare',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 Font Compare',
              message: 'Font Compare v1.3.0\n\n专业字体对比与渲染测试工具。\n由 Antigravity 开发。',
              buttons: ['确定']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  
  // Listen for language sync from renderer
  ipcMain.on('sync-menu-language', (event, langCode) => {
    const item = menu.getMenuItemById(`lang-${langCode}`);
    if (item) {
      item.checked = true;
    }
  });
}

app.whenReady().then(() => {
  // Try to enable local fonts API permission if chromium uses it
  const { session } = require('electron');
  if (session.defaultSession) {
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      if (permission === 'local-fonts') {
        return callback(true);
      }
      callback(false);
    });
  }

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('get-system-fonts', async () => {
  return await getSystemFonts();
});

ipcMain.handle('get-system-locale', () => {
  return app.getLocale();
});

ipcMain.handle('set-zoom-level', (event, zoomLevel) => {
  if (mainWindow) {
    mainWindow.webContents.setZoomLevel(zoomLevel);
    return mainWindow.webContents.getZoomLevel();
  }
  return 0;
});

ipcMain.handle('get-zoom-level', () => {
  if (mainWindow) {
    return mainWindow.webContents.getZoomLevel();
  }
  return 0;
});

ipcMain.handle('get-all-rendered-fonts', async (event, selectors) => {
  if (!mainWindow) return {};
  try {
    const dbg = mainWindow.webContents.debugger;
    if (!dbg.isAttached()) {
      dbg.attach('1.3');
      await dbg.sendCommand('DOM.enable');
      await dbg.sendCommand('CSS.enable');
    }
    
    // Retrieve the document once to avoid DOM cache invalidations
    const { root } = await dbg.sendCommand('DOM.getDocument', { depth: -1 });
    
    const results = {};
    for (const selector of selectors) {
      try {
        const { nodeId } = await dbg.sendCommand('DOM.querySelector', {
          nodeId: root.nodeId,
          selector: selector
        });
        
        if (nodeId) {
          const { fonts } = await dbg.sendCommand('CSS.getPlatformFontsForNode', {
            nodeId: nodeId
          });
          results[selector] = fonts || [];
        } else {
          results[selector] = [];
        }
      } catch (nodeErr) {
        console.warn(`Error querying node for ${selector}:`, nodeErr.message);
        results[selector] = [];
      }
    }
    return results;
  } catch (err) {
    console.warn(`Debugger API not available (possibly DevTools is open):`, err.message);
    return null;
  }
});
