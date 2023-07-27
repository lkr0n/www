import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkRehype from 'remark-rehype';
import { remarkImage, remarkHighlight } from './remark-plugin.ts';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.louiskronberg.de',
	integrations: [mdx(), sitemap()],
	markdown: {
		syntaxHighlight: false,
		remarkPlugins: [remarkImage, remarkHighlight, remarkMath, remarkRehype, rehypeKatex],
	}
});
