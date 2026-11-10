import type { JSX } from 'react'
import homeIcon from '../../assets/icons/home.svg'
import plusIcon from '../../assets/icons/plus.svg'
import searchIcon from '../../assets/icons/search.svg'
import shuffleIcon from '../../assets/icons/shuffle.svg'

type RailNavProps = {
  onHome: () => void
  onFocusSearch: () => void
  onRandomNote: () => void
  onCreateNote: () => void
}

function RailNav({ onHome, onFocusSearch, onRandomNote, onCreateNote }: RailNavProps): JSX.Element {
  return (
    <div className="rail-nav">
      <button type="button" className="icon-btn" onClick={onHome} title="Home" aria-label="Home">
        <img src={homeIcon} alt="" />
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={onFocusSearch}
        title="Search (⌘K)"
        aria-label="Search"
      >
        <img src={searchIcon} alt="" />
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={onRandomNote}
        title="Random note"
        aria-label="Random note"
      >
        <img src={shuffleIcon} alt="" />
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={onCreateNote}
        title="New note"
        aria-label="New note"
      >
        <img src={plusIcon} alt="" />
      </button>
    </div>
  )
}

export default RailNav
