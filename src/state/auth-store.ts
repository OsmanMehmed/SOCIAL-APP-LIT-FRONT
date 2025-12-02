import { CONSTANTS } from "../shared/constants";
import type { AuthResponse } from "../modelos/auth";

const TOKEN_KEY = "auth:token";
const USER_KEY = "auth:user";

function readFromStorage(key: string): string | null {
  return sessionStorage.getItem(key);
}

function writeToStorage(key: string, value: string) {
  sessionStorage.setItem(key, value);
}

function removeFromStorage(key: string) {
  sessionStorage.removeItem(key);
}

function restoreAuth() {
  const token = readFromStorage(TOKEN_KEY);
  const user = readFromStorage(USER_KEY);
  return {
    isAuthenticated: Boolean(token),
    currentUserId: user || CONSTANTS.CURRENT_USER_ID,
  };
}

const restored = restoreAuth();

export const authStore = {
  isAuthenticated: restored.isAuthenticated,
  currentUserId: restored.currentUserId,
  login(userId?: string) {
    this.isAuthenticated = true;
    this.currentUserId = userId || CONSTANTS.CURRENT_USER_ID;
    writeToStorage(TOKEN_KEY, "session");
    writeToStorage(USER_KEY, this.currentUserId);
  },
  loginWithAuth(auth: AuthResponse) {
    const profile = auth.profile ?? auth.userProfile;
    if (!profile?.id) {
      throw new Error(CONSTANTS.NO_RESULTS_TEXT);
    }
    this.isAuthenticated = true;
    this.currentUserId = profile.id;
    writeToStorage(TOKEN_KEY, auth.token || "session");
    writeToStorage(USER_KEY, this.currentUserId);
  },
  logout() {
    this.isAuthenticated = false;
    this.currentUserId = CONSTANTS.CURRENT_USER_ID;
    removeFromStorage(TOKEN_KEY);
    removeFromStorage(USER_KEY);
  },
};
