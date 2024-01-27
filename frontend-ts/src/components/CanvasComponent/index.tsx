import { useEffect, useRef } from "react";

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleMouseMove = () => {};
  const handleMouseDown = () => {};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      canvas.width = 3000;
      canvas.height = 2700;
    }
  }, []);

  return (
    <canvas
      className="compose-area-canvas"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    />
  );
};

export default CanvasComponent;
