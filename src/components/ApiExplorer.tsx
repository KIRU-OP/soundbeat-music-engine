import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Copy,
  Check,
  Clock,
  Database,
  Code2,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Song } from '../types/saavn';

interface ApiExplorerProps {
  onPlaySong: (song: Song) => void;
}

interface EndpointConfig {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  category: 'Songs' | 'Search' | 'Albums' | 'Playlists' | 'Artists';
  defaultParams: Record<string, string>;
  isKiruOpSpecial?: boolean;
}

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'new-releases',
    name: 'New Releases Feed (KIRU-OP Special)',
    method: 'GET',
    path: '/api/songs/new-releases',
    description: 'Fetch new releases for any Indian language using JioSaavn launch data cookie',
    category: 'Songs',
    isKiruOpSpecial: true,
    defaultParams: {
      language: 'hindi',
      limit: '12',
    },
  },
  {
    id: 'search-songs',
    name: 'Search Songs with Spell Ranking',
    method: 'GET',
    path: '/api/search/songs',
    description: 'Search songs with automatic spelling variant matching and relevance scoring',
    category: 'Search',
    isKiruOpSpecial: true,
    defaultParams: {
      query: 'kesariya',
      page: '0',
      limit: '10',
      sort: 'relevance',
    },
  },
  {
    id: 'search-all',
    name: 'Global Autocomplete Search',
    method: 'GET',
    path: '/api/search',
    description: 'Fast autocomplete search across songs, albums, artists, and playlists',
    category: 'Search',
    defaultParams: {
      query: 'arijit',
    },
  },
  {
    id: 'song-details',
    name: 'Song Details & Decrypted Audio Links',
    method: 'GET',
    path: '/api/songs/:id',
    description: 'Fetch song details by ID with 5 DES-decrypted AAC audio qualities (12 to 320 kbps)',
    category: 'Songs',
    defaultParams: {
      id: 'aRZbUYD7',
    },
  },
  {
    id: 'song-suggestions',
    name: 'Song Suggestions & Radio',
    method: 'GET',
    path: '/api/songs/:id/suggestions',
    description: 'Retrieve similar tracks and radio queue based on a song ID',
    category: 'Songs',
    defaultParams: {
      id: 'aRZbUYD7',
    },
  },
  {
    id: 'song-lyrics',
    name: 'Song Lyrics',
    method: 'GET',
    path: '/api/songs/:id/lyrics',
    description: 'Get song lyrics text, snippet, and copyright',
    category: 'Songs',
    defaultParams: {
      id: 'aRZbUYD7',
    },
  },
  {
    id: 'search-albums',
    name: 'Search Albums',
    method: 'GET',
    path: '/api/search/albums',
    description: 'Search albums on JioSaavn by name',
    category: 'Albums',
    defaultParams: {
      query: 'rockstar',
      limit: '5',
    },
  },
  {
    id: 'search-playlists',
    name: 'Search Playlists',
    method: 'GET',
    path: '/api/search/playlists',
    description: 'Search curated playlists by genre, mood, or title',
    category: 'Playlists',
    defaultParams: {
      query: 'party hits',
      limit: '5',
    },
  },
  {
    id: 'repo-info',
    name: 'Repository Analysis & Schema',
    method: 'GET',
    path: '/api/repo-info',
    description: 'Audit report of KIRU-OP fork vs upstream, git commits, and tech specs',
    category: 'Search',
    isKiruOpSpecial: true,
    defaultParams: {},
  },
];

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ onPlaySong }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig>(ENDPOINTS[0]);
  const [params, setParams] = useState<Record<string, string>>(ENDPOINTS[0].defaultParams);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [payloadSize, setPayloadSize] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleSelectEndpoint = (ep: EndpointConfig) => {
    setSelectedEndpoint(ep);
    setParams(ep.defaultParams);
    setResponse(null);
    setLatency(null);
    setStatus(null);
  };

  const handleParamChange = (key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const buildUrl = () => {
    let url = selectedEndpoint.path;
    const queryParams = new URLSearchParams();

    for (const [k, v] of Object.entries(params)) {
      if (url.includes(`:${k}`)) {
        url = url.replace(`:${k}`, encodeURIComponent(v));
      } else if (v.trim()) {
        queryParams.append(k, v);
      }
    }

    const qs = queryParams.toString();
    return qs ? `${url}?${qs}` : url;
  };

  const currentUrl = buildUrl();
  const curlCommand = `curl -X ${selectedEndpoint.method} "${window.location.origin}${currentUrl}" -H "Accept: application/json"`;

  const handleExecute = async () => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();

    try {
      const res = await fetch(currentUrl);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setStatus(res.status);

      const json = await res.json();
      setResponse(json);

      const text = JSON.stringify(json);
      const bytes = new Blob([text]).size;
      setPayloadSize(bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`);
    } catch (err: any) {
      const end = performance.now();
      setLatency(Math.round(end - start));
      setStatus(500);
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyJson = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Find playable song from response if available
  const extractPlayableSongs = (): Song[] => {
    if (!response?.data) return [];
    if (Array.isArray(response.data)) {
      return response.data.filter((item: any) => item?.downloadUrl?.length > 0);
    }
    if (Array.isArray(response.data.results)) {
      return response.data.results.filter((item: any) => item?.downloadUrl?.length > 0);
    }
    if (response.data.id && response.data.downloadUrl?.length > 0) {
      return [response.data];
    }
    return [];
  };

  const playableSongs = extractPlayableSongs();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Terminal className="w-4 h-4" />
              <span>Interactive JioSaavn API Sandbox</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Test KIRU-OP / JioSaavn API Endpoints Live
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Inspect real-time responses from JioSaavn undocumented endpoints with DES-ECB link decryption, Hindi spelling ranking, and regional launch data feeds.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-2.5">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Engine Base</span>
              <span className="text-xs font-mono text-emerald-400">/api/*</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoint selector & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Endpoint List */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Available Endpoints
            </h3>
            <div className="space-y-1.5 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 pr-1">
              {ENDPOINTS.map((ep) => {
                const isSelected = ep.id === selectedEndpoint.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-start justify-between gap-2 border ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                        : 'bg-zinc-950/40 hover:bg-zinc-800/50 border-zinc-800/50 text-zinc-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-emerald-400">
                          {ep.method}
                        </span>
                        <span className="font-semibold truncate">{ep.name}</span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 mt-1 truncate">
                        {ep.path}
                      </p>
                    </div>
                    {ep.isKiruOpSpecial && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md whitespace-nowrap">
                        KIRU-OP
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameters Form */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Request Parameters
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono">
                {Object.keys(params).length} fields
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {selectedEndpoint.description}
            </p>

            <div className="space-y-3">
              {Object.keys(params).length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">
                  This endpoint requires no parameters.
                </p>
              ) : (
                Object.entries(params).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      {key}
                    </label>
                    {key === 'language' ? (
                      <select
                        value={val}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        {[
                          'hindi',
                          'punjabi',
                          'bhojpuri',
                          'english',
                          'tamil',
                          'telugu',
                          'marathi',
                          'gujarati',
                          'bengali',
                          'kannada',
                          'malayalam',
                          'rajasthani',
                        ].map((lang) => (
                          <option key={lang} value={lang}>
                            {lang.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    ) : key === 'sort' ? (
                      <select
                        value={val}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="relevance">relevance (best match first)</option>
                        <option value="latest">latest (newest releases first)</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Calling JioSaavn API...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: URL, cURL & Response Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Request URL & cURL Bar */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Target Request URL
              </span>
              <button
                onClick={handleCopyCurl}
                className="text-[11px] text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>cURL Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between gap-2 overflow-x-auto">
              <span className="text-xs font-mono text-emerald-400 whitespace-nowrap">
                {selectedEndpoint.method} {currentUrl}
              </span>
            </div>
          </div>

          {/* Response Box */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 shadow-sm flex flex-col min-h-[460px]">
            {/* Response Metrics Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-300">Response</span>
                {status !== null && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      status === 200
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {status} OK
                  </span>
                )}
                {latency !== null && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Clock className="w-3 h-3" />
                    {latency} ms
                  </span>
                )}
                {payloadSize && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Database className="w-3 h-3" />
                    {payloadSize}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {playableSongs.length > 0 && (
                  <button
                    onClick={() => onPlaySong(playableSongs[0])}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play Song #{playableSongs[0].name.slice(0, 15)}...</span>
                  </button>
                )}
                {response && (
                  <button
                    onClick={handleCopyJson}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Copy JSON Response"
                  >
                    {copiedJson ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Response Viewer */}
            <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800/80 p-4 font-mono text-xs text-zinc-300 overflow-auto max-h-[420px] scrollbar-thin scrollbar-thumb-zinc-700">
              {loading && (
                <div className="h-full flex flex-col items-center justify-center py-20 text-zinc-500 gap-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-sans">Connecting to JioSaavn API...</p>
                </div>
              )}

              {!loading && !response && (
                <div className="h-full flex flex-col items-center justify-center py-20 text-zinc-500 gap-2">
                  <Code2 className="w-8 h-8 text-zinc-600" />
                  <p className="text-xs font-sans">
                    Click "Send Request" to test this endpoint and view JSON output
                  </p>
                </div>
              )}

              {!loading && response && (
                <pre className="whitespace-pre-wrap select-text leading-relaxed">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
