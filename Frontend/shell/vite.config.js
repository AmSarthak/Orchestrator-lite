import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
      builder: "http://localhost:5001/assets/remoteEntry.js",
      monitor: "http://localhost:5002/assets/remoteEntry.js"
  },
      shared: ["react", "react-dom"]
    })
  ],  
  build: {
    target: "esnext"
  }
});