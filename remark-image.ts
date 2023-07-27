import { visitChildren } from 'unist-util-visit-children';
import type { Parent, Node } from 'unist'
import type { Link, Image, Paragraph } from 'mdast'; 

export function remarkImage() {
	return function (tree: Parent) {
		for (let i = 0; i < tree.children.length; i++) {

			// only continue if the node is a paragraph
			const node = tree.children[i];
			if (node.type != "paragraph") {
				continue;
			}

			let paragraph_node = node as Paragraph;
			for (let j = 0; j < paragraph_node.children.length; j++) {

				// only continue if the node is an image
				let child_node = paragraph_node.children[j];
				if (child_node.type != "image") {
					continue;
				}

				let image_node  = child_node as Image;
				const link_node: Link = {
					type: 'link',
					children: [image_node],
					url: image_node.url,
				};

				// finally replace the node
				paragraph_node.children[j] = link_node;
			}

		}
	};
}