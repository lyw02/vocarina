import { pianoKeys } from "@/utils/PianoKeys";
import classNames from "classnames";
import "./index.css";
import { useEffect, useRef } from "react";
import { noteStyle } from "@/utils/Note";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import {ComposeAreaStyle} from "@/utils/ComposeAreaStyle"

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

    colCanvas.width = ComposeAreaStyle.colCanvasWidth;
    colCanvas.height = ComposeAreaStyle.colCanvasHeight;

    colNumCanvas.width = ComposeAreaStyle.colNumCanvasWidth;
    colNumCanvas.height = ComposeAreaStyle.colNumCanvasHeight;

    // Draw column lines
    colCtx.lineWidth = ComposeAreaStyle.colLineWidth;

    const colCanvasWidth = ComposeAreaStyle.colCanvasWidth;
    const colCanvasHeight = ComposeAreaStyle.colCanvasHeight;
    const lineInterval = ComposeAreaStyle.colLineInterval;
    const lineIntervalInner = ComposeAreaStyle.colLineIntervalInner;

    for (let x = lineInterval; x < colCanvasWidth; x += lineInterval) {
      colCtx.strokeStyle = ComposeAreaStyle.colStrokeColor;
      colCtx.beginPath();
      colCtx.moveTo(x, 0);
      colCtx.lineTo(x, colCanvasHeight);
      colCtx.stroke();
    }

    for (let x = lineIntervalInner; x < colCanvasWidth; x += lineIntervalInner) {
      colCtx.strokeStyle = ComposeAreaStyle.colStrokeColor;
      colCtx.beginPath();
      colCtx.moveTo(x, 0);
      colCtx.lineTo(x, colCanvasHeight);
      colCtx.lineWidth = ComposeAreaStyle.colLineWidthInner;
      colCtx.stroke();
    }

    let num = 1;
    for (let x = 0; x < colCanvasWidth; x += lineInterval * numerator) {
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
