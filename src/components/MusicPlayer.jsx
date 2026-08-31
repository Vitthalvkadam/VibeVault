import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import ProgressBar from './ProgressBar'
import VolumeControl from './VolumeControl'

export default function MusicPlayer() {
  const { currentSong, isPlaying, togglePlay, next, prev, progress, duration, seek, volume, setVolume, queue } =
    useMusic()

  if (!currentSong) {
    return (
      <footer className="hidden sm:flex items-center justify-center h-20 bg-base-panel border-t border-base-border text-sm text-muted">
        Pick a song to start listening
      </footer>
    )
  }

  return (
    <footer className="sticky bottom-0 z-20 bg-base-panel border-t border-base-border shadow-player px-4 py-3">
      <div className="grid grid-cols-3 items-center gap-4 max-w-7xl mx-auto">
        {/* Now playing */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentSong.coverImage}
            alt={currentSong.title}
            className="w-15 h-15 rounded-md object-cover shrink-0"
          />
          <div className="min-w-0 hidden xs:block">
            <p className="text-sm font-semibold truncate">{currentSong.title}</p>
            <p className="text-xs text-muted truncate">{currentSong.artist}</p>
          </div>
          {isPlaying && (
            <div className="hidden sm:flex items-end gap-0.5 h-4 ml-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-0.5 bg-accent rounded-full animate-pulseBar"
                  style={{ height: '100%', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button
              onClick={prev}
              disabled={queue.length < 2}
              className="text-muted hover:text-white disabled:opacity-30 transition-colors"
              aria-label="Previous"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-2.5 hover:scale-105 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              onClick={next}
              disabled={queue.length < 2}
              className="text-muted hover:text-white disabled:opacity-30 transition-colors"
              aria-label="Next"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
          <div className="hidden md:block w-full max-w-md">
            <ProgressBar progress={progress} duration={duration} onSeek={seek} />
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-end gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-muted text-xs">
            <ListMusic size={16} />
            <span>{queue.length} in queue</span>
          </div>
          <VolumeControl volume={volume} onChange={setVolume} />
        </div>
      </div>

      <div className="md:hidden mt-2">
        <ProgressBar progress={progress} duration={duration} onSeek={seek} />
      </div>
    </footer>
  )
}
