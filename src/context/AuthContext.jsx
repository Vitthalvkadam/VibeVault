import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  users: 'wavelength:users',
  session: 'wavelength:session',
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function getUsers() {
  return loadJSON(STORAGE_KEYS.users, [])
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users))
}

// NOTE: this is a purely client-side demo auth system (localStorage only, no
// backend, no hashing library). Passwords are stored as-is in the browser's
// localStorage — fine for a local demo, not suitable for production use.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON(STORAGE_KEYS.session, null))

  const actions = useMemo(
    () => ({
      signup: ({ name, email, password, confirmPassword }) => {
        const trimmedName = name?.trim()
        const normalizedEmail = email?.trim().toLowerCase()

        if (!trimmedName || !normalizedEmail || !password || !confirmPassword) {
          return { ok: false, error: 'Please fill in every field.' }
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
          return { ok: false, error: 'Enter a valid email address.' }
        }
        if (password.length < 6) {
          return { ok: false, error: 'Password must be at least 6 characters.' }
        }
        if (password !== confirmPassword) {
          return { ok: false, error: 'Passwords do not match.' }
        }

        const users = getUsers()
        if (users.some((u) => u.email === normalizedEmail)) {
          return { ok: false, error: 'An account with this email already exists.' }
        }

        const newUser = { id: crypto.randomUUID(), name: trimmedName, email: normalizedEmail, password }
        saveUsers([...users, newUser])

        const session = { id: newUser.id, name: newUser.name, email: newUser.email }
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
        setUser(session)
        return { ok: true }
      },

      login: ({ email, password }) => {
        const normalizedEmail = email?.trim().toLowerCase()
        if (!normalizedEmail || !password) {
          return { ok: false, error: 'Please enter your email and password.' }
        }

        const users = getUsers()
        const match = users.find((u) => u.email === normalizedEmail && u.password === password)
        if (!match) {
          return { ok: false, error: 'Incorrect email or password.' }
        }

        const session = { id: match.id, name: match.name, email: match.email }
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
        setUser(session)
        return { ok: true }
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.session)
        setUser(null)
      },
    }),
    [],
  )

  const value = { user, isAuthenticated: Boolean(user), ...actions }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
