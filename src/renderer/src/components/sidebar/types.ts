import type { VaultNode } from '../../types'

export type Theme = 'dark' | 'light'

export type TreeItemProps = {
  node: VaultNode
  depth: number
  query: string
  toggled: Set<string>
  activePath: string | null
  onToggleFolder: (path: string) => void
  onSelect: (path: string) => void
}

export type FileRowProps = {
  node: VaultNode
  activePath: string | null
  onSelect: (path: string) => void
}
