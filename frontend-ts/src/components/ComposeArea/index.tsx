import { pianoKeys } from "@/utils/PianoKeys";
import classNames from "classnames";
import "./index.css";
import { useEffect, useRef } from "react";
import { noteStyle } from "@/utils/Note";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

const ComposeArea = () => {
  const colCanvasRef = useRef<HTMLCanvasElement>(null);
  const colNumRef = useRef<HTMLCanvasElement>(null);

  const numerator = useSelector((state: RootState) => state.params.numerator);

  useEffect(() => {
    const colCanvas = colCanvasRef.current;
    if (!colCanvas) return;
    const colCtx = colCanvas.getContext("2d");
    if (!colCtx) return;

    const colNumCanvas = colNumRef.current;
    if (!colNumCanvas) return;
    const colNumCtx = colNumCanvas.getContext("2d");
    if (!colNumCtx) return;

    colCanvas.width = 10000;
    colCanvas.height = 5000;

    colNumCanvas.width = 10000;
    colNumCanvas.height = 20;

    // Draw column lines
    colCtx.lineWidth = 1;

    const colCanvasWidth = colCanvas.width;
    const colCanvasHeight = colCanvas.height;
    const lineInterval = 80;

    for (let x = lineInterval; x < colCanvasWidth; x += lineInterval) {
      // for (let xInner = x + lineInterval / 8; xInner < x + lineInterval; xInner += lineInterval / 8) {
      //   ctx.strokeStyle = "#b5babf";
      //   ctx.beginPath();
      //   ctx.moveTo(x, 0);
      //   ctx.lineTo(x, height);
      //   ctx.stroke();
      // }
      colCtx.strokeStyle = "#8a8e92";
      colCtx.beginPath();
      colCtx.moveTo(x, 0);
      colCtx.lineTo(x, colCanvasHeight);
      colCtx.stroke();
    }

    let num = 1;
    for (let x = 0; x < colCanvasWidth; x += lineInterval * numerator) {
      // console.log(num)
      colNumCtx.font = 10 * devicePixelRatio + 'px Arial';
      colNumCtx.textAlign = noteStyle.textAlign;
      colNumCtx.textBaseline = noteStyle.textBaseline;
      colNumCtx.fillStyle = "#000";
      colNumCtx.fillText(num.toString(), x + 3, 10);
      num += 1;
    }
  }, [numerator]);

  return (
    <div className="compose-area-outer-wrapper">
      <div className="upper-bar">
        <canvas ref={colNumRef} className="compose-area-col-numbers" />
      </div>
      <div className="compose-area-wrapper">
        <canvas ref={colCanvasRef} className="compose-area-cols" />
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
    </div>
  );
};

export default ComposeArea;
