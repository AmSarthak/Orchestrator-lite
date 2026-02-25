import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "monitor",
      filename: "remoteEntry.js",
      exposes: {
        "./MonitorApp": "./src/App.jsx"
      },
      shared: ["react", "react-dom"]
    })
  ],
  server:{
    port: 5002,
    strictPort: true,
    cors: true
  },
  build: {
    target: "esnext"
  }
});