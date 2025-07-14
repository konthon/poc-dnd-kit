import type { Template } from "@/types/template";
import type { ComponentDefinition } from "@/types/component-definition";

// Mock templates data
export const mockTemplates: Template[] = [
  {
    id: "template-001",
    name: "Homepage Banner",
    description: "A banner for the homepage with headline and CTA button",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-02-20"),
    version: 1,
    content: [
      {
        nodeId: "node-001",
        componentType: "ContainerComponent",
        props: {
          backgroundColor: "#f8f9fa",
          padding: "20px",
        },
        children: [
          {
            nodeId: "node-002",
            componentType: "HeadingComponent",
            props: {
              text: "${headerText}",
              fontSize: "32px",
              textAlign: "center",
            },
            children: [],
          },
          {
            nodeId: "node-003",
            componentType: "ButtonComponent",
            props: {
              text: "${buttonText}",
              backgroundColor: "#0d6efd",
              textColor: "#ffffff",
              url: "${buttonUrl}",
            },
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "template-002",
    name: "Product Card",
    description: "A card displaying product information",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-15"),
    version: 1,
    content: [
      {
        nodeId: "node-004",
        componentType: "CardComponent",
        props: {
          borderRadius: "8px",
          shadow: "medium",
        },
        children: [
          {
            nodeId: "node-005",
            componentType: "ImageComponent",
            props: {
              src: "${productImage}",
              alt: "${productName}",
              height: "200px",
            },
            children: [],
          },
          {
            nodeId: "node-006",
            componentType: "HeadingComponent",
            props: {
              text: "${productName}",
              fontSize: "24px",
            },
            children: [],
          },
          {
            nodeId: "node-007",
            componentType: "TextComponent",
            props: {
              text: "${productDescription}",
              fontSize: "16px",
            },
            children: [],
          },
          {
            nodeId: "node-008",
            componentType: "TextComponent",
            props: {
              text: "${productPrice}",
              fontSize: "20px",
              fontWeight: "bold",
            },
            children: [],
          },
        ],
      },
    ],
  },
];

// Mock component definitions
export const mockComponentDefinitions: ComponentDefinition[] = [
  {
    componentType: "ContainerComponent",
    displayName: "Container",
    icon: "Layout",
    acceptChild: true,
    propsSchema: [
      {
        key: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "#ffffff",
      },
      {
        key: "padding",
        label: "Padding",
        type: "string",
        defaultValue: "16px",
        placeholder: "e.g., 16px or 1rem",
      },
    ],
  },
  {
    componentType: "HeadingComponent",
    displayName: "Heading",
    icon: "Type",
    acceptChild: false,
    propsSchema: [
      {
        key: "text",
        label: "Text Content",
        type: "string",
        defaultValue: "Heading Text",
        placeholder: "Enter heading text",
      },
      {
        key: "fontSize",
        label: "Font Size",
        type: "string",
        defaultValue: "24px",
        placeholder: "e.g., 24px or 1.5rem",
      },
      {
        key: "textAlign",
        label: "Text Alignment",
        type: "select",
        defaultValue: "left",
        options: ["left", "center", "right"],
      },
    ],
  },
  {
    componentType: "TextComponent",
    displayName: "Text",
    icon: "Text",
    acceptChild: false,
    propsSchema: [
      {
        key: "text",
        label: "Text Content",
        type: "string",
        defaultValue: "Paragraph text goes here",
        placeholder: "Enter paragraph text",
      },
      {
        key: "fontSize",
        label: "Font Size",
        type: "string",
        defaultValue: "16px",
        placeholder: "e.g., 16px or 1rem",
      },
      {
        key: "fontWeight",
        label: "Font Weight",
        type: "select",
        defaultValue: "normal",
        options: ["normal", "bold", "light"],
      },
    ],
  },
  {
    componentType: "ImageComponent",
    displayName: "Image",
    icon: "Image",
    acceptChild: false,
    propsSchema: [
      {
        key: "src",
        label: "Image Source",
        type: "string",
        defaultValue: "/placeholder.svg",
        placeholder: "Enter image URL",
      },
      {
        key: "alt",
        label: "Alt Text",
        type: "string",
        defaultValue: "Image description",
        placeholder: "Enter image description",
      },
      {
        key: "height",
        label: "Height",
        type: "string",
        defaultValue: "auto",
        placeholder: "e.g., 200px or auto",
      },
    ],
  },
  {
    componentType: "ButtonComponent",
    displayName: "Button",
    icon: "Square",
    acceptChild: false,
    propsSchema: [
      {
        key: "text",
        label: "Button Text",
        type: "string",
        defaultValue: "Click Me",
        placeholder: "Enter button text",
      },
      {
        key: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "#0d6efd",
      },
      {
        key: "textColor",
        label: "Text Color",
        type: "color",
        defaultValue: "#ffffff",
      },
      {
        key: "url",
        label: "Link URL",
        type: "string",
        defaultValue: "#",
        placeholder: "Enter URL",
      },
    ],
  },
  {
    componentType: "CardComponent",
    displayName: "Card",
    icon: "CreditCard",
    acceptChild: true,
    propsSchema: [
      {
        key: "borderRadius",
        label: "Border Radius",
        type: "string",
        defaultValue: "4px",
        placeholder: "e.g., 4px or 0.25rem",
      },
      {
        key: "shadow",
        label: "Shadow",
        type: "select",
        defaultValue: "none",
        options: ["none", "small", "medium", "large"],
      },
    ],
  },
];

// Mock API for templates
export const templateApi = {
  getAll: () => Promise.resolve(mockTemplates),
  getById: (id: string) => Promise.resolve(mockTemplates.find((t) => t.id === id) || null),
  create: (template: Omit<Template, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${crypto.randomUUID()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTemplates.push(newTemplate);
    return Promise.resolve(newTemplate);
  },
  update: (id: string, template: Partial<Template>) => {
    const index = mockTemplates.findIndex((t) => t.id === id);
    if (index === -1) return Promise.reject(new Error("Template not found"));

    mockTemplates[index] = {
      ...mockTemplates[index],
      ...template,
      updatedAt: new Date(),
    };
    return Promise.resolve(mockTemplates[index]);
  },
  delete: (id: string) => {
    const index = mockTemplates.findIndex((t) => t.id === id);
    if (index === -1) return Promise.reject(new Error("Template not found"));

    mockTemplates.splice(index, 1);
    return Promise.resolve(true);
  },
};

// Mock API for component definitions
export const componentApi = {
  getAll: () => Promise.resolve(mockComponentDefinitions),
  getByType: (type: string) =>
    Promise.resolve(mockComponentDefinitions.find((c) => c.componentType === type) || null),
  create: (component: ComponentDefinition) => {
    mockComponentDefinitions.push(component);
    return Promise.resolve(component);
  },
  update: (type: string, component: Partial<ComponentDefinition>) => {
    const index = mockComponentDefinitions.findIndex((c) => c.componentType === type);
    if (index === -1) return Promise.reject(new Error("Component not found"));

    mockComponentDefinitions[index] = {
      ...mockComponentDefinitions[index],
      ...component,
    };
    return Promise.resolve(mockComponentDefinitions[index]);
  },
  delete: (type: string) => {
    const index = mockComponentDefinitions.findIndex((c) => c.componentType === type);
    if (index === -1) return Promise.reject(new Error("Component not found"));

    mockComponentDefinitions.splice(index, 1);
    return Promise.resolve(true);
  },
};
