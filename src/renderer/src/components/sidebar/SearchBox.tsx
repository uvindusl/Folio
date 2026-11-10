import type { JSX } from 'react'
import searchIcon from '../../assets/icons/search.svg'

type SearchBoxProps = {
  query: string
  onQueryChange: (query: string) => void
}

function SearchBox({ query, onQueryChange }: SearchBoxProps): JSX.Element {
  return (
    <div className="searchwrap">
      <img src={searchIcon} alt="" />
      <input
        id="treeSearch"
        type="search"
        placeholder="Search notes…"
        autoComplete="off"
        spellCheck={false}
        aria-label="Search notes"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <kbd>⌘K</kbd>
    </div>
  )
}

export default SearchBox
