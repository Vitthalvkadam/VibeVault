import { Play, Pause, Plus } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { useState } from 'react'
import AddToPlaylistMenu from './AddToPlaylistMenu'

export default function SongCard({ song, queue }) {
  const { currentSong, isPlaying, playSong, togglePlay } = useMusic()
  const [menuOpen, setMenuOpen] = useState(false)
  const isCurrent = currentSong?.id === song.id
  const playable = Boolean(song.audioFile) || song.source === 'youtube'

  function handlePlay() {
    if (!playable) return
    if (isCurrent) {
      togglePlay()
    } else {
      playSong(song, queue)
    }
  }

  return (
    <div className="group relative bg-base-card hover:bg-base-cardHover rounded-xl p-4 transition-colors duration-200 animate-fadeIn">
      <div className="relative mb-3">
        <img
          src={song.coverImage || 'https://picsum.photos/seed/fallback/400/400'}
          alt={song.album || song.title}
          className="w-full aspect-square object-cover rounded-lg shadow-lg"
          loading="lazy"
        />
        <button
          onClick={handlePlay}
          disabled={!playable}
          title={playable ? 'Play' : 'Audio unavailable — re-upload this file'}
          className={`absolute bottom-2 right-2 rounded-full p-3 shadow-xl transition-all duration-200 ${
            playable
              ? 'bg-accent text-black opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 hover:scale-105'
              : 'bg-base-cardHover text-muted cursor-not-allowed opacity-0 group-hover:opacity-100'
          }`}
        >
          {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
      </div>
      <p className={`font-semibold text-sm truncate ${isCurrent ? 'text-accent' : 'text-white'}`}>{song.title}</p>
      <p className="text-xs text-muted truncate mt-1">{song.artist}</p>

      <div className="absolute top-3 right-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="opacity-0 group-hover:opacity-100 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-opacity"
          aria-label="Add to playlist"
        >
          <Plus size={14} />
        </button>
        {menuOpen && <AddToPlaylistMenu song={song} onClose={() => setMenuOpen(false)} />}
      </div>
    </div>
  )
}
