import { create } from "zustand";

import type { ComponentDefinition } from "@/types/component-definition";
import type { TemplateNode } from "@/types/template";

// interface ComponentStore {
//   componentDefs: ComponentDefinition[];
//   setComponentDefs: (newDefs: ComponentDefinition[]) => void;
//   getComponentDef: (type: ComponentDefinition["componentType"]) => ComponentDefinition | undefined;
// }

// export const useComponentStore = create<ComponentStore>((set, get) => ({
//   componentDefs: [],
//   setComponentDefs: (newDefs) => {
//     set({ componentDefs: newDefs });
//   },
//   getComponentDef: (type) => {
//     const componentDefs = get().componentDefs;
//     const found = componentDefs.find((comp) => comp.componentType === type);
//     return found;
//   },
// }));

export enum ItemType {
  ROOT_TOP = "root-top",
  ROOT_BOTTOM = "root-bottom",
  COMPONENT = "component",
  NODE = "node",
  GROUP = "group",
}

export const transformComponentToNode = (component: ComponentDefinition): TemplateNode => {
  return {
    componentType: component.componentType,
    nodeId: crypto.randomUUID(),
    props: component.propsSchema.reduce(
      (props, prop) => ({ ...props, [prop.key]: prop.defaultValue }),
      {},
    ),
    children: [],
  };
};

type MoveType = "prepend" | "append";
interface ContentStore {
  content: TemplateNode[];
  setContent: (
    content: TemplateNode[] | ((currentContent: TemplateNode[]) => TemplateNode[]),
  ) => void;
  prependNode: (source: TemplateNode, target?: TemplateNode) => void;
  appendNode: (source: TemplateNode, target?: TemplateNode) => void;
  moveNode: (type: MoveType, source: TemplateNode, target?: TemplateNode) => void;
  removeNode: (nodeId: TemplateNode["nodeId"]) => void;
  prependChildNode: (source: TemplateNode, target: TemplateNode) => void;
}

function prependNode(
  source: TemplateNode,
  target?: TemplateNode,
  content: TemplateNode[] = [],
): TemplateNode[] {
  if (!target) {
    return [source, ...content];
  }
  const foundIndex = content.findIndex((node) => node.nodeId === target.nodeId);
  if (foundIndex >= 0) {
    return [...content.slice(0, foundIndex), source, ...content.slice(foundIndex)];
  }
  return content.map((node) => {
    if (node.children.length > 0) {
      return { ...node, children: appendNode(source, target, node.children) };
    }
    return node;
  });
}

function appendNode(
  source: TemplateNode,
  target?: TemplateNode,
  content: TemplateNode[] = [],
): TemplateNode[] {
  if (!target) {
    return [...content, source];
  }
  const foundIndex = content.findIndex((node) => node.nodeId === target.nodeId);
  if (foundIndex >= 0) {
    return [...content.slice(0, foundIndex + 1), source, ...content.slice(foundIndex + 1)];
  }
  return content.map((node) => {
    if (node.children.length > 0) {
      return { ...node, children: appendNode(source, target, node.children) };
    }
    return node;
  });
}

function removeNode(nodeId: TemplateNode["nodeId"], content: TemplateNode[]): TemplateNode[] {
  const foundIndex = content.findIndex((node) => node.nodeId === nodeId);
  if (foundIndex >= 0) {
    return content.filter((_, index) => index !== foundIndex);
  }
  return content.map((node) => {
    if (node.children.length > 0) {
      return { ...node, children: removeNode(nodeId, node.children) };
    }
    return node;
  });
}

function moveNode(
  type: "prepend" | "append",
  source: TemplateNode,
  target?: TemplateNode,
  content: TemplateNode[] = [],
) {
  const removed = removeNode(source.nodeId, content);
  if (!target || type === "prepend") {
    return prependNode(source, target, removed);
  }
  return appendNode(source, target, removed);
}

function findGroup(content: TemplateNode[], nodeId: TemplateNode["nodeId"]): TemplateNode[] | null {
  if (content.some((node) => node.nodeId === nodeId)) {
    return content;
  }
  for (const node of content) {
    const result = findGroup(node.children, nodeId);
    if (result) return result;
  }
  return null;
}

function prependChildNode(
  source: TemplateNode,
  target: TemplateNode,
  content: TemplateNode[],
): TemplateNode[] {
  const clone = structuredClone(content);

  const sourceGroup = findGroup(clone, source.nodeId);
  if (!sourceGroup) {
    throw new Error(`Source group ${source.nodeId} not found`);
  }
  const sourceIndex = sourceGroup.findIndex((node) => node.nodeId === source.nodeId);
  const [sourceNode] = sourceGroup.splice(sourceIndex, 1);

  const targetGroup = findGroup(clone, target.nodeId);
  if (!targetGroup) {
    throw new Error(`Target group ${target.nodeId} not found`);
  }
  const targetIndex = targetGroup.findIndex((node) => node.nodeId === target.nodeId);
  targetGroup[targetIndex].children.splice(0, 0, sourceNode);
  return clone;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  content: [],
  setContent: (content) => {
    if (typeof content === "function") {
      set((state) => ({ content: content(state.content) }));
    } else {
      set({ content });
    }
  },
  prependNode: (source, target) => {
    set((state) => ({ content: prependNode(source, target, state.content) }));
  },
  appendNode: (source, target) => {
    set((state) => ({ content: appendNode(source, target, state.content) }));
  },
  moveNode: (type, source, target) => {
    if (source.nodeId !== target?.nodeId) {
      set((state) => ({ content: moveNode(type, source, target, state.content) }));
    }
  },
  removeNode: (nodeId) => {
    set((state) => ({ content: removeNode(nodeId, state.content) }));
  },

  prependChildNode: (source, target) => {
    // console.log(prependChildNode(source, target, get().content));
    set((state) => ({ content: prependChildNode(source, target, state.content) }));
  },
}));
