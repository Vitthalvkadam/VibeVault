// YouTube Data API v3 search service.
// Uses the official /search endpoint only — no download/scrape/mp3-extraction of any kind.
// Playback happens later via the official YouTube IFrame Player (see components/YouTubePlayer.jsx).

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

export const YT_ERROR = {
  MISSING_KEY: 'SOMETHING IS WRONG',
  QUOTA: 'QUOTA',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
}

/**
 * Normalize a raw YouTube search item into the shape used across the app.
 */
function normalizeItem(item) {
  const videoId = item.id?.videoId
  if (!videoId) return null
  const snippet = item.snippet || {}
  const thumbnail =
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.default?.url ||
    ''

  return {
    id: videoId,
    videoId,
    title: snippet.title || 'Untitled',
    artist: snippet.channelTitle || 'YouTube',
    // Kept for compatibility with existing song-card UI (album/coverImage fields).
    album: 'YouTube',
    coverImage: thumbnail,
    thumbnail,
    duration: 0,
    source: 'youtube',
  }
}

/**
 * Search YouTube for embeddable videos matching `query`.
 * Returns { results, error } — never throws, so callers can render state directly.
 */
export async function searchYouTube(query, { maxResults = 12, signal } = {}) {
  const q = query?.trim()
  if (!q) return { results: [], error: null }

  if (!API_KEY) {
    return { results: [], error: YT_ERROR.MISSING_KEY }
  }

  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true',
    maxResults: String(maxResults),
    q,
    key: API_KEY,
  })

  try {
    const res = await fetch(`${SEARCH_URL}?${params.toString()}`, { signal })

    if (!res.ok) {
      let reason = YT_ERROR.UNKNOWN
      try {
        const body = await res.json()
        const status = body?.error?.errors?.[0]?.reason || body?.error?.status
        if (res.status === 403 && /quota/i.test(JSON.stringify(body))) {
          reason = YT_ERROR.QUOTA
        } else if (status === 'quotaExceeded' || status === 'dailyLimitExceeded') {
          reason = YT_ERROR.QUOTA
        }
      } catch {
        // ignore parse failure, fall back to UNKNOWN
      }
      return { results: [], error: reason }
    }

    const data = await res.json()
    const results = (data.items || []).map(normalizeItem).filter(Boolean)
    return { results, error: null }
  } catch (err) {
    if (err?.name === 'AbortError') {
      // Search was superseded by a newer keystroke — not a real error.
      return { results: [], error: null, aborted: true }
    }
    return { results: [], error: YT_ERROR.NETWORK }
  }
}

/**
 * Hook-friendly debounce helper: wraps searchYouTube so rapid keystrokes only
 * trigger one network request ~400-500ms after the user stops typing.
 * Returns a debounced function; call it with (query, callback).
 */
export function createDebouncedYouTubeSearch(delay = 450) {
  let timer = null
  let controller = null

  function run(query, callback) {
    if (timer) clearTimeout(timer)
    if (controller) controller.abort()

    timer = setTimeout(async () => {
      controller = new AbortController()
      const outcome = await searchYouTube(query, { signal: controller.signal })
      if (!outcome.aborted) callback(outcome)
    }, delay)
  }

  run.cancel = () => {
    if (timer) clearTimeout(timer)
    if (controller) controller.abort()
  }

  return run
}
