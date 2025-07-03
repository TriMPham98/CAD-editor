import { DrawingMode } from "../App";

interface ToolbarProps {
  drawingMode: DrawingMode;
  onModeChange: (mode: DrawingMode) => void;
}

const Toolbar = ({ drawingMode, onModeChange }: ToolbarProps) => {
  const tools = [
    {
      mode: "select" as DrawingMode,
      label: "Select",
      icon: "↖️",
      description: "Select and move objects",
    },
    {
      mode: "rectangle" as DrawingMode,
      label: "Rectangle",
      icon: "⬜",
      description: "Draw rectangles",
    },
    {
      mode: "circle" as DrawingMode,
      label: "Circle",
      icon: "⭕",
      description: "Draw circles",
    },
    {
      mode: "line" as DrawingMode,
      label: "Line",
      icon: "📏",
      description: "Draw lines",
    },
    {
      mode: "text" as DrawingMode,
      label: "Text",
      icon: "📝",
      description: "Add text",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools</h3>

      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.mode}
            onClick={() => onModeChange(tool.mode)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              drawingMode === tool.mode
                ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700"
            }`}
            title={tool.description}>
            <span className="text-xl">{tool.icon}</span>
            <span className="font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions</h4>
        <div className="text-xs text-gray-600 space-y-1">
          {drawingMode === "select" && (
            <div>
              <p>• Click objects to select them</p>
              <p>• Drag to move selected objects</p>
              <p>• Use handles to resize</p>
            </div>
          )}
          {(drawingMode === "rectangle" || drawingMode === "circle") && (
            <div>
              <p>• Click and drag to draw</p>
              <p>• Release mouse to finish</p>
            </div>
          )}
          {drawingMode === "line" && (
            <div>
              <p>• Click start point</p>
              <p>• Drag to end point</p>
              <p>• Release to finish line</p>
            </div>
          )}
          {drawingMode === "text" && (
            <div>
              <p>• Click where you want text</p>
              <p>• Double-click to edit text</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
