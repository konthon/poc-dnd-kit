"use client";

import { FC } from "react";

import type { IconName } from "lucide-react/dynamic";

import { ComponentDefinition } from "@/types/component-definition";
import { cn } from "@/utils/utils";

import { DynamicIcon } from "../DynamicIcon";

export const ComponentItem: FC<ComponentDefinition> = (props) => {
  const { displayName, icon, propsSchema, componentType, acceptChild } = props;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded border border-gray-500 bg-white px-2 py-1 select-none",
        "active:bg-gray-50",
      )}
    >
      {/* <div className="*:size-4">
        <DynamicIcon name={icon as IconName} />
      </div> */}
      <div>{displayName}</div>
    </div>
  );
};
