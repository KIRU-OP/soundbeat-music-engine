import React, { useState } from 'react';
import {
  X,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Headphones,
} from 'lucide-react';
import { UserProfile } from '../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  defaultEmail?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultEmail = 'shivampatel425685@gmail.com',
}) => {
  const [googleEmail, setGoogleEmail] = useState(defaultEmail);
  const [googleName, setGoogleName] = useState('Shivam Patel');
  const [loading, setLoading] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `google_${Date.now()}`,
        name: googleName.trim() || 'Shivam Patel',
        email: googleEmail.trim() || defaultEmail,
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        plan: '100% Free',
        joinedDate: 'October 2026',
        likedSongsCount: 56,
        playlistsCount: 8,
        bio: 'Good music. Better vibes. 🎵',
      };
      onLoginSuccess(newUser);
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-zinc-100 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center pt-2 space-y-2">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-xl shadow-emerald-950/60">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span>SoundBeat Ultra</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Sign In with <span className="text-emerald-400">Google</span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            1-Click authentication with your Gmail account to sync playlists, favorites, and 320k Lossless streaming.
          </p>
        </div>

        {/* Google Card / Account Preview */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              alt=""
              className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">{googleName}</span>
              <span className="text-[11px] text-zinc-400 font-mono block truncate">
                {googleEmail}
              </span>
            </div>
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="text-[10px] text-emerald-400 hover:underline font-mono"
            >
              {isCustomizing ? 'Done' : 'Edit'}
            </button>
          </div>

          {isCustomizing && (
            <div className="pt-2 border-t border-zinc-800 space-y-2 animate-fadeIn">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Gmail Address</label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Google Sign-in Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold text-sm flex items-center justify-center gap-3 shadow-2xl transition-transform active:scale-95 cursor-pointer border border-zinc-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fast, secure, and no password/OTP required</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-zinc-500 text-center border-t border-zinc-900 pt-3">
          By signing in, you agree to SoundBeat Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
