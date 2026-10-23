import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
  Mic2,
  Heart,
  Download,
  SlidersHorizontal,
  AlertTriangle,
} from 'lucide-react';
import { Song, QualityLink } from '../types/saavn';

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenLyrics: () => void;
  onToggleQueue: () => void;
  isQueueOpen: boolean;
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSong,
  isPlaying,
  queue,
  onTogglePlay,
  onNext,
  onPrev,
  onOpenLyrics,
  onToggleQueue,
  isQueueOpen,
  favorites,
  onToggleFavorite,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isShuffle, setIsShuffle] = useState(false);
  const [qualityIndex, setQualityIndex] = useState<number>(0);
  const [userSelectedQuality, setUserSelectedQuality] = useState<string>('auto');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string>('');

  // Ordered fallback URLs from best to lowest (320kbps -> 160 -> 96 -> 48 -> 12)
  const sortedQualities: QualityLink[] = React.useMemo(() => {
    if (!currentSong?.downloadUrl?.length) return [];
    const order = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
    return [...currentSong.downloadUrl].sort((a, b) => {
      const idxA = order.indexOf(a.quality);
      const idxB = order.indexOf(b.quality);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
  }, [currentSong]);

  // Handle song change
  useEffect(() => {
    if (!currentSong) return;
    setErrorMessage(null);
    setQualityIndex(0);

    if (sortedQualities.length > 0) {
      let targetLink = sortedQualities[0];
      if (userSelectedQuality !== 'auto') {
        const found = sortedQualities.find((q) => q.quality === userSelectedQuality);
        if (found) targetLink = found;
      }
      setActiveUrl(targetLink.url);
    }
  }, [currentSong, userSelectedQuality, sortedQualities]);

  // Audio Play/Pause sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback intercepted or audio not ready:', err);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, activeUrl]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Fallback Quality Ladder implementation (from KIRU-OP repo fbdcf11)
  const handleAudioError = useCallback(() => {
    if (!sortedQualities.length) {
      setErrorMessage('Audio unavailable for this track');
      return;
    }

    const nextIdx = qualityIndex + 1;
    if (nextIdx < sortedQualities.length) {
      console.warn(`Falling back from ${sortedQualities[qualityIndex].quality} to ${sortedQualities[nextIdx].quality}`);
      setQualityIndex(nextIdx);
      setActiveUrl(sortedQualities[nextIdx].url);
      setErrorMessage(`Switched to ${sortedQualities[nextIdx].quality} (higher bitrate unavailable)`);
      setTimeout(() => setErrorMessage(null), 3500);
    } else {
      setErrorMessage('Playback failed for all available audio bitrates');
    }
  }, [qualityIndex, sortedQualities]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      onNext();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const cycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const isFav = currentSong ? favorites.includes(currentSong.id) : false;

  const currentImage =
    currentSong?.image.find((i) => i.quality === '150x150') ||
    currentSong?.image[0];

  const currentBitrate = sortedQualities[qualityIndex]?.quality || '320kbps';

  if (!currentSong) return null;

  return (
    <aside aria-label="Audio player" className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 shadow-2xl px-4 py-3">
      {/* Hidden native audio element */}
      {activeUrl ? (
        <audio
          ref={audioRef}
          src={activeUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={handleAudioError}
          preload="auto"
        />
      ) : null}

      {/* Fallback Notice Banner */}
      {errorMessage && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-950/90 border border-amber-600/40 rounded-full text-xs font-medium text-amber-300 flex items-center gap-1.5 shadow-lg animate-fadeIn">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Progress Bar (Scrubber) */}
      <div
        onClick={handleSeek}
        className="group relative w-full h-1.5 -top-3 cursor-pointer py-1"
      >
        <div className="w-full h-1 bg-zinc-800 group-hover:h-1.5 rounded-full overflow-hidden transition-all duration-150">
          <div
            className="h-full bg-emerald-500 group-hover:bg-emerald-400 transition-all rounded-full relative"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Song Details */}
        <div className="flex items-center gap-3 min-w-[200px] max-w-[28%]">
          {currentImage?.url ? (
            <img
              src={currentImage.url}
              alt={currentSong.name}
              className="w-13 h-13 rounded-xl object-cover shadow-md border border-zinc-800 flex-shrink-0"
            />
          ) : null}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-zinc-100 truncate" title={currentSong.name}>
                {currentSong.name}
              </h4>
              <button
                onClick={() => onToggleFavorite(currentSong.id)}
                className="text-zinc-500 hover:text-rose-500 transition-colors p-1"
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-zinc-400 truncate">
              {currentSong.artists.primary.map((a) => a.name).join(', ') || 'Unknown Artist'}
            </p>
            {currentSong.album.name && (
              <p className="text-[11px] text-zinc-500 truncate">{currentSong.album.name}</p>
            )}
          </div>
        </div>

        {/* Center: Controls & Timers */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-xl">
          <div className="flex items-center gap-4">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2 rounded-full transition-colors ${
                isShuffle ? 'text-emerald-400 bg-emerald-950/40' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={onPrev}
              className="p-2 text-zinc-300 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="p-2 text-zinc-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-emerald-400 bg-emerald-950/40' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Time tracker */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Quality ladder, Lyrics, Queue, Volume */}
        <div className="flex items-center gap-3 min-w-[200px] justify-end">
          {/* Quality Ladder Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="px-2 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-[11px] font-mono font-medium text-emerald-400 flex items-center gap-1"
              title="Change audio bitrate or fallback mode"
            >
              <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
              <span>{currentBitrate}</span>
            </button>

            {showQualityMenu && (
              <div className="absolute bottom-full mb-2 right-0 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-1 text-xs z-50">
                <div className="px-2 py-1 text-[10px] text-zinc-400 font-medium uppercase tracking-wider border-b border-zinc-800">
                  Audio Quality Ladder
                </div>
                <button
                  onClick={() => {
                    setUserSelectedQuality('auto');
                    setShowQualityMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    userSelectedQuality === 'auto'
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span>Auto (Fallback)</span>
                  <span className="text-[10px] text-emerald-500 font-mono">Recommended</span>
                </button>
                {['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setUserSelectedQuality(q);
                      setShowQualityMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      userSelectedQuality === q
                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{q}</span>
                    {q === currentBitrate && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lyrics Button */}
          <button
            onClick={onOpenLyrics}
            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-850 transition-colors"
            title="View Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue Drawer Button */}
          <button
            onClick={onToggleQueue}
            className={`p-2 rounded-lg transition-colors relative ${
              isQueueOpen
                ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
            title="Up Next Queue"
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-bold flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 group">
            <button
              onClick={toggleMute}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-18 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
