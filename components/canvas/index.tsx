"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import React, { FC, useEffect } from "react";

import { ItemType, useContentStore } from "@/stores/dnd";
import { ComponentDefinition } from "@/types/component-definition";
import { Template, TemplateNode } from "@/types/template";

import { SortableGroup, SortableNode } from "./node";

interface Props {
  template: Template | null;
  componentDefs: ComponentDefinition[];
}

export const Canvas: FC<Props> = ({ template, componentDefs }) => {
  const content = useContentStore((state) => state.content);
  const setContent = useContentStore((state) => state.setContent);

  const { ref: topRef, isDropTarget: isTopTarget } = useDroppable({
    id: template!.id,
    type: ItemType.ROOT_TOP,
    data: content,
    accept: [ItemType.COMPONENT],
    collisionPriority: CollisionPriority.Low,
  });

  useEffect(() => {
    setContent([
      {
        nodeId: "container-1",
        componentType: "ContainerComponent",
        props: {},
        children: [
          {
            nodeId: "container-2",
            componentType: "ContainerComponent",
            props: {},
            children: [
              { nodeId: "text-2", componentType: "TextComponent", props: {}, children: [] },
            ],
          },
          { nodeId: "text-1", componentType: "TextComponent", props: {}, children: [] },
        ],
      },
    ]);
  }, []);

  return (
    <div className="col-span-9 rounded border p-4">
      <h3 className="mb-4 font-medium">Template</h3>
      <div className="border border-red-300 p-2">
        <div
          ref={topRef}
          data-drop-target={isTopTarget}
          className="bg-amber-100 px-2 py-4 data-[drop-target=true]:bg-amber-500"
        >
          Drop a new component here
        </div>
        <DeepRender content={content} group="root" componentDefs={componentDefs} />
      </div>
    </div>
  );
};

interface DeepRenderProps {
  content: TemplateNode[];
  group: string;
  componentDefs: ComponentDefinition[];
  isDisabled?: boolean;
}
const DeepRender: FC<DeepRenderProps> = ({ content, group, isDisabled, componentDefs }) => {
  return (
    <>
      {content.map((node, index) => {
        const acceptChildren = componentDefs.some(
          (comp) => comp.componentType === node.componentType && comp.acceptChild,
        );
        if (acceptChildren) {
          // wrapped with div to eliminate removeChild bug
          return (
            <div data-dnd-group key={node.nodeId}>
              <SortableGroup node={node} index={index} group={group} isDisabled={isDisabled}>
                {(isParentDragging) => (
                  <DeepRender
                    content={node.children}
                    group={node.nodeId}
                    componentDefs={componentDefs}
                    isDisabled={isParentDragging || isDisabled}
                  />
                )}
              </SortableGroup>
            </div>
          );
        }
        return (
          <SortableNode
            key={node.nodeId}
            node={node}
            index={index}
            group={group}
            isDisabled={isDisabled}
          />
        );
      })}
    </>
  );
};
