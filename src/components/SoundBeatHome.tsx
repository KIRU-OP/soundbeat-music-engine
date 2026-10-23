import React, { useState, useEffect } from 'react';
import {
  Cast,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  Flame,
  Radio,
  Heart,
  Volume2,
  TrendingUp,
  Disc,
  Clock,
  Music2,
  CheckCircle,
  Headphones,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { Song } from '../types/saavn';
import { UserProfile } from '../types/auth';

interface SoundBeatHomeProps {
  user: UserProfile | null;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onOpenArtist: (artistId: string, artistName: string) => void;
  onPlaySong: (song: Song) => void;
  onPlayCategory: (category: string) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

// 6 Featured Cards matching the screenshot
const FEATURED_CARDS = [
  {
    id: 'daily_mix',
    title: 'Daily Mix',
    subtitle: 'Your daily dose of vibes',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    tag: 'Daily Mix',
    query: 'daily mix hindi english',
    gradient: 'from-amber-600/30 to-orange-950/80',
  },
  {
    id: 'telugu_hits',
    title: 'Telugu Hits',
    subtitle: 'Blockbuster tracks',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    tag: 'Telugu Hits',
    query: 'telugu hits anirudh',
    gradient: 'from-emerald-600/30 to-teal-950/80',
  },
  {
    id: 'hindi_vibes',
    title: 'Hindi Vibes',
    subtitle: 'Feel the emotions',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    tag: 'Hindi Vibes',
    query: 'hindi romantic melodies',
    gradient: 'from-rose-600/30 to-pink-950/80',
  },
  {
    id: 'punjabi_heat',
    title: 'Punjabi Heat',
    subtitle: 'Bhangra to Badshah',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
    tag: 'Punjabi Heat',
    query: 'punjabi hits diljit',
    gradient: 'from-orange-600/30 to-red-950/80',
  },
  {
    id: 'lofi_nights',
    title: 'Lo-Fi Nights',
    subtitle: 'Chill • Study • Relax',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    tag: 'Lo-Fi Nights',
    query: 'lofi chill beats',
    gradient: 'from-indigo-600/30 to-slate-950/80',
  },
  {
    id: 'trending_now',
    title: 'Trending Now',
    subtitle: 'Latest & Hottest',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending Now',
    query: 'trending chart 2026',
    gradient: 'from-purple-600/30 to-zinc-950/80',
  },
];

// Made For You playlists
const MADE_FOR_YOU = [
  {
    id: 'anirudh',
    title: 'Anirudh Special',
    type: 'Playlist',
    count: '50 songs',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    artistName: 'Anirudh Ravichander',
    artistId: '455454',
  },
  {
    id: 'romantic',
    title: 'Romantic Vibes',
    type: 'Playlist',
    count: '45 songs',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&auto=format&fit=crop&q=80',
    artistName: 'Arijit Singh',
    artistId: '455130',
  },
  {
    id: 'chill',
    title: 'Chill Beats',
    type: 'Playlist',
    count: '60 songs',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    artistName: 'AP Dhillon',
    artistId: '8812560',
  },
  {
    id: 'feelgood',
    title: 'Feel Good Hits',
    type: 'Playlist',
    count: '55 songs',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
    artistName: 'Badshah',
    artistId: '456073',
  },
];

// Top Trending Artists in India
const TOP_ARTISTS = [
  {
    id: '455454',
    name: 'Anirudh Ravichander',
    role: 'Music Director • Rockstar',
    listeners: '18.4M',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '455130',
    name: 'Arijit Singh',
    role: 'Playback Singer',
    listeners: '34.2M',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '455662',
    name: 'Diljit Dosanjh',
    role: 'Global Punjabi Icon',
    listeners: '21.8M',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '455132',
    name: 'Shreya Ghoshal',
    role: 'Melody Queen',
    listeners: '19.6M',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: '8812560',
    name: 'KR$NA',
    role: 'Lyrical Hip-Hop King',
    listeners: '8.5M',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
];

// Regional languages
const INDIAN_LANGUAGES = [
  { id: 'hindi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'telugu', label: 'Telugu', native: 'తెలుగు' },
  { id: 'punjabi', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { id: 'tamil', label: 'Tamil', native: 'தமிழ்' },
  { id: 'bhojpuri', label: 'Bhojpuri', native: 'भोजपुरी' },
  { id: 'english', label: 'English', native: 'Global' },
  { id: 'malayalam', label: 'Malayalam', native: 'മലയാളം' },
  { id: 'kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'marathi', label: 'Marathi', native: 'मराठी' },
  { id: 'gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'bengali', label: 'Bengali', native: 'বাংলা' },
  { id: 'rajasthani', label: 'Rajasthani', native: 'राजस्थानी' },
];

export const SoundBeatHome: React.FC<SoundBeatHomeProps> = ({
  user,
  onOpenLogin,
  onOpenProfile,
  onOpenArtist,
  onPlaySong,
  onPlayCategory,
  currentSong,
  isPlaying,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedLang, setSelectedLang] = useState('hindi');
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };

  const greeting = getGreeting();

  // Load regional trending feed
  useEffect(() => {
    setLoadingTrending(true);
    fetch(`/api/songs/new-releases?language=${selectedLang}&limit=8`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setTrendingSongs(d.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingTrending(false));
  }, [selectedLang]);

  return (
    <div className="max-w-2xl mx-auto space-y-7 pb-36">
      {/* Top Header matching Screenshot */}
      <div className="flex items-center justify-between pt-1 pb-1">
        {/* SoundBeat Brand Logo with live sound equalizer */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="w-1 h-6 bg-emerald-400 rounded-full" />
            <span className="w-1 h-4.5 bg-emerald-400 rounded-full" />
            <span className="w-1 h-7 bg-emerald-400 rounded-full" />
            <span className="w-1 h-3 bg-emerald-400 rounded-full" />
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black tracking-wider text-white">
              SOUNDBEAT
            </span>
            <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold block -mt-1">
              Ultra • 320k Lossless
            </span>
          </div>
        </div>

        {/* Right Actions: Cast & User Avatar */}
        <div className="flex items-center gap-3">
          <button
            title="Cast to device"
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Cast className="w-5 h-5" />
          </button>

          {/* User Profile Avatar / Login Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="relative p-0.5 rounded-full ring-2 ring-emerald-400/90 hover:scale-105 transition-transform"
              title={`${user.name} Profile`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md transition-transform hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Greeting Heading */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Good <span className="text-emerald-400">{greeting}</span>
          {user && <span className="text-zinc-300 font-medium text-2xl">, {user.name.split(' ')[0]}</span>}
        </h1>
        <p className="text-sm text-zinc-400 font-medium">Good music. Better vibes. 🎵</p>
      </div>

      {/* 2-Column Grid of 6 Featured Cards (Exact layout from screenshot) */}
      <div className="grid grid-cols-2 gap-3">
        {FEATURED_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => onPlayCategory(card.query)}
            className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 cursor-pointer shadow-xl hover:border-zinc-700 transition-all flex flex-col justify-between aspect-[1.12]"
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
            </div>

            {/* Soundwave badge top-left */}
            <div className="relative z-10 p-3">
              <div className="w-5 h-5 rounded-md flex items-center gap-0.5">
                <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full" />
                <span className="w-0.5 h-4 bg-emerald-400 rounded-full" />
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full" />
              </div>
            </div>

            {/* Center Artistic Title in Card */}
            <div className="relative z-10 px-3 -mt-3">
              <span className="font-serif italic text-lg md:text-xl font-bold text-white drop-shadow-lg tracking-wide block">
                {card.tag}
              </span>
            </div>

            {/* Bottom Strip with Green Play Button, Title & Chevron */}
            <div className="relative z-10 p-2.5 bg-zinc-950/85 backdrop-blur-md border-t border-zinc-800/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-500 group-hover:bg-emerald-400 text-black flex items-center justify-center shrink-0 shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate">{card.title}</h3>
                  <p className="text-[10px] text-zinc-400 truncate">{card.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* "Made for you" Section (Matching Screenshot) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="relative">
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Made for you
            </h2>
            <div className="w-10 h-0.5 bg-emerald-400 rounded-full mt-1" />
          </div>

          <button
            onClick={() => onPlayCategory('popular playlists 2026')}
            className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 flex items-center gap-0.5 transition-colors"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Scroll / Grid of Playlists */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MADE_FOR_YOU.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.artistName) {
                  onOpenArtist(item.artistId, item.artistName);
                }
              }}
              className="group cursor-pointer space-y-2 bg-zinc-900/50 hover:bg-zinc-850 p-2.5 rounded-2xl border border-zinc-800/60 hover:border-zinc-700 transition-all"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 shadow-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                {/* Top-right soundwave badge */}
                <div className="absolute top-2 right-2 flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-emerald-400 rounded-full" />
                  <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>

                {/* Center title style */}
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="font-serif italic font-bold text-white text-xs drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-zinc-400 line-clamp-1">
                  {item.type} • {item.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgraded Section 1: Regional New Releases & Launch Feed with Language Pills */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Trending Releases in {INDIAN_LANGUAGES.find((l) => l.id === selectedLang)?.label}
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            320k Studio Master
          </span>
        </div>

        {/* 12 Indian Languages Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {INDIAN_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md shadow-emerald-950/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                <span>{lang.label}</span>
                <span className="ml-1 opacity-60 text-[10px]">({lang.native})</span>
              </button>
            );
          })}
        </div>

        {/* Trending Songs List */}
        {loadingTrending ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-zinc-900/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {trendingSongs.slice(0, 6).map((song, idx) => {
              const isCurrent = currentSong?.id === song.id;
              const img = song.image.find((i) => i.quality === '150x150') || song.image[0];
              const isLiked = favorites.includes(song.id);
              return (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer group ${
                    isCurrent
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-900/50 hover:bg-zinc-850 border border-zinc-800/60 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-xs font-mono text-zinc-500 group-hover:hidden">
                      {idx + 1}
                    </span>
                    <button className="w-5 hidden group-hover:flex items-center justify-center text-emerald-400">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {img && (
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
                        {song.artists?.primary?.map((a) => a.name).join(', ') || 'SoundBeat Track'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(song.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-emerald-400 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? 'fill-emerald-400 text-emerald-400' : ''
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-mono text-zinc-500">
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
        )}
      </div>

      {/* Upgraded Section 2: Top Artists in India with Discography Links */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Top Artists
            </h2>
          </div>
          <span className="text-xs text-zinc-500">Tap to view verified profile</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {TOP_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => onOpenArtist(artist.id, artist.name)}
              className="flex flex-col items-center text-center p-2 rounded-2xl bg-zinc-900/40 hover:bg-zinc-850/80 border border-zinc-800/60 hover:border-zinc-700 cursor-pointer transition-all group"
            >
              <div className="relative w-18 h-18 md:w-20 md:h-20 rounded-full overflow-hidden shadow-lg border-2 border-zinc-800 group-hover:border-emerald-500 transition-all">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h4 className="text-xs font-bold text-white truncate w-full mt-2 group-hover:text-emerald-400 transition-colors">
                {artist.name}
              </h4>
              <p className="text-[10px] text-zinc-400 truncate w-full">
                {artist.listeners} Listeners
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
