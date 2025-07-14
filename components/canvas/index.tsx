"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import React, { FC, PropsWithChildren } from "react";

import { ItemType, useContentStore } from "@/stores/dnd";
import { ComponentDefinition } from "@/types/component-definition";
import { Template, TemplateNode } from "@/types/template";

interface Props {
  template: Template | null;
  componentDefs: ComponentDefinition[];
}

export const Canvas: FC<Props> = ({ template, componentDefs }) => {
  const content = useContentStore((state) => state.content);
  const { ref, isDropTarget } = useDroppable({
    id: template!.id,
    type: ItemType.ROOT_TOP,
    data: content,
    accept: [ItemType.COMPONENT],
    collisionPriority: CollisionPriority.Low,
  });

  // useEffect(() => {
  //   setContent(template?.content || [])
  // }, [template])

  return (
    <div className="p-4 border col-span-9 rounded">
      <h3 className="font-medium mb-4">Template</h3>
      <div className="border p-2 border-red-300">
        <div
          ref={ref}
          data-drop-target={isDropTarget}
          className="py-4 px-2 bg-amber-100 data-[drop-target=true]:bg-amber-500"
        >
          Drop a new component here
        </div>
        <DeepRender content={content} group="root" componentDefs={componentDefs} />
        <button
          type="button"
          onClick={() => {
            console.log(content);
          }}
        >
          SHOW
        </button>
      </div>
    </div>
  );
};

interface DeepRenderProps {
  content: TemplateNode[];
  group: string;
  componentDefs: ComponentDefinition[];
}
const DeepRender: FC<DeepRenderProps> = ({ content, group, componentDefs }) => {
  return (
    <div>
      {content.map((node, index) => {
        const acceptChildren = componentDefs.some(
          (comp) => comp.componentType === node.componentType && comp.acceptChild,
        );
        if (acceptChildren) {
          return (
            <SortableGroup key={node.nodeId} node={node} index={index} group={group}>
              <DeepRender
                content={node.children}
                group={node.nodeId}
                componentDefs={componentDefs}
              />
            </SortableGroup>
          );
        }
        return <SortableNode key={node.nodeId} node={node} index={index} group={group} />;
      })}
    </div>
  );
};

interface SortableNodeProps {
  node: TemplateNode;
  index: number;
  group: string;
}
const SortableNode: FC<SortableNodeProps> = ({ node, index, group }) => {
  const { ref } = useSortable({
    id: node.nodeId,
    index,
    group,
    data: { ...node, groupId: group },
    type: ItemType.NODE,
    accept: [ItemType.NODE, ItemType.GROUP],
    collisionPriority: CollisionPriority.Low,
    feedback: "clone",
  });
  const remove = useContentStore((state) => state.removeNode);
  return (
    <div
      ref={ref}
      className="bg-amber-50 p-4 rounded border-2 border-amber-300 data-[dnd-placeholder=clone]:opacity-30 data-[dnd-dragging]:shadow-2xl"
    >
      <div className="flex">
        <div className="grow font-medium">{node.componentType}</div>
        <button
          type="button"
          onClick={() => {
            remove(node.nodeId);
          }}
        >
          X
        </button>
      </div>
      <div>{`${group}/${node.nodeId}`}</div>
    </div>
  );
};

interface SortableGroupProps {
  node: TemplateNode;
  index: number;
  group: string;
}
const SortableGroup: FC<PropsWithChildren<SortableGroupProps>> = ({
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
    <div
      ref={ref}
      className="bg-blue-50 p-4 border-2 border-blue-300 rounded data-[dnd-placeholder=clone]:opacity-30 data-[dnd-dragging]:shadow-2xl"
    >
      <div className="flex">
        <div className="grow font-medium">{node.componentType}</div>
        <div className="flex gap-2">
          <div ref={handleRef}>HANDLE</div>
          <button
            type="button"
            onClick={() => {
              remove(node.nodeId);
            }}
          >
            X
          </button>
        </div>
      </div>
      <div>{`${group}/${node.nodeId}`}</div>
      <div
        ref={targetRef}
        data-dragtarget={isDropTarget}
        className="p-2 text-gray-500 border-gray-300 border-2 border-dashed min-h-[100px] data-[dragtarget=true]:bg-gray-300"
      >
        DROP HERE
      </div>
      <div>{children}</div>
    </div>
  );
};
