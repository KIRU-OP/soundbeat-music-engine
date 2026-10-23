import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  ListMusic,
  Code,
  Flame,
  CheckCircle,
  Radio,
  MessageCircle,
} from 'lucide-react';
import { Song } from './types/saavn';
import { UserProfile } from './types/auth';
import { SoundBeatHome } from './components/SoundBeatHome';
import { MiniPlayer } from './components/MiniPlayer';
import { SearchView } from './components/SearchView';
import { LibraryView } from './components/LibraryView';
import { LoginModal } from './components/LoginModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ArtistProfileModal } from './components/ArtistProfileModal';
import { LyricsModal } from './components/LyricsModal';
import { ApiExplorer } from './components/ApiExplorer';
import { ContactChannelsModal } from './components/ContactChannelsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library' | 'api'>('home');

  // User Auth State (Initialized with Shivam Patel / Gmail or localStorage)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('soundbeat_user');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      id: 'user_default',
      name: 'Shivam Patel',
      email: 'shivampatel425685@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      plan: '100% Free',
      joinedDate: 'Joined Today',
      likedSongsCount: 42,
      playlistsCount: 5,
      bio: 'Good music. Better vibes. 🎵',
    };
  });

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<{ id: string; name: string } | null>(null);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Audio Playback State
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [allLoadedSongs, setAllLoadedSongs] = useState<Song[]>([]);

  // Favorites / Liked
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soundbeat_favorites');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return ['qbQ0IFxj', 'aRZbUYD7', 'x8gA2kXk'];
  });

  // Save favorites & user profile
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('soundbeat_favorites', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    try {
      localStorage.setItem('soundbeat_user', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('soundbeat_user');
    } catch (_) {}
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    handleUpdateUser(newUser);
  };

  // Pre-load "Yeshanagula" by Anirudh Ravichander (from screenshot)
  useEffect(() => {
    fetch('/api/search/songs?query=Yeshanagula&limit=5')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.results?.length > 0) {
          const yeshanagula = d.data.results[0];
          setCurrentSong(yeshanagula);
          setQueue(d.data.results.slice(1));
          setAllLoadedSongs(d.data.results);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    setAllLoadedSongs((prev) => {
      if (!prev.find((s) => s.id === song.id)) return [song, ...prev];
      return prev;
    });
  };

  const handleNextSong = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setCurrentSong(next);
      setQueue((q) => q.slice(1));
      setIsPlaying(true);
    }
  };

  const handlePlayCategory = (categoryQuery: string) => {
    fetch(`/api/search/songs?query=${encodeURIComponent(categoryQuery)}&limit=15&sort=relevance`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.results?.length > 0) {
          handlePlaySong(d.data.results[0]);
          setQueue(d.data.results.slice(1));
          setAllLoadedSongs((prev) => [...d.data.results, ...prev]);
        }
      })
      .catch((e) => console.error(e));
  };

  const handleOpenArtist = (artistId: string, artistName: string) => {
    setSelectedArtist({ id: artistId, name: artistName });
    setIsArtistModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans select-none selection:bg-emerald-500 selection:text-black">
      {/* Top Banner info if API mode is desired */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          KIRU-OP JioSaavn Engine Active
        </span>

        <div className="flex items-center gap-2">
          {/* Channels & Contact Button */}
          <button
            onClick={() => setIsContactOpen(true)}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 border bg-zinc-900/90 hover:bg-zinc-850 text-emerald-400 border-emerald-500/30 transition-all shadow-sm cursor-pointer"
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>Channels & Contact</span>
          </button>

          {/* Discreet API Sandbox Switcher */}
          <button
            onClick={() => setActiveTab(activeTab === 'api' ? 'home' : 'api')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1 border transition-all ${
              activeTab === 'api'
                ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>{activeTab === 'api' ? 'Back to App' : 'API Inspector'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <main className="flex-1 px-4 py-2">
        {activeTab === 'home' && (
          <SoundBeatHome
            user={user}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenArtist={handleOpenArtist}
            onPlaySong={handlePlaySong}
            onPlayCategory={handlePlayCategory}
            currentSong={currentSong}
            isPlaying={isPlaying}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            onPlaySong={handlePlaySong}
            onOpenArtist={(name) => handleOpenArtist('455130', name)}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            user={user}
            favorites={favorites}
            allSongs={allLoadedSongs}
            onPlaySong={handlePlaySong}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        {activeTab === 'api' && (
          <div className="pt-2">
            <ApiExplorer onPlaySong={handlePlaySong} />
          </div>
        )}
      </main>

      {/* Mini Player fixed above bottom nav matching Screenshot */}
      <MiniPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNextSong}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onOpenArtist={(name) => handleOpenArtist('455454', name)}
      />

      {/* Bottom Navigation Bar matching Screenshot (Home, Search, Your Library) */}
      <nav aria-label="Main Navigation" className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-t border-zinc-900 px-6 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all py-1 ${
              activeTab === 'home' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-semibold">Home</span>
            {activeTab === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -mt-0.5" />
            )}
          </button>

          {/* Search */}
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-1 transition-all py-1 ${
              activeTab === 'search' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-semibold">Search</span>
            {activeTab === 'search' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -mt-0.5" />
            )}
          </button>

          {/* Your Library */}
          <button
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 transition-all py-1 ${
              activeTab === 'library' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ListMusic className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-semibold">Your Library</span>
            {activeTab === 'library' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Login Modal (Phone OTP + Google) */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultEmail="shivampatel425685@gmail.com"
      />

      {/* User Profile Modal */}
      {user && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          likedCount={favorites.length}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          onOpenContact={() => setIsContactOpen(true)}
        />
      )}

      {/* Artist Profile Modal */}
      <ArtistProfileModal
        isOpen={isArtistModalOpen}
        artistId={selectedArtist?.id || null}
        artistName={selectedArtist?.name || null}
        onClose={() => setIsArtistModalOpen(false)}
        onPlaySong={handlePlaySong}
        currentSongId={currentSong?.id}
        isPlaying={isPlaying}
      />

      {/* Lyrics Modal */}
      <LyricsModal
        song={currentSong}
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
      />

      {/* Contact & Official Channels Modal */}
      <ContactChannelsModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        userEmail={user?.email || 'shivampatel425685@gmail.com'}
      />
    </div>
  );
}
