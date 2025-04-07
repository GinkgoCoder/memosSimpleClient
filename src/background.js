'use strict'

import { app, protocol, BrowserWindow, globalShortcut, ipcMain, nativeTheme } from 'electron'
import fs from 'fs'
import path from 'path'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

const theme = process.env.DARK_THEME ? 'dark' : 'light'

nativeTheme.themeSource = theme
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const SAVE_FILE_PATH = process.env.MEMOFILEPATH ? process.env.MEMOFILEPATH : path.join(app.getPath('home'), '.memo.md')

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 560,
    height: 560,
    minWidth: 560,
    minHeight: 560,
    title: process.env.MEMOTITLE ? process.env.MEMOTITLE : 'Memo',
    darkTheme: process.env.THEME === 'dark',
    backgroundColor:  process.env.THEME === 'dark' ? '#25292e' : '#FFFFFF',
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  // 确保标题不会被覆盖
  win.on('page-title-updated', (event) => {
    event.preventDefault()
  })

  // 读取文件内容
  let initialContent = ''
  try {
    if (fs.existsSync(SAVE_FILE_PATH)) {
      initialContent = fs.readFileSync(SAVE_FILE_PATH, 'utf-8')
    }
  } catch (err) {
    console.warn('failed to read the .memo.md file:', err)
  }


  win.webContents.on('did-finish-load', () => {
    win.webContents.send('load-content', initialContent)
    win.webContents.send('theme', process.env.THEME);
  })

  globalShortcut.register('CommandOrControl+Enter', () => {
    win.webContents.send('save-content')
  })

  globalShortcut.register('CommandOrControl+Q', () => {
    app.quit()
  })

  globalShortcut.register('CommandOrControl+T', () => {
    win.setAlwaysOnTop(!win.isAlwaysOnTop())
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('save-and-quit', (event, content) => {
  try {
    fs.writeFileSync(SAVE_FILE_PATH, content, 'utf-8')
    console.log('The contanet is saved')
    app.quit()
  } catch (err) {
    console.error('Failed to save the content:', err)
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
