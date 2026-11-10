export type VaultNode = {
  name: string
  path: string
  type: 'file' | 'dir'
  count?: number
  children?: VaultNode[]
}

export type VaultInfo = {
  path: string
  name: string
  tree: VaultNode[]
}

export type NoteFile = {
  path: string
  name: string
  content: string
}
