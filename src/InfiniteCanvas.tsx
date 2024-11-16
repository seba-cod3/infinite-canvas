import * as fabric from "fabric";
import React, { useEffect, useRef } from "react";

export default function InfiniteCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const isDragging = useRef(false);
  const drawingInsideCanvas = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scrollPos = useRef({ left: 0, top: 0 });

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const fabricCanvas = new fabric.Canvas(canvasElement, {
      backgroundColor: "transparent",
      selection: false,
    });

    fabricCanvas.set({
      width: window.innerWidth - 80,
      height: window.innerHeight - 80,
    });
    fabricCanvas.wrapperEl!.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

    fabricCanvasRef.current = fabricCanvas;

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleMouseDown = (event) => {
    if (!fabricCanvasRef.current) return;

    const isTargetCanvas = event.target?.className === "upper-canvas";
    if (isTargetCanvas) {
      drawingInsideCanvas.current = true;
    }
    isDragging.current = true;

    const canvas: fabric.Canvas = fabricCanvasRef.current;
    const matriz = canvas.viewportTransform;

    startPos.current = { x: event.clientX, y: event.clientY };
    scrollPos.current = {
      left: matriz[4],
      top: matriz[5],
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Calcula el delta desde la última posición
    const deltaX = event.clientX - startPos.current.x;
    const deltaY = event.clientY - startPos.current.y;

    // Actualiza la posición del viewport
    canvas.relativePan(new fabric.Point(deltaX, deltaY));

    // Actualiza la posición de referencia para el próximo movimiento
    startPos.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
    }
  };

  const addRectangle = () => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    const rect = new fabric.Rect({
      left: Math.random() * window.innerWidth,
      top: Math.random() * window.innerHeight,
      fill: "rgba(0, 150, 255, 0.5)",
      width: 100,
      height: 60,
      stroke: "black",
      strokeWidth: 2,
    });

    fabricCanvas.add(rect);
    fabricCanvas.fire("object:added", { target: rect });
    fabricCanvas.requestRenderAll();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "calc(100vw - 20px)",
        height: "calc(100vh - 20px)",
        backgroundColor: "#333",
        padding: "20px",
        boxSizing: "content-box",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <button
          onClick={addRectangle}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "crimson",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Agregar Rectángulo
        </button>
      </div>
    </div>
  );
}
