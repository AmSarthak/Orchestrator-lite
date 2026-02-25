import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    federation({
      name: "builder",
      filename: "remoteEntry.js",
      exposes: {
        "./BuilderApp": "./src/App.jsx"
      },
      shared: ["react", "react-dom"]
    }),
    react()
  ],
  server: {
    port: 5001,
    strictPort: true,
    cors:true
  },
  
  build: {
    target: "esnext"
  }
});