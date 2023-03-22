import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkHighlight } from './remark-highlight.ts';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.louiskronberg.de',
	integrations: [mdx(), sitemap()],
	markdown: {
		syntaxHighlight: false,
		remarkPlugins: [remarkHighlight],
	}
});
