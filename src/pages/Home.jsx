import { useMemo } from 'react'
import { useMusic } from '../context/MusicContext'
import SongCard from '../components/SongCard'
import AlbumCard from '../components/AlbumCard'
import { demoAlbums } from '../data/songs'
import { useNavigate } from 'react-router-dom'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { allSongs, uploadedSongs, library } = useMusic()
  const navigate = useNavigate()

  const recentlyAdded = useMemo(() => [...uploadedSongs].slice(0, 8), [uploadedSongs])

  return (
    <div className="px-4 lg:px-6 py-4 pb-10">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">{greeting()}</h1>

      {recentlyAdded.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recently Uploaded</h2>
            <button onClick={() => navigate('/uploads')} className="text-xs font-semibold text-muted hover:text-white">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentlyAdded.map((song) => (
              <SongCard key={song.id} song={song} queue={library} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Made for you</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {allSongs.map((song) => (
            <SongCard key={song.id} song={song} queue={library} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular albums</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {demoAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} onClick={() => navigate('/search')} />
          ))}
        </div>
      </section>
    </div>
  )
}
