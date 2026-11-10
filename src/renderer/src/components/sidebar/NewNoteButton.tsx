import type { JSX } from 'react'
import plusIcon from '../../assets/icons/plus.svg'

type NewNoteButtonProps = {
  onCreateNote: () => void
}

function NewNoteButton({ onCreateNote }: NewNoteButtonProps): JSX.Element {
  return (
    <button type="button" className="new-note" onClick={onCreateNote}>
      <img src={plusIcon} alt="" />
      New note
    </button>
  )
}

export default NewNoteButton
