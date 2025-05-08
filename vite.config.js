import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Salary Calculator",
        short_name: "SC",
        start_url: "/",
        display: "standalone",
        background_color: "#3f7ddc",
        theme_color: "#3f7ddc",
        icons: [
          {
            src: "/logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
  },
});
