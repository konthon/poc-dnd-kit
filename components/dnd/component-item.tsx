import { ComponentDefinition } from "@/types/component-definition";
import { FC } from "react";

export const ComponentItem: FC<ComponentDefinition> = (props) => {
  const { displayName, icon, propsSchema, componentType, acceptChild } = props;
  return (
    <div className="border px-2 py-1 rounded select-none bg-white active:bg-gray-50">
      {displayName}
    </div>
  );
};
