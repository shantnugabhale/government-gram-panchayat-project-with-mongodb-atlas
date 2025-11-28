const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const isAuthenticated = () => Boolean(getToken());

export const logout = () => localStorage.removeItem(TOKEN_KEY);


