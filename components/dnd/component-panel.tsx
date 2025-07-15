"use client";

import { FC } from "react";

import { useContentStore } from "@/stores/dnd";
import { ComponentDefinition } from "@/types/component-definition";
import { TemplateNode } from "@/types/template";

import { ComponentItem } from "./component-item";
import { Draggable } from "./draggable";

interface Props {
  components: ComponentDefinition[];
}

type NodeTraversal = { [x: string]: NodeTraversal };

function mapNodeTraversal(content: TemplateNode[]): NodeTraversal {
  return content.reduce((all, node) => {
    if (node.children.length > 0) {
      return { ...all, [`${node.componentType}:${node.nodeId}`]: mapNodeTraversal(node.children) };
    }
    return { ...all, [`${node.componentType}:${node.nodeId}`]: {} };
  }, {});
}

export const ComponentPanel: FC<Props> = ({ components }) => {
  const content = useContentStore((state) => state.content);

  return (
    <div className="col-span-3 rounded border p-4">
      <h3 className="mb-4 font-medium">Components</h3>
      <div className="space-y-1">
        {components.map((component) => (
          <Draggable
            key={component.componentType}
            id={`draggable-${component.componentType}`}
            type="component"
            data={component}
          >
            <ComponentItem {...component} />
          </Draggable>
        ))}
      </div>
      <div className="mt-4 font-mono text-xs whitespace-pre">
        <div className="text-md mb-1">TRAVERSAL</div>
        {JSON.stringify(mapNodeTraversal(content), null, 2)}
      </div>
    </div>
  );
};
