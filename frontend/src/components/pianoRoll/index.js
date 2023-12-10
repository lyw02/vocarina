import React, { useEffect, useRef } from 'react';
import Piano from "../piano";
import CanvasComponent from "../canvasComponent";
import ComposeArea from "../composeArea";
import "./index.css";

function PianoRoll() {
  const pianoRollRef = useRef(null);

  useEffect(() => {
    const pianoRoll = pianoRollRef.current;
    const middleScroll = (pianoRoll.scrollHeight - pianoRoll.clientHeight) / 2;
    pianoRoll.scrollTop = middleScroll;
  }, []);

  return (
    <div className="piano-roll-wrapper" ref={pianoRollRef}>
      <div className="piano-wrapper">
        <Piano />
      </div>
      <div className="compose-area-and-canvas-component-wrapper">
        <div className="compose-area-wrapper">
          <ComposeArea />
        </div>
        <div className="canvas-component-wrapper">
          <CanvasComponent />
        </div>
      </div>
    </div>
  );
}

export default PianoRoll;
