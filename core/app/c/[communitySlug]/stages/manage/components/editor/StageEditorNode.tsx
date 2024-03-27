import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyboardEvent, memo, useCallback, useMemo, useRef, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Button } from "ui/button";
import { Settings } from "ui/icon";
import { cn, expect } from "utils";
import { StagePayload } from "~/lib/types";
import { useStages } from "../../StagesContext";
import { useStageEditor } from "./StageEditorContext";

export const STAGE_NODE_WIDTH = 250;
export const STAGE_NODE_HEIGHT = 50;

export const StageEditorNode = memo((props: NodeProps<{ stage: StagePayload }>) => {
	const pathname = usePathname();
	const { updateStageName } = useStages();
	const [isEditingName, setIsEditingName] = useState(false);
	const memberships = useMemo(
		() =>
			props.data.stage.permissions.reduce((acc, permission) => {
				if (permission.memberGroup !== null) {
					for (const user of permission.memberGroup.users) {
						acc.add(user.id);
					}
				} else {
					acc.add(expect(permission.memberId));
				}
				return acc;
			}, new Set<string>()),
		[props.data]
	);
	const nodeRef = useRef<HTMLDivElement>(null);
	const nameRef = useRef<HTMLHeadingElement>(null);

	const onDoubleClick = useCallback(() => {
		setIsEditingName(true);
		if (nameRef.current) {
			const range = document.createRange();
			const selection = window.getSelection()!;
			const selectionStart = nameRef.current.childNodes[0];
			range.setStart(selectionStart, 0);
			range.setEnd(selectionStart, selectionStart.textContent!.length);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}, []);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (isEditingName && e.key === "Enter") {
				nameRef.current?.blur();
			}
		},
		[isEditingName]
	);

	const onBlur = useCallback(() => {
		if (isEditingName) {
			window.getSelection()?.removeAllRanges();
			if (nameRef.current) {
				updateStageName(props.data.stage.id, nameRef.current.textContent!);
			}
			setIsEditingName(false);
		}
	}, [isEditingName]);

	return (
		<div
			className={cn(
				"p-1.5 bg-gray-100 border rounded-md shadow-md text-xs flex items-center justify-between",
				props.selected ? "border-gray-800" : "border-gray-300"
			)}
			// Can't use Tailwind for dynamically computed styles
			style={{
				width: `${STAGE_NODE_WIDTH}px`,
				height: `${STAGE_NODE_HEIGHT}px`,
			}}
			onBlur={onBlur}
			onDoubleClick={onDoubleClick}
			onKeyDown={onKeyDown}
			ref={nodeRef}
		>
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} />
			<div className="flex flex-col">
				<div>
					<p
						className="font-medium text-sm nodrag cursor-text inline"
						contentEditable
						suppressContentEditableWarning
						ref={nameRef}
					>
						{props.data.stage.name}
					</p>
				</div>
				<ul className="p-0 m-0 list-none flex gap-2">
					<li>
						<Button variant="link" className="p-0 m-0 h-auto text-xs font-light">
							{props.data.stage.pubs.length} pubs
						</Button>
					</li>
					<li>
						<Button variant="link" className="p-0 m-0 h-auto text-xs font-light">
							0 actions
						</Button>
					</li>
					<li>
						<Button variant="link" className="p-0 m-0 h-auto text-xs font-light">
							{memberships.size} members
						</Button>
					</li>
				</ul>
			</div>
			<Link href={`${pathname}?editingStageId=${props.data.stage.id}`}>
				<Settings className="h-4 w-4" />
			</Link>
		</div>
	);
});