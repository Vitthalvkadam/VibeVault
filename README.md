# Wavelength — a Spotify-style music app (React + Vite)

A frontend music streaming app: browse a demo catalog, upload your own local
audio files, build playlists, search, and control playback with a full
bottom player — all built with React, Tailwind CSS, the Context API, and the
HTML5 Audio API.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
 ├── components/       Sidebar, Navbar, MusicPlayer, SongCard, AlbumCard,
 │                      PlaylistCard, ProgressBar, VolumeControl,
 │                      UploadSongForm, AddToPlaylistMenu
 ├── pages/             Home, Search, Library, Uploads, Playlist
 ├── context/           MusicContext.jsx — global player/queue/upload/playlist state
 ├── data/              songs.js — demo catalog (royalty-free demo tracks)
 ├── utils/             formatTime.js
 ├── App.jsx            layout + routes
 └── main.jsx           entry point
```

## How it works

- **State management**: `MusicContext` uses `useReducer` for the current
  song, queue, play state, volume, uploaded songs, and playlists. A single
  `<audio>` element (kept in a ref) is wired up to that state via effects.
- **Uploads**: choosing a file in "Add Song" creates an object URL with
  `URL.createObjectURL()`, reads its duration, and adds it to the library.
  Song metadata (title, artist, album, cover, duration) is saved to
  `localStorage`. Browsers don't allow persisting the actual audio bytes
  behind a `blob:` URL, so after a full page reload the metadata is still
  there but the file itself needs to be re-uploaded to play again — the UI
  flags this clearly on any song that lost its audio.
- **Playlists**: stored in `localStorage` as `{ id, name, description, songs }`.
  Add songs from any song card's `+` menu; remove them from a playlist's page.
- **Search**: filters the combined catalog + uploads by title/artist/album
  instantly as you type, with filters for songs/artists/your uploads.
- **Responsive layout**: the sidebar collapses behind a hamburger menu on
  mobile/tablet, the song grid re-flows by breakpoint, and the player bar
  compacts its layout below `sm`.

## Notes

- The demo catalog uses freely-licensed SoundHelix sample tracks and
  placeholder cover art so the app is playable immediately — swap in your
  own catalog in `src/data/songs.js` any time.
- No backend is required; everything runs client-side.
