import { useEffect, useMemo, useRef, useState } from 'react'
import { Search as SearchIcon, Loader2, AlertCircle } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import SongCard from '../components/SongCard'
import { createDebouncedYouTubeSearch, YT_ERROR } from '../services/youtubeApi'

const YT_ERROR_MESSAGES = {
  [YT_ERROR.MISSING_KEY]:
    'YouTube search isn\u2019t configured yet — add VITE_YOUTUBE_API_KEY to your .env file.',
  [YT_ERROR.QUOTA]: 'YouTube search quota reached for today. Local results are still available.',
  [YT_ERROR.NETWORK]: 'Couldn\u2019t reach YouTube — check your connection and try again.',
  [YT_ERROR.UNKNOWN]: 'YouTube search failed. Local results are still available.',
}

export default function Search() {
  const { library } = useMusic()
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState('all') // all | songs | artists | uploads

  const [ytResults, setYtResults] = useState([])
  const [ytLoading, setYtLoading] = useState(false)
  const [ytError, setYtError] = useState(null)
  const debouncedSearchRef = useRef(null)
  if (!debouncedSearchRef.current) {
    debouncedSearchRef.current = createDebouncedYouTubeSearch(450)
  }

  // YouTube results only apply to the "All" and "Songs" scopes — artist and
  // uploads scopes preserve their original, local-only behavior.
  const includeYoutube = scope === 'all' || scope === 'songs'

  useEffect(() => {
    const q = query.trim()
    if (!includeYoutube || !q) {
      debouncedSearchRef.current.cancel()
      setYtResults([])
      setYtLoading(false)
      setYtError(null)
      return
    }

    setYtLoading(true)
    setYtError(null)
    debouncedSearchRef.current(q, ({ results, error }) => {
      setYtLoading(false)
      setYtError(error)
      setYtResults(results)
    })

    return () => debouncedSearchRef.current.cancel()
  }, [query, includeYoutube])

  const localResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    let pool = library
    if (scope === 'uploads') pool = pool.filter((s) => s.uploadedBy === 'you')
    if (!q) return scope === 'uploads' ? pool : []
    return pool.filter((s) => {
      if (scope === 'artists') return s.artist.toLowerCase().includes(q)
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q)
      )
    })
  }, [library, query, scope])

  const combinedResults = useMemo(() => {
    if (!includeYoutube || ytResults.length === 0) return localResults
    return [...localResults, ...ytResults]
  }, [localResults, ytResults, includeYoutube])

  const scopes = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'uploads', label: 'Your uploads' },
  ]

  const hasQuery = query.trim() !== ''
  const showEmptyState = !hasQuery && scope !== 'uploads'
  const showNoResults = (hasQuery || scope === 'uploads') && combinedResults.length === 0 && !ytLoading

  return (
    <div className="px-4 lg:px-6 py-4 pb-10">
      <div className="relative max-w-xl mb-5">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-base-panel rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {scopes.map((s) => (
          <button
            key={s.id}
            onClick={() => setScope(s.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              scope === s.id ? 'bg-white text-black' : 'bg-base-panel text-muted hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {includeYoutube && hasQuery && ytError && (
        <div className="mb-5 flex items-start gap-2 bg-base-panel border border-base-border rounded-lg px-3.5 py-2.5 text-sm text-muted max-w-xl">
          <AlertCircle size={16} className="text-accent shrink-0 mt-0.5" />
          <span>{YT_ERROR_MESSAGES[ytError] || YT_ERROR_MESSAGES[YT_ERROR.UNKNOWN]}</span>
        </div>
      )}

      {showEmptyState ? (
        <p className="text-muted text-sm">Start typing to search songs, artists, and albums.</p>
      ) : showNoResults ? (
        <p className="text-muted text-sm">No results for "{query}".</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {combinedResults.map((song) => (
            <SongCard key={song.id} song={song} queue={combinedResults} />
          ))}
          {includeYoutube && ytLoading && (
            <div className="col-span-full flex items-center gap-2 text-muted text-sm py-2">
              <Loader2 size={16} className="animate-spin" />
              Searching YouTube...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
