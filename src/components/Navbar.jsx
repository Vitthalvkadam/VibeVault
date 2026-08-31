import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, ChevronLeft, ChevronRight, Search, UploadCloud, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 lg:px-6 py-3 bg-base-black/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-muted hover:text-white" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-base-panel rounded-full p-1.5 text-white hover:bg-base-cardHover transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => navigate(1)}
            className="bg-base-panel rounded-full p-1.5 text-white hover:bg-base-cardHover transition-colors"
            aria-label="Go forward"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {location.pathname !== '/search' && (
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 bg-base-panel hover:bg-base-cardHover transition-colors rounded-full pl-3 pr-4 py-1.5 text-sm text-muted"
          >
            <Search size={16} />
            Search
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/uploads')}
          className="flex items-center gap-2 bg-accent text-black font-semibold text-sm rounded-full px-4 py-1.5 hover:bg-accent-bright transition-colors"
        >
          <UploadCloud size={16} />
          <span className="hidden sm:inline">Add Song</span>
        </button>

        {user && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-base-panel hover:bg-base-cardHover text-white text-sm font-semibold flex items-center justify-center transition-colors"
              aria-label="Account menu"
              title={user.name}
            >
              {user.name?.[0]?.toUpperCase() || '?'}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-11 z-30 w-48 bg-base-card border border-base-border rounded-xl shadow-2xl py-2 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-base-border">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-white hover:bg-base-cardHover transition-colors"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
