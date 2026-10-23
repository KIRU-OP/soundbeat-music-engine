import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Crown,
  Heart,
  ListMusic,
  Headphones,
  LogOut,
  Edit3,
  Check,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { UserProfile } from '../types/auth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  likedCount: number;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenContact?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  likedCount,
  onUpdateUser,
  onLogout,
  onOpenContact,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      bio,
      avatar,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-zinc-100 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">User Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          {/* Avatar with Ring */}
          <div className="relative group">
            <img
              src={avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-3 border-emerald-500 shadow-xl shadow-emerald-950/60"
            />
            {isEditing && (
              <div className="flex gap-2 mt-3 justify-center">
                {AVATAR_PRESETS.map((p, idx) => (
                  <img
                    key={idx}
                    src={p}
                    alt=""
                    onClick={() => setAvatar(p)}
                    className={`w-8 h-8 rounded-full object-cover cursor-pointer border-2 transition-all ${
                      avatar === p ? 'border-emerald-400 scale-110' : 'border-zinc-700 opacity-60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-1 w-full">
            {isEditing ? (
              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-center bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-center bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
                  placeholder="Music Bio / Tagline"
                />
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold flex items-center gap-1.5 mx-auto hover:bg-emerald-400"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {user.bio && <p className="text-xs text-zinc-400">{user.bio}</p>}
                <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono mt-1.5">
                  {user.email && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{user.email}</span>
                      <Check className="w-3 h-3 text-emerald-400" />
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Free Account Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free Forever • Unlimited Streaming</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-zinc-900/80 rounded-2xl border border-zinc-800/80 text-center">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Liked Songs
            </span>
            <span className="text-base font-bold text-emerald-400 mt-0.5 block">
              {likedCount}
            </span>
          </div>
          <div className="border-x border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Playlists
            </span>
            <span className="text-base font-bold text-white mt-0.5 block">
              {user.playlistsCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Audio Quality
            </span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block font-mono">
              320 kbps
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          {onOpenContact && (
            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700/80 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>📢 Official Channels & Contact Support</span>
            </button>
          )}

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
