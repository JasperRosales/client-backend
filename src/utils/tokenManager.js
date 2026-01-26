const REFRESH_ENDPOINT = '/api/auth/refresh';

let refreshPromise = null;


export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(REFRESH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.error('Token refresh failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function isTokenExpiredResponse(response) {
  return (
    response.status === 401 &&
    response.headers.get('content-type')?.includes('application/json')
  );
}

export function indicatesTokenExpiration(data) {
  return (
    data?.success === false &&
    (data?.message?.includes('expired') ||
      data?.message?.includes('Access token') ||
      data?.requiresRefresh === true)
  );
}


export async function authFetch(url, options = {}) {
  const defaultOptions = {
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  let response = await fetch(url, defaultOptions);

  if (isTokenExpiredResponse(response)) {
    try {
      const data = await response.json();

      if (indicatesTokenExpiration(data)) {
        const refreshSuccess = await refreshAccessToken();

        if (refreshSuccess) {
          response = await fetch(url, defaultOptions);
        } else {
          window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_refresh_failed' } }));
        }
      }
    } catch (error) {
      console.error('Error handling token refresh:', error);
    }
  }

  return response;
}

export async function authenticatedRequest(method, url, body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return authFetch(url, options);
}

export const authGet = (url, headers) => authenticatedRequest('GET', url, null, headers);
export const authPost = (url, body, headers) => authenticatedRequest('POST', url, body, headers);
export const authPut = (url, body, headers) => authenticatedRequest('PUT', url, body, headers);
export const authPatch = (url, body, headers) => authenticatedRequest('PATCH', url, body, headers);
export const authDelete = (url, headers) => authenticatedRequest('DELETE', url, null, headers);


export function logout() {
  localStorage.removeItem('auth_state');
    window.location.href = '/login';
}


export function isAuthenticated() {
  return document.cookie.includes('accessToken=');
}

export default {
  refreshAccessToken,
  authFetch,
  authenticatedRequest,
  authGet,
  authPost,
  authPut,
  authPatch,
  authDelete,
  logout,
  isAuthenticated,
};

