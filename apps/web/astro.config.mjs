// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // Inline all page CSS into the HTML so the small stylesheets don't become
  // render-blocking network requests on the critical path.
  build: {
    inlineStylesheets: 'always',
  },
  adapter: vercel({
    isr: {
      expiration: 300,
    },
  }),
});
