import { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

export type DrawingMode = "select" | "rectangle" | "circle" | "line" | "text";

function App() {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("select");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">CAD Editor</h1>
            <div className="text-sm text-gray-500">
              Basic 2D CAD Drawing Tool
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <Toolbar drawingMode={drawingMode} onModeChange={setDrawingMode} />
          </div>

          <div className="flex-1">
            <Canvas drawingMode={drawingMode} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
