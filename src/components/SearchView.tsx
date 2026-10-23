import React, { useState } from 'react';
import { Search, X, Play, Music, Flame, Sparkles } from 'lucide-react';
import { Song } from '../types/saavn';

interface SearchViewProps {
  onPlaySong: (song: Song) => void;
  onOpenArtist?: (artistName: string) => void;
}

const BROWSE_CATEGORIES = [
  { name: 'Bollywood Hits', color: 'from-amber-600 to-orange-800', query: 'bollywood hits' },
  { name: 'Punjabi Heat', color: 'from-purple-600 to-pink-800', query: 'punjabi 2026' },
  { name: 'Telugu Blockbusters', color: 'from-emerald-600 to-teal-800', query: 'telugu hits' },
  { name: 'Lo-Fi & Chill', color: 'from-blue-600 to-indigo-900', query: 'lofi hindi' },
  { name: 'Indian Hip-Hop', color: 'from-red-600 to-rose-900', query: 'desi hip hop krsna' },
  { name: 'Romantic Melodies', color: 'from-pink-600 to-rose-800', query: 'arijit romantic' },
  { name: 'Bhojpuri Dhamaka', color: 'from-yellow-600 to-amber-800', query: 'bhojpuri hits' },
  { name: 'Tamil Vibes', color: 'from-cyan-600 to-blue-800', query: 'anirudh tamil' },
];

export const SearchView: React.FC<SearchViewProps> = ({ onPlaySong, onOpenArtist }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setQuery(term);
    setLoading(true);
    try {
      const res = await fetch(`/api/search/songs?query=${encodeURIComponent(term)}&limit=20&sort=relevance`);
      const data = await res.json();
      if (data.success && data.data?.results) {
        setResults(data.data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-32">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight pt-1">
        Search
      </h1>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Songs, artists, albums, or podcasts..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-zinc-500 space-y-2">
          <div className="w-7 h-7 mx-auto border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Searching JioSaavn...</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Top Results</h2>
          <div className="space-y-1.5">
            {results.map((song) => {
              const img = song.image.find((i) => i.quality === '150x150') || song.image[0];
              const artist = song.artists.primary.map((a) => a.name).join(', ');
              return (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 cursor-pointer border border-zinc-800/60 group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {img?.url && (
                      <img src={img.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-400">
                        {song.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">{artist}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Browse All Categories Grid if not searching */}
      {!query && (
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-white">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {BROWSE_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleSearch(cat.query)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${cat.color} h-24 relative overflow-hidden cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between`}
              >
                <span className="font-extrabold text-sm text-white drop-shadow-md">
                  {cat.name}
                </span>
                <span className="text-[10px] text-white/80 font-medium">Tap to play</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
