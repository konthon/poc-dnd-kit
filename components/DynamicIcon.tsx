"use client";

// fix performance issue in nextjs re-rendering
// ref: https://github.com/lucide-icons/lucide/issues/2081#issuecomment-2629447029

import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";
import { FC, memo } from "react";

type IconName = keyof typeof dynamicIconImports;

const icons = Object.keys(dynamicIconImports) as IconName[];

type ReactComponent = FC<{ className?: string }>;
const icons_components = {} as Record<IconName, ReactComponent>;

for (const name of icons) {
  const NewIcon = dynamic(dynamicIconImports[name], {
    ssr: false,
  }) as ReactComponent;
  icons_components[name] = NewIcon;
}

type DynamicIconProps = {
  name: IconName;
  className?: string;
};

export const DynamicIcon = memo(({ name, ...props }: DynamicIconProps) => {
  const Icon = icons_components[name];

  if (!Icon) return null;

  return <Icon {...props} />;
});

DynamicIcon.displayName = "DynamicIcon";
