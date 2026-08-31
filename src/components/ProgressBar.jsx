import { formatTime } from '../utils/formatTime'

export default function ProgressBar({ progress, duration, onSeek }) {
  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-xs text-muted w-10 text-right tabular-nums">{formatTime(progress)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={progress}
        onChange={(e) => onSeek(Number(e.target.value))}
        style={{ '--range-progress': `${pct}%` }}
        className="flex-1"
        aria-label="Seek"
      />
      <span className="text-xs text-muted w-10 tabular-nums">{formatTime(duration)}</span>
    </div>
  )
}
