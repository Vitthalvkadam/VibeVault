import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { demoSongs } from '../data/songs'

const MusicContext = createContext(null)

const STORAGE_KEYS = {
  uploads: 'wavelength:uploads',
  playlists: 'wavelength:playlists',
  volume: 'wavelength:volume',
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const initialState = {
  allSongs: demoSongs,
  uploadedSongs: loadJSON(STORAGE_KEYS.uploads, []),
  playlists: loadJSON(STORAGE_KEYS.playlists, []),
  queue: [],
  queueIndex: -1,
  currentSong: null,
  isPlaying: false,
  volume: loadJSON(STORAGE_KEYS.volume, 0.8),
  progress: 0,
  duration: 0,
  ytReady: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'PLAY_SONG': {
      const { song, queue } = action.payload
      const list = queue && queue.length ? queue : [song]
      const idx = list.findIndex((s) => s.id === song.id)
      return {
        ...state,
        currentSong: song,
        queue: list,
        queueIndex: idx === -1 ? 0 : idx,
        isPlaying: true,
      }
    }
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    case 'NEXT': {
      if (!state.queue.length) return state
      const nextIndex = (state.queueIndex + 1) % state.queue.length
      return { ...state, queueIndex: nextIndex, currentSong: state.queue[nextIndex], isPlaying: true }
    }
    case 'PREV': {
      if (!state.queue.length) return state
      const prevIndex = (state.queueIndex - 1 + state.queue.length) % state.queue.length
      return { ...state, queueIndex: prevIndex, currentSong: state.queue[prevIndex], isPlaying: true }
    }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'YT_READY':
      return { ...state, ytReady: true }
    case 'ADD_UPLOAD':
      return { ...state, uploadedSongs: [action.payload, ...state.uploadedSongs] }
    case 'DELETE_UPLOAD': {
      const uploadedSongs = state.uploadedSongs.filter((s) => s.id !== action.payload)
      const isCurrent = state.currentSong && state.currentSong.id === action.payload
      return {
        ...state,
        uploadedSongs,
        currentSong: isCurrent ? null : state.currentSong,
        isPlaying: isCurrent ? false : state.isPlaying,
      }
    }
    case 'CREATE_PLAYLIST':
      return { ...state, playlists: [action.payload, ...state.playlists] }
    case 'DELETE_PLAYLIST':
      return { ...state, playlists: state.playlists.filter((p) => p.id !== action.payload) }
    case 'ADD_TO_PLAYLIST': {
      const { playlistId, song } = action.payload
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === playlistId && !p.songs.find((s) => s.id === song.id)
            ? { ...p, songs: [...p.songs, song] }
            : p,
        ),
      }
    }
    case 'REMOVE_FROM_PLAYLIST': {
      const { playlistId, songId } = action.payload
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === playlistId ? { ...p, songs: p.songs.filter((s) => s.id !== songId) } : p,
        ),
      }
    }
    default:
      return state
  }
}

export function MusicProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const audioRef = useRef(new Audio())
  // Imperative handle to the YouTube IFrame Player, registered by YouTubePlayer.jsx.
  // Kept as a ref (not state) since the player instance itself isn't serializable/reactive.
  const ytControllerRef = useRef(null)
  // Mirrors state.currentSong so the memoized `actions` object (created once)
  // can always read the latest song without becoming stale.
  const currentSongRef = useRef(state.currentSong)
  useEffect(() => {
    currentSongRef.current = state.currentSong
  }, [state.currentSong])

  // Persist uploads / playlists / volume
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.uploads, JSON.stringify(
      state.uploadedSongs.map(({ audioFile, ...rest }) => rest), // don't persist blob URLs
    ))
  }, [state.uploadedSongs])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(state.playlists))
  }, [state.playlists])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.volume, JSON.stringify(state.volume))
  }, [state.volume])

  // Wire the actual <audio> element (local songs) and the YouTube IFrame player
  // (youtube songs) to state. Only one of the two is ever "live" at a time.
  useEffect(() => {
    const audio = audioRef.current
    const yt = ytControllerRef.current
    if (!state.currentSong) return

    if (state.currentSong.source === 'youtube') {
      // Make sure local playback is silent while a YouTube song is current.
      audio.pause()
      if (!yt) return
      if (yt.getVideoId() !== state.currentSong.videoId) {
        yt.load(state.currentSong.videoId, state.isPlaying)
        return
      }
      if (state.isPlaying) yt.play()
      else yt.pause()
    } else {
      // Make sure the YouTube player is silent while a local song is current.
      yt?.pause()
      if (audio.src !== state.currentSong.audioFile) {
        audio.src = state.currentSong.audioFile
      }
      if (state.isPlaying) {
        audio.play().catch(() => dispatch({ type: 'SET_PLAYING', payload: false }))
      } else {
        audio.pause()
      }
    }
  }, [state.currentSong, state.isPlaying, state.ytReady])

  useEffect(() => {
    audioRef.current.volume = state.volume
    ytControllerRef.current?.setVolume(state.volume)
  }, [state.volume])

  useEffect(() => {
    const audio = audioRef.current
    const onTime = () => dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime })
    const onLoaded = () => dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 })
    const onEnded = () => dispatch({ type: 'NEXT' })
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const actions = useMemo(
    () => ({
      playSong: (song, queue) => dispatch({ type: 'PLAY_SONG', payload: { song, queue } }),
      togglePlay: () => dispatch({ type: 'TOGGLE_PLAY' }),
      next: () => dispatch({ type: 'NEXT' }),
      prev: () => dispatch({ type: 'PREV' }),
      setVolume: (v) => dispatch({ type: 'SET_VOLUME', payload: v }),
      seek: (time) => {
        if (currentSongRef.current?.source === 'youtube') {
          ytControllerRef.current?.seekTo(time)
        } else {
          audioRef.current.currentTime = time
        }
        dispatch({ type: 'SET_PROGRESS', payload: time })
      },
      // Called once by YouTubePlayer.jsx when the IFrame API is ready.
      registerYtController: (controller) => {
        ytControllerRef.current = controller
        dispatch({ type: 'YT_READY' })
      },
      // Called on an interval by YouTubePlayer.jsx while a YouTube song is playing.
      reportYtProgress: (current, duration) => {
        dispatch({ type: 'SET_PROGRESS', payload: current })
        dispatch({ type: 'SET_DURATION', payload: duration })
      },
      reportYtEnded: () => dispatch({ type: 'NEXT' }),
      // Keeps state.isPlaying in sync if the user pauses/plays from the YT player itself.
      reportYtPlayState: (playing) => dispatch({ type: 'SET_PLAYING', payload: playing }),
      addUpload: (song) => dispatch({ type: 'ADD_UPLOAD', payload: song }),
      deleteUpload: (id) => dispatch({ type: 'DELETE_UPLOAD', payload: id }),
      createPlaylist: (playlist) => dispatch({ type: 'CREATE_PLAYLIST', payload: playlist }),
      deletePlaylist: (id) => dispatch({ type: 'DELETE_PLAYLIST', payload: id }),
      addToPlaylist: (playlistId, song) => dispatch({ type: 'ADD_TO_PLAYLIST', payload: { playlistId, song } }),
      removeFromPlaylist: (playlistId, songId) =>
        dispatch({ type: 'REMOVE_FROM_PLAYLIST', payload: { playlistId, songId } }),
    }),
    [],
  )

  const library = useMemo(
    () => [...state.allSongs, ...state.uploadedSongs],
    [state.allSongs, state.uploadedSongs],
  )

  const value = { ...state, library, ...actions }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider')
  return ctx
}
