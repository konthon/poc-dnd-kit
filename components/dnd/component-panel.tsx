"use client";

import { ComponentDefinition } from "@/types/component-definition";
import { FC } from "react";
import { Draggable } from "./draggable";
import { ComponentItem } from "./component-item";

interface Props {
  components: ComponentDefinition[];
}

export const ComponentPanel: FC<Props> = ({ components }) => {
  return (
    <div className="p-4 border col-span-3 rounded">
      <h3 className="font-medium mb-4">Components</h3>
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
    </div>
  );
};
