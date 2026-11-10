import type { VaultNode } from '../../types'

export function flatten(nodes: VaultNode[]): VaultNode[] {
  return nodes.flatMap((node) => (node.type === 'file' ? [node] : flatten(node.children ?? [])))
}

export function nodeMatches(node: VaultNode, query: string): boolean {
  if (node.type === 'file') return node.name.toLowerCase().includes(query)
  return (
    node.name.toLowerCase().includes(query) ||
    (node.children ?? []).some((child) => nodeMatches(child, query))
  )
}
