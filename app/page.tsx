import { Canvas } from "@/components/canvas";
import { ComponentPanel } from "@/components/dnd/component-panel";
import { DnDProvider } from "@/components/dnd/dnd-provider";
import { componentApi, templateApi } from "@/mocks/data";

export default async function Home() {
  const components = await componentApi.getAll();
  const template = await templateApi.getById("template-001");

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Home DnD</h1>
      <DnDProvider>
        <div className="grid grid-cols-12 gap-4">
          <ComponentPanel components={components} />
          <Canvas template={template} componentDefs={components} />
        </div>
      </DnDProvider>
    </div>
  );
}
