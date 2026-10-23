import React, { useEffect, useState } from 'react';
import { X, Mic2, AlertCircle, Copy, Check } from 'lucide-react';
import { Song } from '../types/saavn';

interface LyricsModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({ song, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [snippet, setSnippet] = useState<string | null>(null);
  const [copyright, setCopyright] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !song) return;
    setLoading(true);
    setError(null);
    setLyrics(null);

    fetch(`/api/songs/${song.id}/lyrics`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Lyrics unavailable for this song');
        }
        setLyrics(json.data.lyrics);
        setSnippet(json.data.snippet);
        setCopyright(json.data.copyright);
      })
      .catch((err) => {
        setError(err.message || 'Could not fetch lyrics');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, song]);

  if (!isOpen || !song) return null;

  const handleCopy = () => {
    if (!lyrics) return;
    navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const image = song.image.find((i) => i.quality === '500x500') || song.image[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            {image?.url && (
              <img
                src={image.url}
                alt={song.name}
                className="w-12 h-12 rounded-lg object-cover shadow border border-zinc-700/50"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-zinc-100 line-clamp-1">{song.name}</h3>
              </div>
              <p className="text-xs text-zinc-400">
                {song.artists.primary.map((a) => a.name).join(', ') || 'Various Artists'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lyrics && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Copy lyrics"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700">
          {loading && (
            <div className="py-16 text-center text-zinc-400">
              <div className="w-8 h-8 mx-auto mb-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Fetching verified lyrics from JioSaavn...</p>
            </div>
          )}

          {error && !loading && (
            <div className="py-16 text-center px-4">
              <AlertCircle className="w-10 h-10 mx-auto text-amber-400/80 mb-3" />
              <p className="text-zinc-200 font-medium mb-1">{error}</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Not all songs have timed or text lyrics in the JioSaavn catalog. Try playing another track or exploring suggestions.
              </p>
            </div>
          )}

          {lyrics && !loading && (
            <div className="space-y-4">
              {snippet && (
                <div className="p-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-xs text-emerald-400 font-mono">
                  Snippet: "{snippet}"
                </div>
              )}
              <div
                className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2 select-text"
                dangerouslySetInnerHTML={{
                  __html: lyrics.replace(/\n/g, '<br/>'),
                }}
              />
              {copyright && (
                <p className="text-[11px] text-zinc-500 pt-4 border-t border-zinc-800 italic">
                  Lyrics copyright: {copyright}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
