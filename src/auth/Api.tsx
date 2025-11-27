import axios from "axios";
import { AxiosHeaders } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (token) {
        // garanta que headers existe e é do tipo AxiosHeaders
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        } else if (!(config.headers instanceof AxiosHeaders)) {
          config.headers = new AxiosHeaders(config.headers);
        }
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (err) {
      console.error("Não foi possível obter sessão do Cognito:", err);
      // aqui você pode opcionalmente tratar sessão expirada
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;