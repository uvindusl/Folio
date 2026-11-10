import type { JSX } from 'react'
import fileIcon from '../../assets/icons/file.svg'
import type { FileRowProps } from './types'

function FileRow({ node, activePath, onSelect }: FileRowProps): JSX.Element {
  return (
    <button
      type="button"
      className={`row file-row${node.path === activePath ? ' active' : ''}`}
      title={node.path}
      onClick={() => onSelect(node.path)}
    >
      <span className="ico">
        <img src={fileIcon} alt="" />
      </span>
      <span className="label">{node.name}</span>
    </button>
  )
}

export default FileRow
