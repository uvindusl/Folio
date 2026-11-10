import { ElectronAPI } from '@electron-toolkit/preload'
import type { NoteFile, VaultInfo } from '../renderer/src/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      openVault: () => Promise<VaultInfo | null>
      rescanVault: () => Promise<VaultInfo | null>
      createNote: () => Promise<NoteFile | null>
    }
  }
}
