import React from 'react';
import {
  Heart,
  Clock,
  Plus,
  Play,
  ListMusic,
  User,
  Crown,
  Sparkles,
} from 'lucide-react';
import { Song } from '../types/saavn';
import { UserProfile } from '../types/auth';

interface LibraryViewProps {
  user: UserProfile | null;
  favorites: string[];
  allSongs: Song[];
  onPlaySong: (song: Song) => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onOpenContact?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  user,
  favorites,
  allSongs,
  onPlaySong,
  onOpenLogin,
  onOpenProfile,
  onOpenContact,
}) => {
  const likedSongs = allSongs.filter((s) => favorites.includes(s.id));

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Your Library
        </h1>
        {user ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-850 text-xs font-semibold text-zinc-300"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-400"
              />
            ) : null}
            <span>{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold"
          >
            Sign In
          </button>
        )}
      </div>

      {/* User Status Card */}
      {user && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{user.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700">
                  Free Account
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {favorites.length} Liked Songs • 320kbps High Fidelity
              </p>
            </div>
          </div>
          <button
            onClick={onOpenProfile}
            className="text-xs text-emerald-400 font-semibold hover:underline"
          >
            View Profile
          </button>
        </div>
      )}

      {/* Liked Songs Tile */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Liked Songs ({likedSongs.length})</span>
          </h2>
        </div>

        {likedSongs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-2">
            <Heart className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No liked songs yet.</p>
            <p className="text-[11px] text-zinc-500">
              Tap the heart icon on any song while listening to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {likedSongs.map((song) => {
              const img = song.image.find((i) => i.quality === '150x150') || song.image[0];
              return (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 cursor-pointer border border-zinc-800/60 group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {img?.url && (
                      <img
                        src={img.url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-400">
                        {song.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {song.artists.primary.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Playlists Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-emerald-400" />
            <span>Playlists</span>
          </h2>
          <button
            onClick={() => alert('New playlist created in your library!')}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              title: 'My Driving Mix',
              tracks: '24 songs',
              image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
            },
            {
              title: 'Late Night Chill',
              tracks: '38 songs',
              image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
            },
          ].map((pl, idx) => (
            <div
              key={idx}
              className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800 hover:border-zinc-700 cursor-pointer group"
            >
              <img
                src={pl.image}
                alt=""
                className="w-full aspect-square rounded-xl object-cover mb-2"
              />
              <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400">
                {pl.title}
              </h4>
              <p className="text-[10px] text-zinc-500">{pl.tracks}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Channels & Contact Banner */}
      {onOpenContact && (
        <div
          onClick={onOpenContact}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-lg group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Official Channels & Direct Support
              </h4>
              <p className="text-[11px] text-zinc-400">
                Join Telegram & WhatsApp channels, or send a message to the team
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold shrink-0">
            Open
          </button>
        </div>
      )}
    </div>
  );
};
