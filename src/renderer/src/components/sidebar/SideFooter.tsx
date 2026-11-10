import type { JSX } from 'react'
import moonIcon from '../../assets/icons/moon.svg'
import panelIcon from '../../assets/icons/panel.svg'
import sunIcon from '../../assets/icons/sun.svg'
import type { Theme } from './types'
import VaultMeter from './VaultMeter'

type SideFooterProps = {
  noteCount: number
  theme: Theme
  rail: boolean
  onToggleTheme: () => void
  onToggleRail: () => void
}

function SideFooter({
  noteCount,
  theme,
  rail,
  onToggleTheme,
  onToggleRail
}: SideFooterProps): JSX.Element {
  return (
    <div className="side-foot">
      <VaultMeter noteCount={noteCount} />

      <div className="foot-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <img src={moonIcon} alt="" /> : <img src={sunIcon} alt="" />}
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>

        <button
          type="button"
          className="icon-btn rail-toggle"
          onClick={onToggleRail}
          title={rail ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Collapse sidebar"
        >
          <img src={panelIcon} alt="" />
        </button>
      </div>
    </div>
  )
}

export default SideFooter
