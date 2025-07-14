export interface Template {
  id: string; // Unique identifier (schema_id)
  name: string; // User-friendly name, e.g., "Homepage Banner v2"
  description: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  // The actual page structure, built by the visual editor
  content: TemplateNode[];
}

export interface TemplateNode {
  nodeId: string; // A unique ID for this specific node instance (e.g., uuid)
  componentType: string; // Maps to a key in the Component Registry, e.g., "TextComponent"
  props: {
    [key: string]: unknown; // Values set by the user in the properties panel
  };
  children: TemplateNode[];
}
