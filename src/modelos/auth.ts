import type { UserProfile } from "./user-profile";

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  profile: UserProfile;
}
