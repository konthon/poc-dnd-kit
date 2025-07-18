"use client";

import { defaultPreset } from "@dnd-kit/dom";
import { Debug } from "@dnd-kit/dom/plugins/debug";
import { DragDropProvider } from "@dnd-kit/react";
import { FC, PropsWithChildren } from "react";

import { ItemType, transformComponentToNode, useContentStore } from "@/stores/dnd";
import { ComponentDefinition } from "@/types/component-definition";
import { TemplateNode } from "@/types/template";

export const DnDProvider: FC<PropsWithChildren> = ({ children }) => {
  const prependNode = useContentStore((state) => state.prependNode);
  const appendNode = useContentStore((state) => state.appendNode);
  const setContent = useContentStore((state) => state.setContent);
  const moveNode = useContentStore((state) => state.moveNode);
  const prependChildNode = useContentStore((state) => state.prependChildNode);
  const removeNode = useContentStore((state) => state.removeNode);

  return (
    <DragDropProvider
      plugins={[Debug, ...defaultPreset.plugins]}
      onDragOver={(e) => {
        if (e.operation.source) {
          const { source, target } = e.operation;
          // console.log(
          //   JSON.stringify(
          //     {
          //       source: { type: source.type, id: source.id },
          //       target: { type: target?.type, id: target?.id },
          //     },
          //     null,
          //     2,
          //   ),
          // );

          if (source.type === ItemType.COMPONENT) return;

          if (!target) {
            console.log("NO TARGET", source.type);
            if ([ItemType.NODE, ItemType.GROUP].includes(source.type as ItemType)) {
              console.log("NO TARGET - checked;", source.type);
              moveNode("append", source.data as TemplateNode);
              return;
            }
            return;
          }

          const sourceGroupId = source.data.groupId;
          const targetGroupId = target.data.groupId;

          if (sourceGroupId === targetGroupId && source.id === target.id) return;
          if (source.id === targetGroupId) return;

          console.log("next move");

          if (target.type === ItemType.ROOT_TOP) {
            if ([ItemType.NODE, ItemType.GROUP].includes(source.type as ItemType)) {
              console.log("TO TOP");
              moveNode("prepend", source.data as TemplateNode);
            }
            return;
          }

          if (target.type === ItemType.GROUP) {
            console.log("TO GROUP");
            prependChildNode(source.data as TemplateNode, target.data as TemplateNode);
            return;
          }

          const position = e.operation.position.current;
          let isBelowTarget = false;
          if (target.shape) {
            isBelowTarget = position.y < target.shape.center.y;
          }
          console.log("FALLBACK");
          moveNode(
            isBelowTarget ? "append" : "prepend",
            source.data as TemplateNode,
            target.data as TemplateNode,
          );
        }
      }}
      onDragEnd={(e) => {
        // console.log(e.operation.position, e.operation.target?.shape);
        if (e.operation.target && e.operation.source) {
          const { source, target } = e.operation;
          // Component to TOP of root
          if (source.type === ItemType.COMPONENT && target.type === ItemType.ROOT_TOP) {
            const newNode = transformComponentToNode(source.data as ComponentDefinition);
            prependNode(newNode);
          }
          // // Component to BOTTOM of each node
          // if (source.type === "component" && target.type === "node") {
          //   const newNode = transformComponentToNode(source.data as ComponentDefinition);
          //   appendNode(newNode, target.data as TemplateNode);
          // }
          // // Node to TOP of root
          // if (source.type === "node" && target.type === "root") {
          //   moveNode(source.data as TemplateNode);
          // }
          // // Node to each node
          // if (source.type === "node" && target.type === "node") {
          //   moveNode(source.data as TemplateNode, target.data as TemplateNode);
          // }

          // console.log(source.data, target.data, { source, target });
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
};
