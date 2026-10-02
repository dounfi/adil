import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { TanStackStartVite } from "@tanstack/start-plugin";

export default defineConfig({
  plugins: [
    TanStackStartVite(),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
  ],
});
