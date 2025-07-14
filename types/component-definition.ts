export interface ComponentDefinition {
  componentType: string; // Unique key, e.g., "TextComponent"
  displayName: string; // Human-readable name, e.g., "Headline Text"
  icon: string; // Icon name from lucide-react
  acceptChild: boolean; // Flag indicating if the component can accept child components
  propsSchema: PropDefinition[];
}

export interface PropDefinition {
  key: string; // The prop name, e.g., "text", "fontSize"
  label: string; // The label for the form field, e.g., "Content", "Font Size"
  type: "string" | "number" | "boolean" | "color" | "image" | "select";
  defaultValue: unknown;
  options?: string[]; // For 'select' type
  placeholder?: string; // For text inputs
}
