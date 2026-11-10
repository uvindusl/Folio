import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import type { VaultInfo, VaultNode } from './types'
import SideBar from './components/sidebar/SideBar'

type Theme = 'dark' | 'light'

function readTheme(): Theme {
  return localStorage.getItem('folio:theme') === 'light' ? 'light' : 'dark'
}

function readRail(): boolean {
  return localStorage.getItem('folio:rail') === '1'
}

function flatten(nodes: VaultNode[]): VaultNode[] {
  return nodes.flatMap((node) => (node.type === 'file' ? [node] : flatten(node.children ?? [])))
}

function App(): JSX.Element {
  const [vault, setVault] = useState<VaultInfo | null>(null)
  const [activePath, setActivePath] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [rail, setRail] = useState<boolean>(readRail)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('folio:theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('folio:rail', rail ? '1' : '0')
  }, [rail])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      const mod = event.metaKey || event.ctrlKey
      const target = event.target as HTMLElement | null
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true

      if ((mod && event.key.toLowerCase() === 'k') || (event.key === '/' && !typing)) {
        event.preventDefault()
        document.getElementById('treeSearch')?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  async function openVault(): Promise<void> {
    const opened = await window.api.openVault()
    if (!opened) return
    setVault(opened)
    setActivePath(null)
    setQuery('')
  }

  async function createNote(): Promise<void> {
    if (!vault) {
      await openVault()
      return
    }

    const created = await window.api.createNote()
    if (!created) return

    const rescanned = await window.api.rescanVault()
    if (rescanned) setVault(rescanned)
    setActivePath(created.path)
    setQuery('')
  }

  function randomNote(): void {
    if (!vault) return
    const notes = flatten(vault.tree)
    if (notes.length === 0) return
    const pool = notes.length > 1 ? notes.filter((item) => item.path !== activePath) : notes
    setActivePath(pool[Math.floor(Math.random() * pool.length)].path)
  }

  return (
    <>
      <div className="bg-layer" aria-hidden="true">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="grid-plane" />
        <div className="noise" />
      </div>
      <div className="spot" aria-hidden="true" />

      <div className={'app' + (rail ? ' rail' : '')}>
        <SideBar
          vault={vault}
          activePath={activePath}
          query={query}
          theme={theme}
          rail={rail}
          onQueryChange={setQuery}
          onOpenVault={openVault}
          onSelect={setActivePath}
          onCreateNote={createNote}
          onRandomNote={randomNote}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          onToggleRail={() => setRail((current) => !current)}
        />
      </div>
    </>
  )
}

export default App
