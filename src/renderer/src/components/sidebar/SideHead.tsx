import type { JSX } from 'react'
import brandIcon from '../../assets/icons/brand.svg'
import openFolderIcon from '../../assets/icons/open-folder.svg'

type SideHeadProps = {
  vaultName: string | null
  onOpenVault: () => void
  onHome: () => void
}

function SideHead({ vaultName, onOpenVault, onHome }: SideHeadProps): JSX.Element {
  return (
    <div className="side-head">
      <a
        className="brand"
        href="#"
        onClick={(event) => {
          event.preventDefault()
          onHome()
        }}
        aria-label="Folio home"
      >
        <span className="logo" aria-hidden="true">
          <img src={brandIcon} alt="" />
        </span>
        <span className="brand-text">
          <b>Folio</b>
          <span>{vaultName ?? 'personal vault'}</span>
        </span>
      </a>
      <span className="head-spacer" />
      <button
        type="button"
        className="icon-btn"
        onClick={onOpenVault}
        title={vaultName ? 'Change vault' : 'Open vault'}
        aria-label="Open vault"
      >
        <img src={openFolderIcon} alt="" />
      </button>
    </div>
  )
}

export default SideHead
