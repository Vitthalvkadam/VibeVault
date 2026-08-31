import { useEffect, useRef } from 'react'
import { useMusic } from '../context/MusicContext'

// Loads the official YouTube IFrame Player API script exactly once, no matter
// how many times this component mounts (React StrictMode double-invokes effects).
let apiPromise = null
function loadYouTubeIframeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      resolve(window.YT)
    }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return apiPromise
}

/**
 * Mounts a small, always-present YouTube IFrame player and wires it into
 * MusicContext via an imperative controller (registerYtController). Kept
 * visually tiny and tucked into a corner so it doesn't disrupt the existing
 * local-player UI, while remaining a genuine, visible embed per YouTube's
 * Terms of Service (no hidden/headless playback).
 */
export default function YouTubePlayer() {
  const { currentSong, registerYtController, reportYtProgress, reportYtEnded, reportYtPlayState } = useMusic()
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const pollRef = useRef(null)
  const loadedVideoIdRef = useRef(null)

  const isYoutubeActive = currentSong?.source === 'youtube'

  useEffect(() => {
    let cancelled = false

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !containerRef.current) return

      const player = new YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        playerVars: {
          playsinline: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            playerRef.current = player
            registerYtController({
              getVideoId: () => loadedVideoIdRef.current,
              load: (videoId, autoplay) => {
                loadedVideoIdRef.current = videoId
                if (autoplay) player.loadVideoById(videoId)
                else player.cueVideoById(videoId)
              },
              play: () => player.playVideo?.(),
              pause: () => player.pauseVideo?.(),
              seekTo: (time) => player.seekTo?.(time, true),
              setVolume: (v) => player.setVolume?.(Math.round(v * 100)),
            })
          },
          onStateChange: (event) => {
            const YTState = window.YT.PlayerState
            if (event.data === YTState.PLAYING) {
              reportYtPlayState(true)
              startPolling()
            } else if (event.data === YTState.PAUSED) {
              reportYtPlayState(false)
              stopPolling()
            } else if (event.data === YTState.ENDED) {
              stopPolling()
              reportYtEnded()
            }
          },
        },
      })
    })

    function startPolling() {
      stopPolling()
      pollRef.current = setInterval(() => {
        const player = playerRef.current
        if (!player?.getCurrentTime) return
        const current = player.getCurrentTime() || 0
        const duration = player.getDuration() || 0
        reportYtProgress(current, duration)
      }, 500)
    }

    function stopPolling() {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    return () => {
      cancelled = true
      stopPolling()
    }
    // Player is created once; MusicContext talks to it via the registered controller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`fixed z-10 bottom-24 right-3 sm:bottom-28 sm:right-5 rounded-lg overflow-hidden border border-base-border shadow-player bg-black transition-all duration-300 ${
        isYoutubeActive ? 'w-28 h-16 sm:w-36 sm:h-20 opacity-100' : 'w-0 h-0 opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isYoutubeActive}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
