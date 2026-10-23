import React, { useEffect, useState } from 'react';
import {
  X,
  Play,
  Pause,
  CheckCircle,
  Users,
  Radio,
  Share2,
  Disc,
  Clock,
  Heart,
  Plus,
} from 'lucide-react';
import { Song } from '../types/saavn';

interface ArtistProfileModalProps {
  artistId: string | null;
  artistName: string | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaySong: (song: Song) => void;
  currentSongId?: string;
  isPlaying?: boolean;
}

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artistId,
  artistName,
  isOpen,
  onClose,
  onPlaySong,
  currentSongId,
  isPlaying,
}) => {
  const [loading, setLoading] = useState(false);
  const [artistData, setArtistData] = useState<any>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!isOpen || (!artistId && !artistName)) return;
    setLoading(true);
    setArtistData(null);
    setSongs([]);

    // Strategy: First try /api/artists/:id if id is provided, or search songs by artistName
    const query = artistName || '';

    // Fetch songs by artist for direct playback
    fetch(`/api/search/songs?query=${encodeURIComponent(query)}&limit=15&sort=relevance`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.results) {
          setSongs(data.data.results);
        }
      })
      .catch((e) => console.error(e));

    // Fetch artist details
    const targetId = artistId || '455130'; // default fallback ID
    fetch(`/api/artists/${targetId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setArtistData(res.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [isOpen, artistId, artistName]);

  if (!isOpen) return null;

  const displayName = artistName || artistData?.name || 'Artist Profile';
  const displayImage =
    artistData?.image?.find((i: any) => i.quality === '500x500')?.url ||
    songs[0]?.image?.find((i: any) => i.quality === '500x500')?.url ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80';

  const followerCount = artistData?.followerCount || 14850230;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner with Artist Image */}
        <div className="relative h-64 md:h-76 w-full flex-shrink-0 bg-zinc-900 overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover object-top opacity-75"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Artist Header Info */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 fill-emerald-500 text-black" />
                <span>Verified Artist</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {displayName}
              </h1>
              <p className="text-xs text-zinc-300 font-medium flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>{followerCount.toLocaleString()} Monthly Listeners</span>
              </p>
            </div>

            {/* Actions: Play All & Follow */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (songs.length > 0) onPlaySong(songs[0]);
                }}
                className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-950/60 transition-transform hover:scale-105 active:scale-95"
              >
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </button>

              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  isFollowing
                    ? 'bg-zinc-800 text-white border-zinc-700'
                    : 'bg-white text-black border-white hover:bg-zinc-200'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content: Top Songs & Discography */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          {/* Top Songs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Popular Songs</h3>
              <span className="text-xs text-zinc-500 font-mono">{songs.length} tracks</span>
            </div>

            {loading && (
              <div className="py-12 text-center text-zinc-500">
                <div className="w-7 h-7 mx-auto mb-2 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs">Loading tracks...</p>
              </div>
            )}

            {!loading && songs.length === 0 && (
              <p className="text-xs text-zinc-500 py-6 text-center">
                No songs currently listed for this artist.
              </p>
            )}

            <div className="space-y-1.5">
              {songs.map((song, idx) => {
                const isCurrent = currentSongId === song.id;
                const img = song.image.find((i) => i.quality === '150x150') || song.image[0];
                return (
                  <div
                    key={song.id}
                    onClick={() => onPlaySong(song)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group ${
                      isCurrent
                        ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                        : 'hover:bg-zinc-900 border border-transparent text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 text-center text-xs font-mono text-zinc-500 group-hover:hidden">
                        {idx + 1}
                      </span>
                      <button className="w-5 hidden group-hover:flex items-center justify-center text-white">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {img?.url && (
                        <img
                          src={img.url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shadow"
                        />
                      )}

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isCurrent ? 'text-emerald-400' : 'text-white'
                          }`}
                        >
                          {song.name}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {song.album.name || song.language}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                      {song.playCount && (
                        <span className="hidden sm:inline">
                          {song.playCount.toLocaleString()} plays
                        </span>
                      )}
                      <span>
                        {song.duration
                          ? `${Math.floor(song.duration / 60)}:${(song.duration % 60)
                              .toString()
                              .padStart(2, '0')}`
                          : '--:--'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bio section if available */}
          {artistData?.bio && (
            <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">About</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{artistData.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
