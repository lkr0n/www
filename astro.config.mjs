import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkRehype from 'remark-rehype';
import remarkToc from 'remark-toc';
import { remarkImage, remarkHighlight } from './remark-plugin.ts';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.louiskronberg.de',
	integrations: [mdx(), sitemap()],
	markdown: {
		syntaxHighlight: false,
		remarkPlugins: [remarkToc, remarkImage, remarkHighlight, remarkMath, remarkRehype, rehypeKatex],
	}
});
