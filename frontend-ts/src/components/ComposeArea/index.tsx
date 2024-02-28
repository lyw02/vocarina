import { pianoKeys } from "@/utils/PianoKeys";
import classNames from "classnames";
import "./index.css";
import { useEffect, useRef } from "react";

const ComposeArea = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 10000;
    canvas.height = 5000;

    // Draw column lines
    ctx.lineWidth = 1;

    const width = canvas.width;
    const height = canvas.height;
    const lineInterval = 80;

    for (let x = lineInterval; x < width; x += lineInterval) {
      // for (let xInner = x + lineInterval / 8; xInner < x + lineInterval; xInner += lineInterval / 8) {
      //   ctx.strokeStyle = "#b5babf";
      //   ctx.beginPath();
      //   ctx.moveTo(x, 0);
      //   ctx.lineTo(x, height);
      //   ctx.stroke();
      // }
      ctx.strokeStyle = "#8a8e92";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  }, []);

  return (
    <div className="compose-area-wrapper">
      <canvas ref={canvasRef} className="compose-area-cols" />
      <ul className="compose-area-rows">
        {pianoKeys()
          .reverse()
          .map((item) => {
            return (
              <li
                key={item.id}
                className={classNames("key-row", item.color)}
              ></li>
            );
          })}
      </ul>
    </div>
  );
};

export default ComposeArea;
