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
  const moveNode = useContentStore((state) => state.moveNode);
  const prependChildNode = useContentStore((state) => state.prependChildNode);

  return (
    <DragDropProvider
      plugins={[Debug, ...defaultPreset.plugins]}
      onDragOver={(e) => {
        if (e.operation.source) {
          const { source, target } = e.operation;

          if (source.type === ItemType.COMPONENT) return;

          if (!target) {
            console.log("NO TARGET", source.type);
            if ([ItemType.NODE, ItemType.GROUP].includes(source.type as ItemType)) {
              const isMoveUp = e.operation.position.initial.y > e.operation.position.current.y;
              console.log("NO TARGET - checked;", source.type, { isMoveUp });
              moveNode(isMoveUp ? "prepend" : "append", source.data as TemplateNode);
              return;
            }
            return;
          }

          const sourceGroupId = source.data.groupId;
          const targetGroupId = target.data.groupId;

          if (sourceGroupId === targetGroupId && source.id === target.id) {
            console.log(
              `From group ${sourceGroupId} to group ${targetGroupId} | same ID: ${source.id}`,
            );
            return;
          }
          if (source.id === targetGroupId) {
            console.log(`Source: ${source.id} as same as group ${targetGroupId}`);
            return;
          }

          if (target.type === ItemType.ROOT_TOP) {
            console.log("PREPEND | ROOT_TOP");
            if ([ItemType.NODE, ItemType.GROUP].includes(source.type as ItemType)) {
              console.log("PREPEND | ROOT_TOP", source.id);
              moveNode("prepend", source.data as TemplateNode);
            }
            return;
          }

          if (target.type === ItemType.GROUP) {
            console.log(`PREPEND-child | ${source.id} to GROUP:${target.id}`);
            prependChildNode(source.data as TemplateNode, target.data as TemplateNode);
            return;
          }

          const position = e.operation.position.current;
          let isBelowTarget = false;
          if (target.shape) {
            console.log("HAS SHAPE", position.y, target.shape.center.y);
            if (source.type === ItemType.GROUP) {
              isBelowTarget = position.y < target.shape.center.y;
            } else {
              isBelowTarget = position.y > target.shape.center.y;
            }
          } else if (!target.shape) {
            console.log("NO SHAPE");
            isBelowTarget = position.y > e.operation.position.initial.y;
          }

          console.log(
            `MOVE | ${source.id} ${isBelowTarget ? "APPEND" : "PREPEND"} to ${target.id}`,
          );
          moveNode(
            isBelowTarget ? "append" : "prepend",
            source.data as TemplateNode,
            target.data as TemplateNode,
          );
        }
      }}
      onDragEnd={(e) => {
        if (e.operation.target && e.operation.source) {
          const { source, target } = e.operation;
          if (source.type === ItemType.COMPONENT) {
            const newNode = transformComponentToNode(source.data as ComponentDefinition);
            switch (target.type) {
              case ItemType.ROOT_TOP:
                prependNode(newNode);
                break;
              case ItemType.GROUP:
                prependChildNode(newNode, target.data as TemplateNode, true);
                break;
              case ItemType.ROOT_BOTTOM:
              default:
                appendNode(newNode);
                break;
            }
          }
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
};
