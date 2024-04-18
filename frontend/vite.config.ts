import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // config "@" path alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
