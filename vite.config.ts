import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin([
      "VITE_COOKIE_KEY_VERIFY_ID",
      "VITE_COOKIE_KEY_VERIFY_UUID",
      "VITE_COOKIE_KEY_VISIT_ID",
      "VITE_COOKIE_AGE_SECONDS",
      "VITE_SOCKET_SERVER_URL",
      "VITE_TARGET_DIV_SEARCH_MAX_ATTEMPTS",
      "VITE_SOCKET_AUTH_TOKEN",
      "VITE_VERIFICATION_SERVER_URL",
      "VITE_VERIFICATION_API_KEY",
    ]),
  ],
});
