import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: "https://www.typica.com.bo",
  output: "static",
  integrations: [sitemap()],
  vite: { build: { cssTarget: "safari15.4" } },
  devToolbar: {
    enabled: false,
  },
});