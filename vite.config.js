import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/krx": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/krx/, ""),
      },
    },
  },
});
