import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, resolve, basename, extname } from 'node:path'
import { readdir, writeFile, access } from 'node:fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

type VaultNode = {
  name: string
  path: string
  type: 'file' | 'dir'
  count?: number
  children?: VaultNode[]
}

const NOTE_EXTENSIONS = new Set(['.md', '.markdown', '.mdx', '.txt'])
const IGNORED_DIRS = new Set(['node_modules', '.git', '.obsidian', '.trash'])

let vaultRoot: string | null = null

// Electron + Vulkan on Wayland can leave the window blank (or never paint).
// Software rendering keeps the window visible on Wayland desktops.
if (process.platform === 'linux' && process.env.XDG_SESSION_TYPE === 'wayland') {
  app.disableHardwareAcceleration()
}

function countFiles(nodes: VaultNode[]): number {
  return nodes.reduce(
    (total, node) => total + (node.type === 'file' ? 1 : countFiles(node.children ?? [])),
    0
  )
}

async function buildTree(dir: string, depth = 0): Promise<VaultNode[]> {
  if (depth > 8) return []

  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const folders: VaultNode[] = []
  const files: VaultNode[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.') || IGNORED_DIRS.has(entry.name)) continue

    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      const children = await buildTree(fullPath, depth + 1)
      folders.push({
        name: entry.name,
        path: fullPath,
        type: 'dir',
        count: countFiles(children),
        children
      })
    } else if (NOTE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push({ name: entry.name, path: fullPath, type: 'file' })
    }
  }

  const byName = (a: VaultNode, b: VaultNode): number => a.name.localeCompare(b.name)
  return [...folders.sort(byName), ...files.sort(byName)]
}

async function readVault(): Promise<{ path: string; name: string; tree: VaultNode[] } | null> {
  if (!vaultRoot) return null
  const tree = await buildTree(vaultRoot)
  return { path: vaultRoot, name: basename(vaultRoot), tree }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('vault:open', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const options: Electron.OpenDialogOptions = {
      title: 'Open Vault',
      buttonLabel: 'Open Vault',
      properties: ['openDirectory', 'createDirectory']
    }

    const result = win
      ? await dialog.showOpenDialog(win, options)
      : await dialog.showOpenDialog(options)

    if (result.canceled || result.filePaths.length === 0) return null

    vaultRoot = resolve(result.filePaths[0])
    app.addRecentDocument(vaultRoot)
    return readVault()
  })

  ipcMain.handle('vault:rescan', async () => readVault())

  ipcMain.handle('vault:create', async () => {
    if (!vaultRoot) return null

    let name = 'Untitled.md'
    let counter = 1
    while (await fileExists(join(vaultRoot, name))) {
      counter += 1
      name = `Untitled ${counter}.md`
    }

    const filePath = join(vaultRoot, name)
    await writeFile(filePath, `# ${name.replace(/\.md$/i, '')}\n\n`, 'utf-8')
    return { path: filePath, name, content: `# ${name.replace(/\.md$/i, '')}\n\n` }
  })
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 760,
    minWidth: 760,
    minHeight: 520,
    show: true,
    backgroundColor: '#07080c',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
