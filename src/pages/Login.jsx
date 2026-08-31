import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AudioLines, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = login({ email, password })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-black px-4 py-10 relative overflow-hidden">
      {/* Ambient glow background, consistent with app's accent color */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-fadeIn">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <AudioLines className="text-accent" size={32} strokeWidth={2.4} />
            <span className="font-display font-bold text-2xl tracking-tight text-white">Wavelength</span>
          </div>
          <p className="text-muted text-sm">Welcome back. Let's get you listening.</p>
        </div>

        <div className="bg-base-panel border border-base-border rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-white mb-6">Log in</h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-base-cardHover rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none border border-transparent focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-base-cardHover rounded-lg pl-10 pr-10 py-2.5 text-sm text-white outline-none border border-transparent focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 bg-accent hover:bg-accent-bright disabled:opacity-60 text-black font-semibold text-sm rounded-full px-4 py-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Log in
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-semibold hover:text-accent transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}
