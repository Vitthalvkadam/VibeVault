import { useEffect, useRef } from 'react'
import { useMusic } from '../context/MusicContext'

export default function AddToPlaylistMenu({ song, onClose }) {
  const { playlists, addToPlaylist } = useMusic()
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-2xl py-1.5 z-10 animate-fadeIn"
    >
      <p className="px-3 py-1.5 text-xs text-muted uppercase tracking-wide">Add to playlist</p>
      {playlists.length === 0 && <p className="px-3 py-2 text-sm text-muted">No playlists yet</p>}
      {playlists.map((p) => (
        <button
          key={p.id}
          onClick={() => {
            addToPlaylist(p.id, song)
            onClose()
          }}
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-base-cardHover truncate"
        >
          {p.name}
        </button>
      ))}
    </div>
  )
}
