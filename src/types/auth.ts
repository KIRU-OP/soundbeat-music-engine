export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  plan: 'SoundBeat Free' | '100% Free';
  joinedDate: string;
  likedSongsCount: number;
  playlistsCount: number;
  bio?: string;
}

export interface ArtistDetails {
  id: string;
  name: string;
  image: string;
  bannerImage?: string;
  followerCount?: number;
  isVerified: boolean;
  dominantLanguage?: string;
  bio?: string;
  topSongs: any[];
  topAlbums: any[];
}
