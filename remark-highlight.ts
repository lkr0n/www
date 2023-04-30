import { visit } from 'unist-util-visit';
import hljs from 'highlight.js';
import 'katex/dist/katex.min.css';
import katex from 'katex';


function render(formula: string, mode: boolean): string  {
	try {
	  return katex.renderToString(formula, {
		displayMode: mode
	  });
	}catch(e) {
	  if (e instanceof Error) {
		return e.message
	  }else {
		console.log(e)
		return "FAILED TO RENDER LATEX. FOR BACKTRACE CHECK CONSOLE"
	  }
	}
  }

export function remarkHighlight() {
	return function (tree: any) {
		const visitor = (node: any) => {
			switch (node.lang) {
				case "katex":
					node.type = "html"
					node.value = render(node.value, true)
					return node
				default:
					node.type = 'html';
					let { value, language } = hljs.highlight(node.value, {language: node.lang || "plaintext"});
					node.value = `<pre><code class=language-"${language}">${value}</code></pre>`;
					return node;
			}
		};
		return visit(tree, 'code', visitor);
	};
}