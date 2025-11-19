let accessToken: string | null = localStorage.getItem("access_token");

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem("access_token", token);
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem("access_token");
};