"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, Trash2 } from "lucide-react";
import { FC, PropsWithChildren } from "react";

import { ItemType, useContentStore } from "@/stores/dnd";
import { TemplateNode } from "@/types/template";
import { cn } from "@/utils/utils";

const nodeStyle = cn(
  "rounded border-2 border-current/50 p-4 shadow-none transition-shadow bg-white",
  "data-[dnd-placeholder=clone]:opacity-30",
  "data-[dnd-dragging]:shadow-2xl",
);

const grabButtonStyle = cn(
  "cursor-grab text-gray-500 rounded transition px-1 py-2",
  "hover:bg-current/10",
  "*:size-4",
);
const deleteButtonStyle = cn(
  "text-red-500 p-2 bg-current/10 rounded cursor-pointer transition",
  "hover:bg-current/20",
  "active:bg-current/30",
  "*:size-4",
);

interface SortableNodeProps {
  node: TemplateNode;
  index: number;
  group: string;
}
export const SortableNode: FC<SortableNodeProps> = ({ node, index, group }) => {
  const { ref } = useSortable({
    id: node.nodeId,
    index,
    group,
    data: { ...node, groupId: group },
    type: ItemType.NODE,
    accept: [ItemType.NODE, ItemType.GROUP],
    collisionPriority: CollisionPriority.Lowest,
    feedback: "clone",
  });

  const remove = useContentStore((state) => state.removeNode);

  return (
    <div ref={ref} className={nodeStyle}>
      <div className="flex">
        <div className="grow font-medium">{node.componentType}</div>
        <button
          type="button"
          onClick={() => {
            remove(node.nodeId);
          }}
          className={deleteButtonStyle}
        >
          <Trash2 />
        </button>
      </div>
      <div>{group}</div>
    </div>
  );
};

interface SortableGroupProps {
  node: TemplateNode;
  index: number;
  group: string;
}
export const SortableGroup: FC<PropsWithChildren<SortableGroupProps>> = ({
  node,
  index,
  group,
  children,
}) => {
  const { ref, handleRef, targetRef, isDropTarget } = useSortable({
    id: node.nodeId,
    index,
    group,
    data: { ...node, groupId: group },
    type: ItemType.GROUP,
    accept: [ItemType.GROUP, ItemType.NODE],
    collisionPriority: CollisionPriority.Low,
    feedback: "clone",
  });
  const remove = useContentStore((state) => state.removeNode);

  return (
    <div ref={ref} className={cn(nodeStyle, "bg-fuchsia-50")}>
      <div className="flex items-center gap-2">
        <button ref={handleRef} type="button" className={grabButtonStyle}>
          <GripVertical />
        </button>
        <div className="grow font-medium">{node.componentType}</div>
        <button
          type="button"
          onClick={() => {
            remove(node.nodeId);
          }}
          className={deleteButtonStyle}
        >
          <Trash2 />
        </button>
      </div>
      <div>{group}</div>
      {node.children.length < 2 && (
        <div
          ref={targetRef}
          data-dragtarget={isDropTarget}
          className={cn(
            "flex min-h-[100px] items-center justify-center rounded border-2 border-dashed border-gray-300 p-2 text-center text-gray-500",
            "data-[dragtarget=true]:bg-gray-300",
          )}
        >
          Drop children here
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
