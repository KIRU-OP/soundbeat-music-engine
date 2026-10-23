export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'SoundBeat Free' | '100% Free' | 'Ultra Lossless Member';
  joinedDate: string;
  likedSongsCount: number;
  playlistsCount: number;
  bio?: string;
  authMethod?: 'gmail' | 'google' | 'email';
  sessionToken?: string;
  isEmailVerified?: boolean;
  deviceId?: string;
  lastLogin?: string;
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
