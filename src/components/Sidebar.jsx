import { NavLink } from 'react-router-dom'
import { Home, Search, Library, UploadCloud, AudioLines, Plus, X } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/uploads', label: 'Your Uploads', icon: UploadCloud },
]

export default function Sidebar({ open, onClose }) {
  const { playlists, createPlaylist } = useMusic()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  function handleCreate(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    createPlaylist({ id: crypto.randomUUID(), name: trimmed, description: '', songs: [] })
    setName('')
    setCreating(false)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 shrink-0 bg-base-black z-40 flex flex-col gap-2 p-3 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex items-center gap-2">
            <AudioLines className="text-accent" size={28} strokeWidth={2.4} />
            <span className="font-display font-bold text-xl tracking-tight">Wavelength</span>
          </div>
          <button className="lg:hidden text-muted" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <nav className="bg-base-panel rounded-xl p-2 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive ? 'bg-base-cardHover text-white' : 'text-muted hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="bg-base-panel rounded-xl p-2 flex-1 flex flex-col overflow-hidden mt-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-muted text-sm font-semibold uppercase tracking-wide">Playlists</span>
            <button
              onClick={() => setCreating((v) => !v)}
              className="text-muted hover:text-white transition-colors"
              aria-label="Create playlist"
            >
              <Plus size={18} />
            </button>
          </div>

          {creating && (
            <form onSubmit={handleCreate} className="px-3 pb-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Playlist name"
                className="w-full bg-base-cardHover rounded-md px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-accent"
              />
            </form>
          )}

          <div className="flex-1 overflow-y-auto thin-scrollbar px-1">
            {playlists.length === 0 && !creating && (
              <p className="px-3 py-2 text-sm text-muted">Create your first playlist.</p>
            )}
            {playlists.map((p) => (
              <NavLink
                key={p.id}
                to={`/playlist/${p.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                    isActive ? 'bg-base-cardHover text-white' : 'text-muted hover:text-white'
                  }`
                }
              >
                {p.name}
                <span className="text-xs text-muted ml-1.5">· {p.songs.length}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
