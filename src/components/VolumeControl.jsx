import { useState } from 'react'
import { Volume2, Volume1, VolumeX } from 'lucide-react'

export default function VolumeControl({ volume, onChange }) {
  const [prevVolume, setPrevVolume] = useState(0.8)
  const pct = volume * 100

  function toggleMute() {
    if (volume > 0) {
      setPrevVolume(volume)
      onChange(0)
    } else {
      onChange(prevVolume || 0.8)
    }
  }

  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div className="flex items-center gap-2 w-32">
      <button onClick={toggleMute} className="text-muted hover:text-white transition-colors" aria-label="Mute">
        <Icon size={18} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--range-progress': `${pct}%` }}
        className="flex-1"
        aria-label="Volume"
      />
    </div>
  )
}
