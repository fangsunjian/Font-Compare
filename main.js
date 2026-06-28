const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

let mainWindow;
let currentLanguage = 'zh-CN';
const appVersion = app.getVersion();

const menuI18n = {
  'zh-CN': {
    windowTitle: `Font Compare - 字体对比工具 v${appVersion}`,
    file: '文件',
    quit: '退出',
    edit: '编辑',
    undo: '撤销',
    redo: '重做',
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    selectAll: '全选',
    view: '视图',
    reload: '重新加载',
    forceReload: '强制重新加载',
    devTools: '开发者工具',
    zoomIn: '放大',
    zoomOut: '缩小',
    resetZoom: '重置缩放',
    fullscreen: '进入全屏',
    language: 'Language / 语言',
    help: '帮助',
    about: '关于 Font Compare',
    aboutMessage: `Font Compare v${appVersion}\n\n专业字体对比与渲染测试工具。`,
    ok: '确定'
  },
  en: {
    windowTitle: `Font Compare - Font Comparison Tool v${appVersion}`,
    file: 'File',
    quit: 'Quit',
    edit: 'Edit',
    undo: 'Undo',
    redo: 'Redo',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',
    view: 'View',
    reload: 'Reload',
    forceReload: 'Force Reload',
    devTools: 'Developer Tools',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset Zoom',
    fullscreen: 'Toggle Full Screen',
    language: 'Language',
    help: 'Help',
    about: 'About Font Compare',
    aboutMessage: `Font Compare v${appVersion}\n\nProfessional font comparison and rendering test tool.`,
    ok: 'OK'
  },
  ja: {
    windowTitle: `Font Compare - フォント比較ツール v${appVersion}`,
    file: 'ファイル',
    quit: '終了',
    edit: '編集',
    undo: '元に戻す',
    redo: 'やり直す',
    cut: '切り取り',
    copy: 'コピー',
    paste: '貼り付け',
    selectAll: 'すべて選択',
    view: '表示',
    reload: '再読み込み',
    forceReload: '強制再読み込み',
    devTools: '開発者ツール',
    zoomIn: '拡大',
    zoomOut: '縮小',
    resetZoom: 'ズームをリセット',
    fullscreen: 'フルスクリーン切替',
    language: '言語',
    help: 'ヘルプ',
    about: 'Font Compare について',
    aboutMessage: `Font Compare v${appVersion}\n\nプロフェッショナルなフォント比較とレンダリングテストツール。`,
    ok: 'OK'
  },
  ko: {
    windowTitle: `Font Compare - 폰트 비교 도구 v${appVersion}`,
    file: '파일',
    quit: '종료',
    edit: '편집',
    undo: '실행 취소',
    redo: '다시 실행',
    cut: '잘라내기',
    copy: '복사',
    paste: '붙여넣기',
    selectAll: '모두 선택',
    view: '보기',
    reload: '새로 고침',
    forceReload: '강제 새로 고침',
    devTools: '개발자 도구',
    zoomIn: '확대',
    zoomOut: '축소',
    resetZoom: '확대/축소 초기화',
    fullscreen: '전체 화면 전환',
    language: '언어',
    help: '도움말',
    about: 'Font Compare 정보',
    aboutMessage: `Font Compare v${appVersion}\n\n전문적인 폰트 비교 및 렌더링 테스트 도구.`,
    ok: '확인'
  }
};

function getMenuText(langCode) {
  return menuI18n[langCode] || menuI18n.en;
}

function setMainLanguage(langCode) {
  currentLanguage = menuI18n[langCode] ? langCode : 'en';
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setTitle(getMenuText(currentLanguage).windowTitle);
  }
  rebuildMenu();
}

function sendLanguageChange(langCode) {
  setMainLanguage(langCode);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('change-language', currentLanguage);
  }
}

function rebuildMenu() {
  const t = getMenuText(currentLanguage);
  const menuTemplate = [
    {
      label: t.file,
      submenu: [
        { label: t.quit, role: 'quit' }
      ]
    },
    {
      label: t.edit,
      submenu: [
        { label: t.undo, role: 'undo' },
        { label: t.redo, role: 'redo' },
        { type: 'separator' },
        { label: t.cut, role: 'cut' },
        { label: t.copy, role: 'copy' },
        { label: t.paste, role: 'paste' },
        { label: t.selectAll, role: 'selectall' }
      ]
    },
    {
      label: t.view,
      submenu: [
        { label: t.reload, role: 'reload' },
        { label: t.forceReload, role: 'forcereload' },
        { label: t.devTools, role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: t.zoomIn,
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            const nextZoom = Math.min(currentZoom + 0.5, 5);
            mainWindow.webContents.setZoomLevel(nextZoom);
            mainWindow.webContents.send('zoom-changed', nextZoom);
          }
        },
        {
          label: t.zoomOut,
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            const nextZoom = Math.max(currentZoom - 0.5, -3);
            mainWindow.webContents.setZoomLevel(nextZoom);
            mainWindow.webContents.send('zoom-changed', nextZoom);
          }
        },
        {
          label: t.resetZoom,
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomLevel(0);
            mainWindow.webContents.send('zoom-changed', 0);
          }
        },
        { type: 'separator' },
        { label: t.fullscreen, role: 'togglefullscreen' }
      ]
    },
    {
      label: t.language,
      id: 'language-menu',
      submenu: [
        {
          label: '简体中文',
          type: 'radio',
          id: 'lang-zh-CN',
          checked: currentLanguage === 'zh-CN',
          click: () => sendLanguageChange('zh-CN')
        },
        {
          label: 'English',
          type: 'radio',
          id: 'lang-en',
          checked: currentLanguage === 'en',
          click: () => sendLanguageChange('en')
        },
        {
          label: '日本語',
          type: 'radio',
          id: 'lang-ja',
          checked: currentLanguage === 'ja',
          click: () => sendLanguageChange('ja')
        },
        {
          label: '한국어',
          type: 'radio',
          id: 'lang-ko',
          checked: currentLanguage === 'ko',
          click: () => sendLanguageChange('ko')
        }
      ]
    },
    {
      label: t.help,
      submenu: [
        {
          label: t.about,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: t.about,
              message: t.aboutMessage,
              buttons: [t.ok]
            });
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

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
    title: getMenuText(currentLanguage).windowTitle,
    backgroundColor: '#121214'
  });

  mainWindow.loadFile('index.html');
  rebuildMenu();
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
ipcMain.on('sync-menu-language', (event, langCode) => {
  setMainLanguage(langCode);
});

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
