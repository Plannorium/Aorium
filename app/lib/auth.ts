import Cookies from "js-cookie";

const TOKEN_KEY = "jwt_token";

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // Token expires in 7 days
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};
