import type { JSX } from 'react'
import chevronIcon from '../../assets/icons/chevron.svg'
import folderIcon from '../../assets/icons/folder.svg'
import { nodeMatches } from './tree'
import type { TreeItemProps } from './types'
import FileRow from './FileRow'

function FolderNode({
  node,
  depth,
  query,
  toggled,
  activePath,
  onToggleFolder,
  onSelect
}: TreeItemProps): JSX.Element {
  // Top-level folders start open; deeper ones start collapsed. `toggled`
  // records every folder the user has explicitly flipped.
  const isOpen =
    query !== '' ? true : depth === 0 ? !toggled.has(node.path) : toggled.has(node.path)
  const folderMatches = query !== '' && node.name.toLowerCase().includes(query)

  const children = (node.children ?? []).filter(
    (child) => query === '' || folderMatches || nodeMatches(child, query)
  )

  return (
    <div className={`node folder${isOpen ? '' : ' collapsed'}`} data-folder={node.path}>
      <button
        type="button"
        className="row folder-row"
        aria-expanded={isOpen}
        title={node.name}
        onClick={() => onToggleFolder(node.path)}
      >
        <span className="chev">
          <img src={chevronIcon} alt="" />
        </span>
        <span className="ico">
          <img src={folderIcon} alt="" />
        </span>
        <span className="label">{node.name}</span>
        <span className="count">{node.count ?? 0}</span>
      </button>

      <div className="children">
        <div className="children-inner">
          {children.map((child) =>
            child.type === 'dir' ? (
              <FolderNode
                key={child.path}
                node={child}
                depth={depth + 1}
                query={query}
                toggled={toggled}
                activePath={activePath}
                onToggleFolder={onToggleFolder}
                onSelect={onSelect}
              />
            ) : (
              <FileRow key={child.path} node={child} activePath={activePath} onSelect={onSelect} />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default FolderNode
