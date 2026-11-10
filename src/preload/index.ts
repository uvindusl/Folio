import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { NoteFile, VaultInfo } from '../renderer/src/types'

// Custom APIs for renderer
const api = {
  openVault: (): Promise<VaultInfo | null> => ipcRenderer.invoke('vault:open'),
  rescanVault: (): Promise<VaultInfo | null> => ipcRenderer.invoke('vault:rescan'),
  createNote: (): Promise<NoteFile | null> => ipcRenderer.invoke('vault:create')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
