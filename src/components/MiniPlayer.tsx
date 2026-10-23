import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Heart,
  Disc,
  Mic2,
  SkipForward,
  SkipBack,
  SlidersHorizontal,
  Volume2,
} from 'lucide-react';
import { Song, QualityLink } from '../types/saavn';

interface MiniPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev?: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenLyrics: () => void;
  onOpenArtist?: (artistName: string) => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  favorites,
  onToggleFavorite,
  onOpenLyrics,
  onOpenArtist,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeUrl, setActiveUrl] = useState('');
  const [qualityIndex, setQualityIndex] = useState(0);

  // Sorted qualities: 320 -> 160 -> 96 -> 48 -> 12
  const sortedQualities: QualityLink[] = React.useMemo(() => {
    if (!currentSong?.downloadUrl?.length) return [];
    const order = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
    return [...currentSong.downloadUrl].sort((a, b) => {
      const idxA = order.indexOf(a.quality);
      const idxB = order.indexOf(b.quality);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong) return;
    setQualityIndex(0);
    if (sortedQualities.length > 0) {
      setActiveUrl(sortedQualities[0].url);
    }
  }, [currentSong, sortedQualities]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((e) => console.warn('Playback error:', e));
    } else {
      audio.pause();
    }
  }, [isPlaying, activeUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * audioRef.current.duration;
  };

  // Fallback quality ladder (KIRU-OP innovation)
  const handleAudioError = () => {
    const next = qualityIndex + 1;
    if (next < sortedQualities.length) {
      console.log(`Fallback to ${sortedQualities[next].quality}`);
      setQualityIndex(next);
      setActiveUrl(sortedQualities[next].url);
    }
  };

  if (!currentSong) return null;

  const isLiked = favorites.includes(currentSong.id);
  const img =
    currentSong.image.find((i) => i.quality === '150x150') || currentSong.image[0];
  const primaryArtist =
    currentSong.artists?.primary?.[0]?.name ||
    currentSong.artists?.all?.[0]?.name ||
    'SoundBeat Artist';

  const currentBitrate = sortedQualities[qualityIndex]?.quality || '320kbps';

  return (
    <div className="fixed bottom-16 left-3 right-3 max-w-2xl mx-auto z-40 animate-slideUp">
      <audio
        ref={audioRef}
        src={activeUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        onError={handleAudioError}
        preload="auto"
      />

      {/* Mini Player Container matching Screenshot with Next-Gen Visualizer */}
      <div className="bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl shadow-2xl p-2.5 flex items-center justify-between gap-3 relative overflow-hidden">
        {/* Top subtle glow */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-400/40 to-emerald-500/0" />

        {/* Left: Thumbnail, Track Info & Equalizer */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            onClick={onOpenLyrics}
            className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 shrink-0 cursor-pointer shadow-md group"
            title="Tap for Lyrics & Details"
          >
            {img ? (
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Disc className="w-6 h-6 m-auto text-zinc-600" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Mic2 className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Audio Waveform Equalizer when playing */}
            {isPlaying && (
              <div className="absolute bottom-1 right-1 flex items-end gap-0.5 bg-black/60 px-1 py-0.5 rounded backdrop-blur-sm">
                <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4
                onClick={onOpenLyrics}
                className="text-sm font-bold text-white truncate cursor-pointer hover:text-emerald-400 transition-colors"
                title={currentSong.name}
              >
                {currentSong.name}
              </h4>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono font-bold shrink-0">
                {currentBitrate}
              </span>
            </div>

            <p
              onClick={() => onOpenArtist && onOpenArtist(primaryArtist)}
              className="text-xs text-zinc-400 truncate cursor-pointer hover:underline mt-0.5"
              title={primaryArtist}
            >
              {primaryArtist}
            </p>

            {/* Scrubber Progress Bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1 bg-zinc-800 hover:h-1.5 rounded-full mt-2 cursor-pointer transition-all overflow-hidden"
            >
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Heart / Like, Lyrics, and Big Neon Green Play Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenLyrics}
            className="p-1.5 text-zinc-400 hover:text-emerald-400 transition-colors"
            title="Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFavorite(currentSong.id)}
            className="p-1.5 text-zinc-400 hover:text-emerald-400 transition-colors"
            title={isLiked ? 'Liked' : 'Like'}
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? 'fill-emerald-400 text-emerald-400' : 'text-zinc-400'
              }`}
            />
          </button>

          {/* Big Neon Green Circular Button */}
          <button
            onClick={onTogglePlay}
            className="w-11 h-11 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black flex items-center justify-center shadow-lg shadow-emerald-950/60 transition-transform hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
