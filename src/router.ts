export type Route =
  | 'login'
  | 'feed'
  | 'post'
  | 'search'
  | 'conversations'
  | 'dm'
  | 'profile'
  | 'profile-settings'
  | 'not-found';

export interface AppLocation {
  route: Route;
  params?: Record<string, string>;
}

export function parseLocation(path: string): AppLocation {
  const [_, raw, id] = path.split('/');
  switch (raw) {
    case '':
    case 'feed':
      return { route: 'feed' };
    case 'login':
      return { route: 'login' };
    case 'post':
      return { route: 'post', params: { id: id ?? '' } };
    case 'search':
      return { route: 'search' };
    case 'messages':
      return { route: 'conversations' };
    case 'dm':
      return { route: 'dm', params: { id: id ?? '' } };
    case 'profile':
      return { route: 'profile', params: { id: id ?? 'me' } };
    case 'profile-settings':
      return { route: 'profile-settings' };
    default:
      return { route: 'not-found' };
  }
}

export function navigate(path: string) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
