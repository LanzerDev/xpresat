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
  // Authorize the CMS / Blob origins so astro:assets can run remote images
  // (e.g. the hero background) through Vercel Image Optimization.
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'xpresat-cms.vercel.app' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  adapter: vercel({
    imageService: true,
    isr: {
      expiration: 300,
    },
  }),
});
