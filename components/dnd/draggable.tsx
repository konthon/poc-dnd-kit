"use client";

import { useDraggable, UseDraggableInput } from "@dnd-kit/react";
import { FC, PropsWithChildren } from "react";

interface Props {
  id: string;
  type?: UseDraggableInput["type"];
  data?: UseDraggableInput["data"];
}

export const Draggable: FC<PropsWithChildren<Props>> = ({ id, type, data, children }) => {
  const { ref } = useDraggable({ id, data, type });
  return (
    <div ref={ref} data-component-id={id}>
      {children}
    </div>
  );
};
