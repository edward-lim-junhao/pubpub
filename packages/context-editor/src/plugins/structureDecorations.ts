import { Node } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

import { PanelProps } from "../ContextEditor";
import { attributePanelKey } from "./attributePanel";
import { reactPropsKey } from "./reactProps";

function wrapWidget(
	state: EditorState,
	node: Node,
	pos: number,
	setPanelPosition: React.Dispatch<React.SetStateAction<PanelProps>>
) {
	return () => {
		const { pubTypes, pubId, pubTypeId } = reactPropsKey.getState(state);
		const isBlock = node.isBlock;
		const widget = document.createElement(isBlock ? "div" : "span");
		widget.className = isBlock ? "wrap-widget" : "inline-wrap-widget";
		const widgetLineChild = document.createElement("span");
		widget.appendChild(widgetLineChild);
		const widgetButtonChild = document.createElement("button");
		widget.appendChild(widgetButtonChild);
		if (isBlock) {
			widgetButtonChild.innerHTML = `${node.type.name}${node.type.name === "heading" ? ` ${node.attrs.level}` : ""}`;
			if (node.type.name.includes("context")) {
				const currentPubId = node.attrs.pubId;
				const currentPubTypeId = node.attrs.pubTypeId;
				const currentPubType = pubTypes.find((pubType) => {
					return pubType.id === currentPubTypeId;
				});

				const currentFieldSlug = node.attrs.fieldSlug || "rd:content";
				const currentField = currentPubType.fields.find((field) => {
					return field.slug === currentFieldSlug;
				});
				const currentTypeName = currentPubType.name;
				// console.log(currentPubId, currentPubTypeId, currentTypeName, currentFieldSlug);
				let label;
				if (currentPubId === pubId) {
					label = `~${currentField.name}`;
				} else {
					// if (currentField) {
					// 	label = `${currentTypeName}/${currentField.name}`
					// } else {
					// 	label = currentTypeName;
					// }
					label = `/${currentTypeName}`;
				}
				/* TODO: Look up the field name, and figure out if it's local to this doc or not. */
				/* Need to find the pubType and use that name for atoms without fieldSlug */
				widgetButtonChild.innerHTML = label;
			}
			widgetButtonChild.className = node.type.name;
		}
		widget.addEventListener("click", (evt) => {
			if (evt.target instanceof Element) {
				const rect = evt.target.getBoundingClientRect();
				const container = document.getElementById("context-editor-container");
				const topOffset =
					-1 * container.getBoundingClientRect().top + container.scrollTop + 16;
				setPanelPosition({
					top: isBlock ? rect.top + 4 + topOffset : rect.top - 17 + topOffset,
					left: rect.left,
					bottom: rect.bottom,
					// right: rect.right,
					right: -250,
					pos,
					node,
				});
			}
		});
		return widget;
	};
}

export default () => {
	return new Plugin({
		// view: () => {
		// 	return {
		// 		update: (editorView) => {
		// 			const { panelPosition, setPanelPosition } = attributePanelKey.getState(
		// 				editorView.state
		// 			);
		// 			// setPanelPosition({
		// 			// 	...panelPosition,
		// 			// 	// node: editorView.state.doc.nodeAt(panelPosition.pos),
		// 			// });
		// 		},
		// 	};
		// },
		props: {
			decorations: (state) => {
				// console.log(state.doc.toJSON());
				const decorations: Decoration[] = [];
				const { setPanelPosition } = attributePanelKey.getState(state);
				state.doc.descendants((node, pos) => {
					if (node.type.isBlock) {
						decorations.push(
							Decoration.widget(pos, wrapWidget(state, node, pos, setPanelPosition))
						);
					}
					if (!node.type.isBlock && node.marks.length) {
						/* If it's an inline node with marks */
						decorations.push(
							Decoration.widget(pos, wrapWidget(state, node, pos, setPanelPosition))
						);
					}
				});
				return DecorationSet.create(state.doc, decorations);
			},
		},
	});
};
