import { useRef, useState } from 'react'
import { UploadCloud, Music2, Image as ImageIcon } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

const ACCEPTED_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
]

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
]

export default function UploadSongForm() {
  const { addUpload } = useMusic()

  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [error, setError] = useState('')

  function handleFileChange(e) {
    const selected = e.target.files?.[0]

    if (!selected) return

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Please choose an MP3, WAV, or OGG audio file.')
      return
    }

    setError('')
    setFile(selected)

    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''))
    }
  }

  function handleImageChange(e) {
    const image = e.target.files?.[0]

    if (!image) return

    if (!ACCEPTED_IMAGE_TYPES.includes(image.type)) {
      setError('Please choose a JPG, PNG or WEBP image.')
      return
    }

    setError('')

    const reader = new FileReader()

    reader.onloadend = () => {
      setCoverImage(reader.result)
    }

    reader.readAsDataURL(image)
  }

  function resetForm() {
    setFile(null)
    setTitle('')
    setArtist('')
    setAlbum('')
    setCoverImage('')
    setError('')

    if (fileInputRef.current) fileInputRef.current.value = ''
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!file) {
      setError('Choose an audio file to upload.')
      return
    }

    if (!title.trim()) {
      setError('Give the song a title.')
      return
    }

    const audioURL = URL.createObjectURL(file)
    const tempAudio = new Audio(audioURL)

    const finalizeUpload = (duration) => {
      addUpload({
        id: crypto.randomUUID(),
        title: title.trim(),
        artist: artist.trim() || 'Unknown Artist',
        album: album.trim() || 'Uploaded Songs',
        coverImage:
          coverImage ||
          `https://picsum.photos/seed/${encodeURIComponent(title)}/400/400`,
        audioFile: audioURL,
        duration: duration || 0,
        uploadedBy: 'you',
      })

      resetForm()
    }

    tempAudio.addEventListener('loadedmetadata', () =>
      finalizeUpload(tempAudio.duration)
    )

    tempAudio.addEventListener('error', () => finalizeUpload(0))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-base-panel rounded-xl p-5 max-w-xl">
      {/* Audio Upload */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-base-border hover:border-accent rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
      >
        {file ? (
          <>
            <Music2 className="text-accent mb-2" size={28} />
            <p className="text-sm font-medium truncate max-w-full">
              {file.name}
            </p>
            <p className="text-xs text-muted mt-1">
              Click to choose another song
            </p>
          </>
        ) : (
          <>
            <UploadCloud className="text-muted mb-2" size={28} />
            <p className="text-sm font-medium">
              Click to select an audio file
            </p>
            <p className="text-xs text-muted mt-1">MP3, WAV or OGG</p>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <div className="sm:col-span-2">
          <label className="text-xs text-muted uppercase tracking-wide">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song title"
            className="w-full mt-1 bg-base-cardHover rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="text-xs text-muted uppercase tracking-wide">
            Artist
          </label>

          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name"
            className="w-full mt-1 bg-base-cardHover rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="text-xs text-muted uppercase tracking-wide">
            Album
          </label>

          <input
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="Album name"
            className="w-full mt-1 bg-base-cardHover rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Cover Image Upload */}
        <div className="sm:col-span-2">
          <label className="text-xs text-muted uppercase tracking-wide">
            Upload Cover Image (Optional)
          </label>

          <div
            onClick={() => imageInputRef.current?.click()}
            className="mt-2 border border-base-border rounded-lg p-4 cursor-pointer hover:border-accent transition-colors flex flex-col items-center"
          >
            {coverImage ? (
              <>
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-28 h-28 rounded-lg object-cover mb-2"
                />
                <p className="text-xs text-muted">
                  Click to change image
                </p>
              </>
            ) : (
              <>
                <ImageIcon size={30} className="text-muted mb-2" />
                <p className="text-sm">Click to upload cover image</p>
                <p className="text-xs text-muted mt-1">
                  JPG, PNG or WEBP
                </p>
              </>
            )}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 mt-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-4 bg-accent hover:bg-accent-bright text-black font-semibold text-sm rounded-full px-5 py-2.5 transition-colors"
      >
        Add to library
      </button>
    </form>
  )
}