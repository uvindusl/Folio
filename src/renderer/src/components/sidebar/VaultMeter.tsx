import type { JSX } from 'react'

type VaultMeterProps = {
  noteCount: number
}

function VaultMeter({ noteCount }: VaultMeterProps): JSX.Element {
  const meter = noteCount === 0 ? 0 : Math.min(100, Math.max(8, noteCount * 2))

  return (
    <div className="vault-meter">
      <div className="meter-top">
        <span>Local vault</span>
        <span>{noteCount} notes</span>
      </div>
      <div className="meter-bar">
        <div className="meter-fill" style={{ width: `${meter}%` }} />
      </div>
    </div>
  )
}

export default VaultMeter
