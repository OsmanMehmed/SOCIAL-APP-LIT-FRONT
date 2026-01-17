import { CONSTANTS } from "../shared/constants";
import type { AuthResponse } from "../modelos/auth";

const TOKEN_KEY = "auth:token";
const USER_KEY = "auth:user";
const ADMIN_KEY = "auth:admin";

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
  const admin = readFromStorage(ADMIN_KEY) === "true";
  return {
    isAuthenticated: Boolean(token),
    currentUserId: user || CONSTANTS.CURRENT_USER_ID,
    currentUserIsAdmin: admin,
  };
}

const restored = restoreAuth();

export const authStore = {
  isAuthenticated: restored.isAuthenticated,
  currentUserId: restored.currentUserId,
  currentUserIsAdmin: restored.currentUserIsAdmin,
  login(userId?: string) {
    this.isAuthenticated = true;
    this.currentUserId = userId || CONSTANTS.CURRENT_USER_ID;
    this.currentUserIsAdmin = false;
    writeToStorage(TOKEN_KEY, "session");
    writeToStorage(USER_KEY, this.currentUserId);
    writeToStorage(ADMIN_KEY, String(this.currentUserIsAdmin));
  },
  loginWithAuth(auth: AuthResponse) {
    const profile = auth.profile ?? auth.userProfile;
    if (!profile?.id) {
      throw new Error(CONSTANTS.NO_RESULTS_TEXT);
    }
    this.isAuthenticated = true;
    this.currentUserId = profile.id;
    this.currentUserIsAdmin = Boolean(profile.admin);
    writeToStorage(TOKEN_KEY, auth.token || "session");
    writeToStorage(USER_KEY, this.currentUserId);
    writeToStorage(ADMIN_KEY, String(this.currentUserIsAdmin));
  },
  logout() {
    this.isAuthenticated = false;
    this.currentUserId = CONSTANTS.CURRENT_USER_ID;
    this.currentUserIsAdmin = false;
    removeFromStorage(TOKEN_KEY);
    removeFromStorage(USER_KEY);
    removeFromStorage(ADMIN_KEY);
  },
};
