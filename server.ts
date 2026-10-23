import express, { Request, Response } from 'express';
import forge from 'node-forge';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// User agents rotation matching repo
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
];

const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Helper for JioSaavn internal API
async function saavnFetch(callName: string, params: Record<string, any> = {}, cookie?: string) {
  const url = new URL('https://www.jiosaavn.com/api.php');
  url.searchParams.append('__call', callName);
  url.searchParams.append('_format', 'json');
  url.searchParams.append('_marker', '0');
  url.searchParams.append('api_version', '4');
  url.searchParams.append('ctx', 'web6dot0');

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'application/json',
  };
  if (cookie) {
    headers['Cookie'] = cookie;
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`JioSaavn request failed: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    // Sometimes JioSaavn returns leading/trailing junk
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
    }
    throw new Error('Failed to parse JioSaavn response');
  }
}

// DES-ECB Decryption logic (exact algorithm from KIRU-OP/jiosaavn-api)
export function createDownloadLinks(encryptedMediaUrl: string) {
  if (!encryptedMediaUrl) return [];
  const qualities = [
    { id: '_12', bitrate: '12kbps' },
    { id: '_48', bitrate: '48kbps' },
    { id: '_96', bitrate: '96kbps' },
    { id: '_160', bitrate: '160kbps' },
    { id: '_320', bitrate: '320kbps' },
  ];
  try {
    const key = '38346591';
    const iv = '00000000';
    const encrypted = forge.util.decode64(encryptedMediaUrl);
    const decipher = forge.cipher.createDecipher('DES-ECB', forge.util.createBuffer(key));
    decipher.start({ iv: forge.util.createBuffer(iv) });
    decipher.update(forge.util.createBuffer(encrypted));
    const success = decipher.finish();
    if (!success) return [];
    const decryptedLink = decipher.output.getBytes();
    return qualities.map((quality) => ({
      quality: quality.bitrate,
      url: decryptedLink.replace('_96', quality.id).replace(/^http:\/\//, 'https://'),
    }));
  } catch (e) {
    console.error('Decryption error:', e);
    return [];
  }
}

export function createImageLinks(link?: string) {
  if (!link) return [];
  const qualities = ['50x50', '150x150', '500x500'];
  const qualityRegex = /150x150|50x50/;
  const protocolRegex = /^http:\/\//;
  return qualities.map((quality) => ({
    quality,
    url: link.replace(qualityRegex, quality).replace(protocolRegex, 'https://'),
  }));
}

function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function createSongPayload(song: any) {
  const primaryArtists = song.more_info?.artistMap?.primary_artists?.map((a: any) => ({
    id: a.id,
    name: cleanText(a.name),
    role: a.role,
    type: a.type,
    image: createImageLinks(a.image),
    url: a.perma_url,
  })) || [];

  const featuredArtists = song.more_info?.artistMap?.featured_artists?.map((a: any) => ({
    id: a.id,
    name: cleanText(a.name),
    role: a.role,
    type: a.type,
    image: createImageLinks(a.image),
    url: a.perma_url,
  })) || [];

  const allArtists = song.more_info?.artistMap?.artists?.map((a: any) => ({
    id: a.id,
    name: cleanText(a.name),
    role: a.role,
    type: a.type,
    image: createImageLinks(a.image),
    url: a.perma_url,
  })) || [];

  return {
    id: song.id,
    name: cleanText(song.title || song.song),
    type: song.type || 'song',
    year: song.year || null,
    releaseDate: song.more_info?.release_date || null,
    duration: song.more_info?.duration ? Number(song.more_info.duration) : null,
    label: cleanText(song.more_info?.label) || null,
    explicitContent: song.explicit_content === '1',
    playCount: song.play_count ? Number(song.play_count) : null,
    language: song.language,
    hasLyrics: song.more_info?.has_lyrics === 'true',
    lyricsId: song.more_info?.lyrics_id || null,
    url: song.perma_url,
    copyright: cleanText(song.more_info?.copyright_text) || null,
    album: {
      id: song.more_info?.album_id || null,
      name: cleanText(song.more_info?.album) || null,
      url: song.more_info?.album_url || null,
    },
    artists: {
      primary: primaryArtists,
      featured: featuredArtists,
      all: allArtists,
    },
    image: createImageLinks(song.image),
    downloadUrl: createDownloadLinks(song.more_info?.encrypted_media_url),
  };
}

// Spelling variants and Ranking helper from KIRU-OP repo
const SPELLING_RULES: Array<[RegExp, string]> = [
  [/([bcdfghjklmnpqrstvwxyz])\1/g, '$1'],
  [/l(?=[aeiouy])/g, 'll'],
  [/n(?=[aeiouy])/g, 'nn'],
  [/ee/g, 'i'],
  [/oo/g, 'u'],
  [/ph/g, 'f'],
  [/aa/g, 'a'],
];

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

function createQueryVariants(query: string): string[] {
  const base = normalizeQuery(query);
  const variants = new Set<string>([query.trim()]);
  for (const [pattern, replacement] of SPELLING_RULES) {
    const variant = base.replace(pattern, replacement);
    if (variant !== base) variants.add(variant);
    if (variants.size >= 4) break;
  }
  return [...variants];
}

function looseKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .replace(/(.)\1+/g, '$1');
}

function stem(word: string): string {
  return word.length >= 6 ? word.slice(0, -2) : word;
}

function relevanceScore(song: any, query: string): number {
  const title = looseKey(cleanText(song.name));
  const artists = looseKey(
    cleanText((song.artists?.primary ?? []).map((a: any) => a.name).join(' '))
  );
  const haystack = `${title}${artists}`;
  const fullQuery = looseKey(query);
  if (!fullQuery) return 0;
  if (title.includes(fullQuery)) return 3;
  const words = normalizeQuery(query).split(' ').map(looseKey).filter(Boolean);
  if (words.every((w) => title.includes(stem(w)))) return 3;
  const hits = words.filter((w) => haystack.includes(w) || haystack.includes(stem(w))).length;
  if (hits === words.length) return 2;
  return hits > 0 ? 1 : 0;
}

function mergeAndRankSongs(resultLists: any[][], query: string, sort: 'relevance' | 'latest' = 'relevance'): any[] {
  const unique = new Map<string, any>();
  for (const list of resultLists) {
    for (const song of list) {
      if (!unique.has(song.id)) unique.set(song.id, song);
    }
  }
  return [...unique.values()]
    .map((song, index) => ({ song, index, relevance: relevanceScore(song, query) }))
    .sort((a, b) => {
      if (sort === 'latest') {
        const timeA = Date.parse(a.song.releaseDate || '') || (a.song.year ? Date.parse(`${a.song.year}-01-01`) : 0);
        const timeB = Date.parse(b.song.releaseDate || '') || (b.song.year ? Date.parse(`${b.song.year}-01-01`) : 0);
        return (
          timeB - timeA ||
          (b.song.playCount ?? 0) - (a.song.playCount ?? 0) ||
          a.index - b.index
        );
      }
      return (
        b.relevance - a.relevance ||
        (b.song.playCount ?? 0) - (a.song.playCount ?? 0) ||
        a.index - b.index
      );
    })
    .map(({ song }) => song);
}

// -------------------------------------------------------------
// API ENDPOINTS (Mirroring & Enhancing KIRU-OP/jiosaavn-api)
// -------------------------------------------------------------

// Autocomplete & All search
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, message: 'Missing query parameter' });
    }
    const raw = await saavnFetch('autocomplete.get', { query });
    const payload = {
      topQuery: {
        results: (raw.topquery?.data || []).map((item: any) => ({
          id: item.id,
          title: cleanText(item.title),
          image: createImageLinks(item.image),
          album: cleanText(item.more_info?.album),
          url: item.perma_url,
          type: item.type,
          language: item.more_info?.language,
          description: cleanText(item.description),
          primaryArtists: cleanText(item.more_info?.primary_artists),
          singers: cleanText(item.more_info?.singers),
        })),
        position: raw.topquery?.position,
      },
      songs: {
        results: (raw.songs?.data || []).map((song: any) => ({
          id: song.id,
          title: cleanText(song.title),
          image: createImageLinks(song.image),
          album: cleanText(song.more_info?.album),
          url: song.perma_url,
          type: song.type,
          description: cleanText(song.description),
          primaryArtists: cleanText(song.more_info?.primary_artists),
          singers: cleanText(song.more_info?.singers),
          language: song.more_info?.language,
        })),
        position: raw.songs?.position,
      },
      albums: {
        results: (raw.albums?.data || []).map((album: any) => ({
          id: album.id,
          title: cleanText(album.title),
          image: createImageLinks(album.image),
          artist: cleanText(album.more_info?.music),
          url: album.perma_url,
          type: album.type,
          description: cleanText(album.description),
          year: album.more_info?.year,
          songIds: album.more_info?.song_pids,
          language: album.more_info?.language,
        })),
        position: raw.albums?.position,
      },
      artists: {
        results: (raw.artists?.data || []).map((artist: any) => ({
          id: artist.id,
          title: cleanText(artist.title),
          image: createImageLinks(artist.image),
          type: artist.type,
          description: cleanText(artist.description),
          position: artist.position,
        })),
        position: raw.artists?.position,
      },
      playlists: {
        results: (raw.playlists?.data || []).map((playlist: any) => ({
          id: playlist.id,
          title: cleanText(playlist.title),
          image: createImageLinks(playlist.image),
          url: playlist.perma_url,
          type: playlist.type,
          language: playlist.more_info?.language,
          description: cleanText(playlist.description),
        })),
        position: raw.playlists?.position,
      },
    };
    return res.json({ success: true, data: payload });
  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Search songs with spelling variants & ranking
app.get('/api/search/songs', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, message: 'Missing query parameter' });
    }
    const page = Number(req.query.page || 0);
    const limit = Math.min(Number(req.query.limit || 20), 50);
    const sort = req.query.sort === 'latest' ? 'latest' : 'relevance';

    const variants = createQueryVariants(query);
    const rawResults = await Promise.all(
      variants.map((variant, index) =>
        saavnFetch('search.getResults', { q: variant, p: page, n: limit })
          .then((d) => d)
          .catch((err) => {
            if (index === 0) throw err;
            return null;
          })
      )
    );

    const songLists = rawResults
      .filter(Boolean)
      .map((d) => (d.results || []).map((item: any) => createSongPayload(item)));

    const rankedSongs = mergeAndRankSongs(songLists, query, sort).slice(0, limit);
    const total = Math.max(...rawResults.filter(Boolean).map((d) => Number(d.total || 0)));

    return res.json({
      success: true,
      data: {
        total,
        start: page * limit,
        results: rankedSongs,
      },
    });
  } catch (error: any) {
    console.error('Search songs error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Search albums
app.get('/api/search/albums', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || '').trim();
    const page = Number(req.query.page || 0);
    const limit = Number(req.query.limit || 20);
    const data = await saavnFetch('search.getAlbumResults', { q: query, p: page, n: limit });
    const results = (data.results || []).map((album: any) => ({
      id: album.id,
      name: cleanText(album.title),
      description: cleanText(album.header_desc),
      url: album.perma_url,
      year: album.year ? Number(album.year) : null,
      type: album.type,
      playCount: album.play_count ? Number(album.play_count) : null,
      language: album.language,
      explicitContent: album.explicit_content === '1',
      image: createImageLinks(album.image),
    }));
    return res.json({
      success: true,
      data: {
        total: Number(data.total || 0),
        start: Number(data.start || 0),
        results,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Search playlists
app.get('/api/search/playlists', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || '').trim();
    const page = Number(req.query.page || 0);
    const limit = Number(req.query.limit || 20);
    const data = await saavnFetch('search.getPlaylistResults', { q: query, p: page, n: limit });
    const results = (data.results || []).map((pl: any) => ({
      id: pl.id,
      name: cleanText(pl.title),
      type: pl.type,
      image: createImageLinks(pl.image),
      url: pl.perma_url,
      songCount: pl.more_info?.song_count ? Number(pl.more_info.song_count) : null,
      language: pl.more_info?.language,
      explicitContent: pl.explicit_content === '1',
    }));
    return res.json({
      success: true,
      data: {
        total: Number(data.total || 0),
        start: Number(data.start || 0),
        results,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Search artists
app.get('/api/search/artists', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || '').trim();
    const page = Number(req.query.page || 0);
    const limit = Number(req.query.limit || 20);
    const data = await saavnFetch('search.getArtistResults', { q: query, p: page, n: limit });
    const results = (data.results || []).map((artist: any) => ({
      id: artist.id,
      name: cleanText(artist.name || artist.title),
      role: artist.role,
      image: createImageLinks(artist.image),
      type: artist.type,
      url: artist.perma_url,
    }));
    return res.json({
      success: true,
      data: {
        total: Number(data.total || 0),
        start: Number(data.start || 0),
        results,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// KIRU-OP Key Feature: New releases feed from Launch Data with regional language cookie
app.get('/api/songs/new-releases', async (req: Request, res: Response) => {
  try {
    const language = String(req.query.language || 'hindi').toLowerCase();
    const limit = Math.min(Number(req.query.limit || 24), 50);

    const launch = await saavnFetch('webapi.getLaunchData', {}, `L=${language}`);
    const items = [...(launch.new_trending || []), ...(launch.new_albums || [])];
    const songIdSet = new Set<string>();

    for (const item of items) {
      if (item.type === 'song' && item.id) {
        songIdSet.add(item.id);
      } else if (item.more_info?.song_pids) {
        item.more_info.song_pids.split(',').forEach((id: string) => {
          const trimmed = id.trim();
          if (trimmed) songIdSet.add(trimmed);
        });
      }
    }

    const ids = [...songIdSet].slice(0, limit);
    if (!ids.length) {
      // Fallback search if launch feed is empty
      const searchFallback = await saavnFetch('search.getResults', { q: language, p: 0, n: limit });
      const songs = (searchFallback.results || []).map(createSongPayload);
      return res.json({ success: true, data: songs });
    }

    const songsData = await saavnFetch('song.getDetails', { pids: ids.join(',') });
    const rawList = songsData.songs || [];
    const orderMap = new Map(ids.map((id, idx) => [id, idx]));
    const songs = rawList
      .map(createSongPayload)
      .sort((a: any, b: any) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));

    return res.json({ success: true, data: songs });
  } catch (error: any) {
    console.error('New releases error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Song by ID
app.get('/api/songs/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await saavnFetch('song.getDetails', { pids: id });
    if (!data.songs?.length) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    const song = createSongPayload(data.songs[0]);
    return res.json({ success: true, data: song });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Song suggestions (webradio)
app.get('/api/songs/:id/suggestions', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // JioSaavn creates entity station first or calls webradio.getSong
    const stationRes = await saavnFetch('webradio.createEntityStation', { entity_id: `["${id}"]`, entity_type: 'queue' });
    const stationId = stationRes.stationid;
    if (!stationId) {
      // Fallback to search related
      return res.json({ success: true, data: [] });
    }
    const songRes = await saavnFetch('webradio.getSong', { stationid: stationId, k: 15, next: 1 });
    const suggestions: any[] = [];
    for (const [key, val] of Object.entries(songRes)) {
      if (val && typeof val === 'object' && (val as any).song) {
        suggestions.push(createSongPayload((val as any).song));
      }
    }
    return res.json({ success: true, data: suggestions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Song lyrics
app.get('/api/songs/:id/lyrics', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const songData = await saavnFetch('song.getDetails', { pids: id });
    const song = songData.songs?.[0];
    const lyricsId = song?.more_info?.lyrics_id;
    if (!lyricsId && song?.more_info?.has_lyrics !== 'true') {
      return res.status(404).json({ success: false, message: 'No lyrics available for this song' });
    }
    const targetLyricsId = lyricsId || id;
    const lyricsData = await saavnFetch('lyrics.getLyrics', { lyrics_id: targetLyricsId });
    if (!lyricsData || !lyricsData.lyrics) {
      return res.status(404).json({ success: false, message: 'Lyrics not found' });
    }
    return res.json({
      success: true,
      data: {
        lyrics: lyricsData.lyrics,
        snippet: lyricsData.snippet || cleanText(song?.more_info?.lyrics_snippet) || '',
        copyright: cleanText(lyricsData.copyright || song?.more_info?.copyright_text) || '',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Album details
app.get('/api/albums', async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const link = req.query.link as string;
    let data;
    if (id) {
      data = await saavnFetch('content.getAlbumDetails', { albumid: id });
    } else if (link) {
      const token = link.split('/').pop() || '';
      data = await saavnFetch('webapi.get', { token, type: 'album' });
    } else {
      return res.status(400).json({ success: false, message: 'Provide id or link parameter' });
    }
    if (!data || !data.title) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }
    const songs = (data.list || []).map(createSongPayload);
    const payload = {
      id: data.id,
      name: cleanText(data.title),
      year: data.year ? Number(data.year) : null,
      type: data.type,
      playCount: data.play_count ? Number(data.play_count) : null,
      language: data.language,
      explicitContent: data.explicit_content === '1',
      songCount: data.list_count ? Number(data.list_count) : songs.length,
      url: data.perma_url,
      image: createImageLinks(data.image),
      artists: {
        primary: data.artistMap?.primary_artists || [],
        featured: data.artistMap?.featured_artists || [],
        all: data.artistMap?.artists || [],
      },
      songs,
    };
    return res.json({ success: true, data: payload });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Playlist details
app.get('/api/playlists', async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const link = req.query.link as string;
    let data;
    if (id) {
      data = await saavnFetch('playlist.getDetails', { listid: id });
    } else if (link) {
      const token = link.split('/').pop() || '';
      data = await saavnFetch('webapi.get', { token, type: 'playlist' });
    } else {
      return res.status(400).json({ success: false, message: 'Provide id or link parameter' });
    }
    if (!data || !data.title) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    const songs = (data.list || []).map(createSongPayload);
    const payload = {
      id: data.id,
      name: cleanText(data.title),
      followerCount: data.follower_count ? Number(data.follower_count) : null,
      songCount: data.list_count ? Number(data.list_count) : songs.length,
      description: cleanText(data.header_desc),
      url: data.perma_url,
      image: createImageLinks(data.image),
      songs,
    };
    return res.json({ success: true, data: payload });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Artist details
app.get('/api/artists/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const page = Number(req.query.page || 0);
    const data = await saavnFetch('artist.getArtistPageDetails', { artistId: id, p: page });
    if (!data || !data.name) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }
    const topSongs = (data.topSongs || []).map(createSongPayload);
    const topAlbums = (data.topAlbums || []).map((album: any) => ({
      id: album.id,
      name: cleanText(album.title),
      year: album.year ? Number(album.year) : null,
      image: createImageLinks(album.image),
      url: album.perma_url,
    }));
    const payload = {
      id: data.artistId || id,
      name: cleanText(data.name),
      url: data.urls?.overview || data.perma_url,
      image: createImageLinks(data.image),
      followerCount: data.follower_count ? Number(data.follower_count) : null,
      isVerified: data.isVerified === 'true',
      dominantLanguage: data.dominantLanguage,
      bio: cleanText(data.bio),
      topSongs,
      topAlbums,
    };
    return res.json({ success: true, data: payload });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Audio Stream proxy route to guarantee seekability and prevent CDN CORS / referrer issues
app.get('/api/stream', async (req: Request, res: Response) => {
  try {
    const audioUrl = req.query.url as string;
    if (!audioUrl) {
      return res.status(400).send('Missing audio URL');
    }
    const range = req.headers.range;
    const fetchHeaders: Record<string, string> = {
      'User-Agent': getRandomUserAgent(),
      'Referer': 'https://www.jiosaavn.com/',
    };
    if (range) {
      fetchHeaders['Range'] = range;
    }

    const audioRes = await fetch(audioUrl, { headers: fetchHeaders });
    res.status(audioRes.status);
    audioRes.headers.forEach((val, key) => {
      if (['content-type', 'content-length', 'content-range', 'accept-ranges'].includes(key.toLowerCase())) {
        res.setHeader(key, val);
      }
    });
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (audioRes.body) {
      // @ts-ignore
      const reader = audioRes.body.getReader();
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (e: any) {
    console.error('Stream proxy error:', e);
    res.status(500).send(e.message);
  }
});

// Repository Metadata and Audit endpoint for the user's inquiry
app.get('/api/repo-info', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      repository: 'https://github.com/KIRU-OP/jiosaavn-api.git',
      upstream: 'https://github.com/sumitkolhe/jiosaavn-api.git',
      author: 'KIRU-OP (forked from Sumit Kolhe)',
      license: 'MIT',
      techStack: [
        'TypeScript 5.8+',
        'Hono / Express Node HTTP Server',
        'Zod & OpenAPI (Scalar API Reference)',
        'node-forge (Pure JS DES-ECB link decryption with key 38346591)',
        'Saavn Web API v4 (internal undocumented endpoints)',
      ],
      keyEnhancements: [
        {
          title: 'New Releases Feed (/api/songs/new-releases)',
          commit: 'd0d1709',
          description:
            'Extracts new_trending and new_albums from JioSaavn webapi.getLaunchData with language cookies (L=hindi, punjabi, etc.), resolves song PIDs, and returns formatted songs.',
          status: 'Active & Verified',
        },
        {
          title: '12 Indian Regional Languages',
          commit: 'b9775da',
          description:
            'Integrated 12 Indian regional language feeds (Hindi, Punjabi, Bhojpuri, English, Tamil, Telugu, Marathi, Gujarati, Bengali, Kannada, Malayalam, Rajasthani) with instant switching.',
          status: 'Active & Verified',
        },
        {
          title: 'Audio Quality Fallback Ladder',
          commit: 'fbdcf11',
          description:
            'Automatic fallback ladder: 320kbps -> 160kbps -> 96kbps -> 48kbps -> 12kbps so playback never fails even when maximum 320kbps is unavailable.',
          status: 'Active & Verified',
        },
        {
          title: 'Search Ranking & Hindi/Urdu Spelling Variants',
          commit: 'ffaeef8, 18474e3',
          description:
            'Generates phonetically equivalent variants (e.g. galiyan / galliyan / gali) and ranks songs by relevance score, word stem matching, and popularity playCount.',
          status: 'Active & Verified',
        },
        {
          title: 'Latest Sorting (sort=latest)',
          commit: '2f3e8aa',
          description:
            'Enables category and search feeds to sort tracks by release date so users discover new music faster.',
          status: 'Active & Verified',
        },
        {
          title: 'Embedded Web Player (SaavnTube / home.tsx)',
          commit: 'a504913',
          description:
            'Added an embedded YouTube-style dark player page with suggestions, recent searches, queue, and playback controls.',
          status: 'Active & Verified',
        },
        {
          title: 'YouTube Video Playback Experiment',
          commit: '00b9d03 -> 279468e (reverted)',
          description:
            'Attempted YouTube video integration for matching songs, then cleanly reverted to keep the API lightweight and focused on audio.',
          status: 'Reverted cleanly',
        },
      ],
      endpoints: [
        {
          path: '/api/songs/new-releases',
          method: 'GET',
          description: 'Fetch new releases for any Indian language (language=hindi|punjabi|english..., limit=24)',
          params: ['language', 'limit'],
        },
        {
          path: '/api/search',
          method: 'GET',
          description: 'Global autocomplete across songs, albums, artists, playlists',
          params: ['query'],
        },
        {
          path: '/api/search/songs',
          method: 'GET',
          description: 'Search songs with spell variant matching, ranking & sort=relevance|latest',
          params: ['query', 'page', 'limit', 'sort'],
        },
        {
          path: '/api/search/albums',
          method: 'GET',
          description: 'Search albums on JioSaavn',
          params: ['query', 'page', 'limit'],
        },
        {
          path: '/api/search/artists',
          method: 'GET',
          description: 'Search artists on JioSaavn',
          params: ['query', 'page', 'limit'],
        },
        {
          path: '/api/search/playlists',
          method: 'GET',
          description: 'Search playlists on JioSaavn',
          params: ['query', 'page', 'limit'],
        },
        {
          path: '/api/songs/:id',
          method: 'GET',
          description: 'Fetch single or multiple songs by ID with 5 decrypted audio qualities',
          params: ['id'],
        },
        {
          path: '/api/songs/:id/suggestions',
          method: 'GET',
          description: 'Fetch similar recommended tracks via entity station',
          params: ['id'],
        },
        {
          path: '/api/songs/:id/lyrics',
          method: 'GET',
          description: 'Fetch song lyrics if available',
          params: ['id'],
        },
        {
          path: '/api/albums',
          method: 'GET',
          description: 'Fetch album details and tracklist by id or link',
          params: ['id', 'link'],
        },
        {
          path: '/api/playlists',
          method: 'GET',
          description: 'Fetch playlist details and songs by id or link',
          params: ['id', 'link'],
        },
        {
          path: '/api/artists/:id',
          method: 'GET',
          description: 'Fetch artist profile, top songs, and top albums',
          params: ['id', 'page'],
        },
      ],
    },
  });
});

// Vite integration
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
