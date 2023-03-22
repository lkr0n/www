import { visit } from 'unist-util-visit';
const noVisit = new Set(['root', 'html', 'text']);
import hljs from 'highlight.js';


export function remarkHighlight() {
	return function (tree: any) {
		const visitor = (node: any) => {
			node.type = 'html';

			if (node.lang === null) {
				node.lang = "plaintext"
			}
			
			let { value, language } = hljs.highlight(node.value, {language: node.lang});
			node.value = `<pre><code class=language-"${language}">${value}</code></pre>`;
			return node;
		};
		return visit(tree, 'code', visitor);
	};
}
