import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AudioLines, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = signup(form)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-black px-4 py-10 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-fadeIn">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <AudioLines className="text-accent" size={32} strokeWidth={2.4} />
            <span className="font-display font-bold text-2xl tracking-tight text-white">Wavelength</span>
          </div>
          <p className="text-muted text-sm">Create your account and start listening.</p>
        </div>

        <div className="bg-base-panel border border-base-border rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-white mb-6">Sign up</h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Your name"
                  className="w-full bg-base-cardHover rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none border border-transparent focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                />
              </div>
            </div>

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
                  value={form.email}
                  onChange={update('email')}
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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update('password')}
                  placeholder="At least 6 characters"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Re-enter your password"
                  className="w-full bg-base-cardHover rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none border border-transparent focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 bg-accent hover:bg-accent-bright disabled:opacity-60 text-black font-semibold text-sm rounded-full px-4 py-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Create account
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-accent transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
