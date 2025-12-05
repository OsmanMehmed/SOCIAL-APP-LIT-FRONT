export interface UserProfile {
  id: string;
  username: string;
  subtitle: string;
  friend: boolean;
  banned: boolean;
  avatarUrl?: string | null;
  url?: string | null;
  admin?: boolean;
  isOwnProfile?: boolean;
}
