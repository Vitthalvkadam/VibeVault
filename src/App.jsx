import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import MusicPlayer from './components/MusicPlayer'
import YouTubePlayer from './components/YouTubePlayer'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import Uploads from './pages/Uploads'
import Playlist from './pages/Playlist'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useAuth } from './context/AuthContext'

// Everything a signed-in user sees: sidebar, navbar, routed pages, and the
// persistent local + YouTube players. Redirects to /login when signed out.
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto thin-scrollbar">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/uploads" element={<Uploads />} />
            <Route path="/playlist/:id" element={<Playlist />} />
          </Routes>
        </main>

        <MusicPlayer />
        <YouTubePlayer />
      </div>
    </div>
  )
}

// Keeps already-signed-in users out of /login and /signup.
function GuestOnly({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestOnly>
            <Signup />
          </GuestOnly>
        }
      />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  )
}
