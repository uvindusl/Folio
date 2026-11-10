import type { JSX } from 'react'
import plusIcon from '../../assets/icons/plus.svg'
import type { VaultInfo, VaultNode } from '../../types'
import FileRow from './FileRow'
import FolderNode from './FolderNode'

type FileTreeProps = {
  vault: VaultInfo | null
  label: string
  visibleTree: VaultNode[]
  trimmedQuery: string
  toggled: Set<string>
  activePath: string | null
  onToggleFolder: (path: string) => void
  onSelect: (path: string) => void
  onCreateNote: () => void
}

function FileTree({
  vault,
  label,
  visibleTree,
  trimmedQuery,
  toggled,
  activePath,
  onToggleFolder,
  onSelect,
  onCreateNote
}: FileTreeProps): JSX.Element {
  return (
    <nav className="tree" aria-label="File tree">
      <div className="tree-top">
        <span className="eyebrow">{label}</span>
        <button
          type="button"
          className="mini-btn"
          onClick={onCreateNote}
          title="New note"
          aria-label="New note"
        >
          <img src={plusIcon} alt="" />
        </button>
      </div>

      <div>
        {visibleTree.map((node) =>
          node.type === 'dir' ? (
            <FolderNode
              key={node.path}
              node={node}
              depth={0}
              query={trimmedQuery}
              toggled={toggled}
              activePath={activePath}
              onToggleFolder={onToggleFolder}
              onSelect={onSelect}
            />
          ) : (
            <FileRow key={node.path} node={node} activePath={activePath} onSelect={onSelect} />
          )
        )}

        {visibleTree.length === 0 && (
          <div className="tree-empty">
            {vault ? (
              <>
                <b>Nothing here yet</b>
                Try another word — or start a new note.
              </>
            ) : (
              <>
                <b>No vault open</b>
                Pick a folder of Markdown notes to get started.
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default FileTree
