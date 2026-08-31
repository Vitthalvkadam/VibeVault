export default function AlbumCard({ album, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-base-card hover:bg-base-cardHover rounded-xl p-4 transition-colors duration-200 animate-fadeIn"
    >
      <img
        src={album.coverImage}
        alt={album.name}
        className="w-full aspect-square object-cover rounded-lg shadow-lg mb-3"
        loading="lazy"
      />
      <p className="font-semibold text-sm truncate">{album.name}</p>
      <p className="text-xs text-muted truncate mt-1">{album.artist}</p>
    </button>
  )
}
