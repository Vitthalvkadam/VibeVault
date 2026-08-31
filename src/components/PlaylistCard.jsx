import { ListMusic, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMusic } from '../context/MusicContext'

export default function PlaylistCard({ playlist }) {
  const navigate = useNavigate()
  const { deletePlaylist } = useMusic()
  const covers = playlist.songs.slice(0, 4)

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="group relative cursor-pointer bg-base-card hover:bg-base-cardHover rounded-xl p-4 transition-colors duration-200 animate-fadeIn"
    >
      {covers.length > 0 ? (
        <div className="grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden mb-3 aspect-square">
          {covers.map((s) => (
            <img key={s.id} src={s.coverImage} alt="" className="w-full h-full object-cover" />
          ))}
          {Array.from({ length: Math.max(0, 4 - covers.length) }).map((_, i) => (
            <div key={i} className="bg-base-cardHover" />
          ))}
        </div>
      ) : (
        <div className="aspect-square rounded-lg bg-base-cardHover flex items-center justify-center mb-3">
          <ListMusic className="text-muted" size={40} />
        </div>
      )}
      <p className="font-semibold text-sm truncate">{playlist.name}</p>
      <p className="text-xs text-muted truncate mt-1">{playlist.songs.length} songs</p>

      <button
        onClick={(e) => {
          e.stopPropagation()
          deletePlaylist(playlist.id)
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-opacity"
        aria-label="Delete playlist"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
