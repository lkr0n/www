import { visit } from 'unist-util-visit';

export function remarkImage() {
	return function (tree: any) {
		const visitor = (node: any) => {
			node.type = 'html';
			// get the img url
			const url = node.src;
			// wrap the img tag and its inner html in a link to image url
			const imghtml = node.value;
			node.value = `<a href="${url}">${imghtml}</a>`;
			return node;
		};
		return visit(tree, 'img', visitor);
	};
}