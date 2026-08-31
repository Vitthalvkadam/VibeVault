import { Play, Pause, Trash2, Music2 } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import UploadSongForm from '../components/UploadSongForm'
import { formatTime } from '../utils/formatTime'

export default function Uploads() {
  const { uploadedSongs, currentSong, isPlaying, playSong, togglePlay, deleteUpload } = useMusic()

  return (
    <div className="px-4 lg:px-6 py-4 pb-10">
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Your Uploads</h1>
      <p className="text-muted text-sm mb-6">Add songs from your computer and they'll show up here and across your library.</p>

      <UploadSongForm />

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Your songs ({uploadedSongs.length})</h2>
        {uploadedSongs.length === 0 ? (
          <p className="text-muted text-sm">Nothing uploaded yet — add your first track above.</p>
        ) : (
          <div className="flex flex-col divide-y divide-base-border">
            {uploadedSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id
              const playable = Boolean(song.audioFile)
              return (
                <div key={song.id} className="flex items-center gap-4 py-3 group">
                  <button
                    onClick={() => (isCurrent ? togglePlay() : playSong(song, uploadedSongs))}
                    disabled={!playable}
                    className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full ${
                      playable ? 'text-white hover:text-accent' : 'text-muted/50 cursor-not-allowed'
                    }`}
                    title={playable ? 'Play' : 'Audio unavailable after reload — please re-upload'}
                  >
                    {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                  <img src={song.coverImage} alt="" className="w-11 h-11 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {song.artist} {!playable && '· audio unavailable, re-upload to play'}
                    </p>
                  </div>
                  <span className="hidden sm:flex items-center gap-1 text-xs text-muted">
                    <Music2 size={13} /> {formatTime(song.duration)}
                  </span>
                  <button
                    onClick={() => deleteUpload(song.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-opacity"
                    aria-label="Delete song"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
