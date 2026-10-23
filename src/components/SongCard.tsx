import React from 'react';
import { Play, Pause, Plus, Download, Disc, Check } from 'lucide-react';
import { Song } from '../types/saavn';

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  onOpenLyrics?: (song: Song) => void;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying,
  isCurrent,
  onPlay,
  onAddToQueue,
}) => {
  const [downloading, setDownloading] = React.useState(false);
  const [queued, setQueued] = React.useState(false);

  const image =
    song.image.find((img) => img.quality === '500x500') ||
    song.image.find((img) => img.quality === '150x150') ||
    song.image[0];

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!song.downloadUrl || !song.downloadUrl.length) return;
    setDownloading(true);

    // Pick best quality (320 -> 160 -> 96)
    const best =
      song.downloadUrl.find((d) => d.quality === '320kbps') ||
      song.downloadUrl.find((d) => d.quality === '160kbps') ||
      song.downloadUrl[0];

    try {
      // Use proxy or direct URL
      const streamUrl = `/api/stream?url=${encodeURIComponent(best.url)}`;
      const res = await fetch(streamUrl);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${song.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${best.quality}.m4a`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback direct window download
      window.open(best.url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToQueue(song);
    setQueued(true);
    setTimeout(() => setQueued(false), 1500);
  };

  const artistNames =
    song.artists.primary.map((a) => a.name).join(', ') || 'Various Artists';

  return (
    <div
      onClick={() => onPlay(song)}
      className={`group relative p-3 rounded-2xl transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
        isCurrent
          ? 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
          : 'bg-zinc-900/60 hover:bg-zinc-850 border-zinc-800/80 hover:border-zinc-700/80'
      }`}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 shadow-md">
        {image?.url ? (
          <img
            src={image.url}
            alt={song.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <Disc className="w-12 h-12" />
          </div>
        )}

        {/* Duration badge */}
        {song.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono font-medium text-zinc-200">
            {formatDuration(song.duration)}
          </div>
        )}

        {/* Quality indicator pill */}
        {song.downloadUrl && song.downloadUrl.length > 0 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md text-[10px] font-semibold text-emerald-300">
            320k
          </div>
        )}

        {/* Play overlay button */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(song);
            }}
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl transform transition-transform hover:scale-110 active:scale-95"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div>
          <h4
            className={`font-semibold text-sm line-clamp-1 transition-colors ${
              isCurrent ? 'text-emerald-400' : 'text-zinc-100 group-hover:text-white'
            }`}
            title={song.name}
          >
            {song.name}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5" title={artistNames}>
            {artistNames}
          </p>
          {song.album.name && (
            <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
              {song.album.name}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-zinc-400 text-xs">
          <span className="capitalize text-[11px] font-medium text-zinc-500">
            {song.language || 'Music'}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handleQueue}
              title="Add to Up Next queue"
              className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              {queued ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleDownload}
              title="Download high-quality AAC track"
              disabled={downloading}
              className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-emerald-400 transition-colors"
            >
              {downloading ? (
                <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
