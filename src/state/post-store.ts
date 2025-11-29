export interface PostViewData {
  id: string;
  title: string;
  username?: string;
}

const STORAGE_KEY = "post:last-viewed";

function readFromStorage(): PostViewData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PostViewData) : null;
  } catch {
    return null;
  }
}

function writeToStorage(data: PostViewData) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function clearStorage() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

let currentPost: PostViewData | null = readFromStorage();

export const postStore = {
  getCurrent(): PostViewData | null {
    return currentPost;
  },
  setCurrent(post: PostViewData) {
    currentPost = post;
    writeToStorage(post);
  },
  clear() {
    currentPost = null;
    clearStorage();
  },
};
