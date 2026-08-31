import { useState } from 'react'
import { useMusic } from '../context/MusicContext'
import PlaylistCard from '../components/PlaylistCard'
import SongCard from '../components/SongCard'

export default function Library() {
  const { playlists, library } = useMusic()
  const [tab, setTab] = useState('playlists')

  return (
    <div className="px-4 lg:px-6 py-4 pb-10">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Your Library</h1>

      <div className="flex gap-2 mb-6">
        {[
          { id: 'playlists', label: 'Playlists' },
          { id: 'songs', label: 'All Songs' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-white text-black' : 'bg-base-panel text-muted hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'playlists' ? (
        playlists.length === 0 ? (
          <p className="text-muted text-sm">
            No playlists yet — use the <span className="text-white font-medium">+</span> button in the sidebar to
            create one.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {library.map((song) => (
            <SongCard key={song.id} song={song} queue={library} />
          ))}
        </div>
      )}
    </div>
  )
}
