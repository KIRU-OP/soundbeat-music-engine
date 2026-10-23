export interface QualityLink {
  quality: string;
  url: string;
}

export interface ImageLink {
  quality: string;
  url: string;
}

export interface ArtistMini {
  id: string;
  name: string;
  role?: string;
  type?: string;
  image?: ImageLink[];
  url?: string;
}

export interface Song {
  id: string;
  name: string;
  type: string;
  year?: string | null;
  releaseDate?: string | null;
  duration: number | null;
  label?: string | null;
  explicitContent: boolean;
  playCount?: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId?: string | null;
  url: string;
  copyright?: string | null;
  album: {
    id: string | null;
    name: string | null;
    url: string | null;
  };
  artists: {
    primary: ArtistMini[];
    featured?: ArtistMini[];
    all?: ArtistMini[];
  };
  image: ImageLink[];
  downloadUrl: QualityLink[];
}

export interface SearchAllResponse {
  topQuery?: {
    results: any[];
    position?: number;
  };
  songs?: {
    results: any[];
    position?: number;
  };
  albums?: {
    results: any[];
    position?: number;
  };
  artists?: {
    results: any[];
    position?: number;
  };
  playlists?: {
    results: any[];
    position?: number;
  };
}

export interface RepoCommit {
  hash: string;
  title: string;
  author: string;
  date: string;
  description: string;
  category: 'feature' | 'fix' | 'revert' | 'other';
}

export interface RepoAnalysis {
  repository: string;
  upstream: string;
  license: string;
  techStack: string[];
  keyEnhancements: {
    title: string;
    description: string;
    commit: string;
    status: string;
  }[];
  endpoints: {
    path: string;
    method: string;
    description: string;
    params: string[];
  }[];
  commits: RepoCommit[];
}
