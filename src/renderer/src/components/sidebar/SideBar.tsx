import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import type { VaultInfo } from '../../types'
import FileTree from './FileTree'
import NewNoteButton from './NewNoteButton'
import RailNav from './RailNav'
import SearchBox from './SearchBox'
import SideFooter from './SideFooter'
import SideHead from './SideHead'
import { flatten, nodeMatches } from './tree'
import type { Theme } from './types'

type SideBarProps = {
  vault: VaultInfo | null
  activePath: string | null
  query: string
  theme: Theme
  rail: boolean
  onQueryChange: (query: string) => void
  onOpenVault: () => void
  onSelect: (path: string | null) => void
  onCreateNote: () => void
  onRandomNote: () => void
  onToggleTheme: () => void
  onToggleRail: () => void
}

function SideBar({
  vault,
  activePath,
  query,
  theme,
  rail,
  onQueryChange,
  onOpenVault,
  onSelect,
  onCreateNote,
  onRandomNote,
  onToggleTheme,
  onToggleRail
}: SideBarProps): JSX.Element {
  const [toggled, setToggled] = useState<Set<string>>(new Set())

  const notes = useMemo(() => (vault ? flatten(vault.tree) : []), [vault])
  const trimmed = query.trim().toLowerCase()
  const results = trimmed
    ? notes.filter((note) => note.name.toLowerCase().includes(trimmed))
    : notes

  const visibleTree = (vault?.tree ?? []).filter(
    (node) => trimmed === '' || nodeMatches(node, trimmed)
  )

  const label = trimmed
    ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
    : 'Library'

  function toggleFolder(path: string): void {
    setToggled((previous) => {
      const next = new Set(previous)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  function focusSearch(): void {
    document.getElementById('treeSearch')?.focus()
  }

  function goHome(): void {
    onSelect(null)
  }

  return (
    <aside className="sidebar" aria-label="Vault">
      <SideHead vaultName={vault?.name ?? null} onOpenVault={onOpenVault} onHome={goHome} />

      <SearchBox query={query} onQueryChange={onQueryChange} />

      <NewNoteButton onCreateNote={onCreateNote} />

      <RailNav
        onHome={goHome}
        onFocusSearch={focusSearch}
        onRandomNote={onRandomNote}
        onCreateNote={onCreateNote}
      />

      <FileTree
        vault={vault}
        label={label}
        visibleTree={visibleTree}
        trimmedQuery={trimmed}
        toggled={toggled}
        activePath={activePath}
        onToggleFolder={toggleFolder}
        onSelect={onSelect}
        onCreateNote={onCreateNote}
      />

      <SideFooter
        noteCount={notes.length}
        theme={theme}
        rail={rail}
        onToggleTheme={onToggleTheme}
        onToggleRail={onToggleRail}
      />
    </aside>
  )
}

export default SideBar;
