import { useParams, Navigate } from 'react-router-dom'
import { Play, Pause, X, ListMusic } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { formatTime } from '../utils/formatTime'

export default function Playlist() {
  const { id } = useParams()
  const { playlists, currentSong, isPlaying, playSong, togglePlay, removeFromPlaylist } = useMusic()
  const playlist = playlists.find((p) => p.id === id)

  if (!playlist) return <Navigate to="/library" replace />

  return (
    <div className="px-4 lg:px-6 py-6 pb-10">
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-8">
        <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-lg bg-gradient-to-br from-accent/30 to-base-panel flex items-center justify-center shrink-0 shadow-xl">
          <ListMusic size={56} className="text-accent" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Playlist</p>
          <h1 className="text-3xl sm:text-5xl font-bold mt-1 mb-3">{playlist.name}</h1>
          <p className="text-sm text-muted">{playlist.songs.length} songs</p>
        </div>
      </div>

      {playlist.songs.length > 0 && (
        <button
          onClick={() => playSong(playlist.songs[0], playlist.songs)}
          className="bg-accent hover:bg-accent-bright text-black rounded-full p-4 mb-6 hover:scale-105 transition-transform"
          aria-label="Play playlist"
        >
          <Play size={22} fill="currentColor" className="ml-0.5" />
        </button>
      )}

      {playlist.songs.length === 0 ? (
        <p className="text-muted text-sm">
          This playlist is empty — add songs using the <span className="text-white font-medium">+</span> icon on any
          song card.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-base-border">
          {playlist.songs.map((song, i) => {
            const isCurrent = currentSong?.id === song.id
            const playable = Boolean(song.audioFile)
            return (
              <div key={song.id} className="flex items-center gap-4 py-3 group">
                <span className="w-5 text-sm text-muted text-center shrink-0">
                  {isCurrent && isPlaying ? (
                    <span className="text-accent">●</span>
                  ) : (
                    i + 1
                  )}
                </span>
                <button
                  onClick={() => (isCurrent ? togglePlay() : playSong(song, playlist.songs))}
                  disabled={!playable}
                  className={`shrink-0 ${playable ? 'text-white hover:text-accent' : 'text-muted/50 cursor-not-allowed'}`}
                >
                  {isCurrent && isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
                <img src={song.coverImage} alt="" className="w-11 h-11 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className="text-xs text-muted truncate">{song.artist}</p>
                </div>
                <span className="hidden sm:inline text-xs text-muted">{formatTime(song.duration)}</span>
                <button
                  onClick={() => removeFromPlaylist(playlist.id, song.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-opacity"
                  aria-label="Remove from playlist"
                >
                  <X size={16} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
