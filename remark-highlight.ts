import { visit } from 'unist-util-visit';
import hljs from 'highlight.js';

export function remarkHighlight() {
	return function (tree: any) {
		const visitor = (node: Node, ancestors: Array<Parent>) => {
			switch (node.lang) {
				default:
					node.type = 'html';
					const { value, language } = hljs.highlight(node.value, {language: node.lang || "plaintext"});
					node.value = `<pre><code class=language-"${language}">${value}</code></pre>`;
					return node;
			}
		};
		return visit(tree, 'code', visitor);
	};
}