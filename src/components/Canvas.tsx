import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { DrawingMode } from "../App";

interface CanvasProps {
  drawingMode: DrawingMode;
}

const Canvas = ({ drawingMode }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize Fabric.js canvas
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "white",
      });

      // Set up event listeners
      setupCanvasEvents();
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      // Update canvas settings based on drawing mode
      const canvas = fabricCanvasRef.current;

      if (drawingMode === "select") {
        canvas.selection = true;
        canvas.defaultCursor = "default";
        canvas.hoverCursor = "move";
      } else {
        canvas.selection = false;
        canvas.defaultCursor = "crosshair";
        canvas.hoverCursor = "crosshair";
      }
    }
  }, [drawingMode]);

  const setupCanvasEvents = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    canvas.on("mouse:down", (e) => {
      if (drawingMode === "select") return;

      setIsDrawing(true);
      const pointer = canvas.getPointer(e.e);
      setStartPoint({ x: pointer.x, y: pointer.y });

      if (drawingMode === "text") {
        addText(pointer.x, pointer.y);
        return;
      }
    });

    canvas.on("mouse:move", (e) => {
      if (
        !isDrawing ||
        !startPoint ||
        drawingMode === "select" ||
        drawingMode === "text"
      )
        return;

      const pointer = canvas.getPointer(e.e);

      // Remove the temporary shape if it exists
      const objects = canvas.getObjects();
      const lastObject = objects[objects.length - 1];
      if (lastObject && lastObject.data === "temp") {
        canvas.remove(lastObject);
      }

      // Create temporary shape for preview
      let tempShape: fabric.Object | null = null;

      switch (drawingMode) {
        case "rectangle":
          tempShape = new fabric.Rect({
            left: Math.min(startPoint.x, pointer.x),
            top: Math.min(startPoint.y, pointer.y),
            width: Math.abs(pointer.x - startPoint.x),
            height: Math.abs(pointer.y - startPoint.y),
            fill: "transparent",
            stroke: "#007bff",
            strokeWidth: 2,
            data: "temp",
          });
          break;
        case "circle":
          const radius =
            Math.sqrt(
              Math.pow(pointer.x - startPoint.x, 2) +
                Math.pow(pointer.y - startPoint.y, 2)
            ) / 2;
          tempShape = new fabric.Circle({
            left: startPoint.x - radius,
            top: startPoint.y - radius,
            radius: radius,
            fill: "transparent",
            stroke: "#007bff",
            strokeWidth: 2,
            data: "temp",
          });
          break;
        case "line":
          tempShape = new fabric.Line(
            [startPoint.x, startPoint.y, pointer.x, pointer.y],
            {
              stroke: "#007bff",
              strokeWidth: 2,
              data: "temp",
            }
          );
          break;
      }

      if (tempShape) {
        canvas.add(tempShape);
        canvas.renderAll();
      }
    });

    canvas.on("mouse:up", (e) => {
      if (
        !isDrawing ||
        !startPoint ||
        drawingMode === "select" ||
        drawingMode === "text"
      ) {
        setIsDrawing(false);
        return;
      }

      const pointer = canvas.getPointer(e.e);

      // Remove temporary shape
      const objects = canvas.getObjects();
      const lastObject = objects[objects.length - 1];
      if (lastObject && lastObject.data === "temp") {
        canvas.remove(lastObject);
      }

      // Create final shape
      let finalShape: fabric.Object | null = null;

      switch (drawingMode) {
        case "rectangle":
          if (
            Math.abs(pointer.x - startPoint.x) > 5 &&
            Math.abs(pointer.y - startPoint.y) > 5
          ) {
            finalShape = new fabric.Rect({
              left: Math.min(startPoint.x, pointer.x),
              top: Math.min(startPoint.y, pointer.y),
              width: Math.abs(pointer.x - startPoint.x),
              height: Math.abs(pointer.y - startPoint.y),
              fill: "transparent",
              stroke: "#333",
              strokeWidth: 2,
            });
          }
          break;
        case "circle":
          const radius =
            Math.sqrt(
              Math.pow(pointer.x - startPoint.x, 2) +
                Math.pow(pointer.y - startPoint.y, 2)
            ) / 2;
          if (radius > 5) {
            finalShape = new fabric.Circle({
              left: startPoint.x - radius,
              top: startPoint.y - radius,
              radius: radius,
              fill: "transparent",
              stroke: "#333",
              strokeWidth: 2,
            });
          }
          break;
        case "line":
          if (
            Math.abs(pointer.x - startPoint.x) > 5 ||
            Math.abs(pointer.y - startPoint.y) > 5
          ) {
            finalShape = new fabric.Line(
              [startPoint.x, startPoint.y, pointer.x, pointer.y],
              {
                stroke: "#333",
                strokeWidth: 2,
              }
            );
          }
          break;
      }

      if (finalShape) {
        canvas.add(finalShape);
      }

      canvas.renderAll();
      setIsDrawing(false);
      setStartPoint(null);
    });
  };

  const addText = (x: number, y: number) => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.Textbox("Double click to edit", {
      left: x,
      top: y,
      fontSize: 16,
      fontFamily: "Arial",
      fill: "#333",
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    text.enterEditing();
    fabricCanvasRef.current.renderAll();
  };

  const clearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = "white";
      fabricCanvasRef.current.renderAll();
    }
  };

  const deleteSelected = () => {
    if (fabricCanvasRef.current) {
      const activeObjects = fabricCanvasRef.current.getActiveObjects();
      activeObjects.forEach((obj) => fabricCanvasRef.current?.remove(obj));
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();
    }
  };

  return (
    <div className="canvas-container bg-white rounded-lg">
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            Clear All
          </button>
          <button
            onClick={deleteSelected}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
            Delete Selected
          </button>
        </div>
      </div>
      <div className="p-4">
        <canvas ref={canvasRef} className="border border-gray-200 rounded" />
      </div>
    </div>
  );
};

export default Canvas;
