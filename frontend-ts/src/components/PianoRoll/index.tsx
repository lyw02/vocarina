import { useEffect, useRef } from "react";
import Piano from "@/components/Piano";
import ComposeArea from "@/components/ComposeArea";
import CanvasComponent from "@/components/CanvasComponent";
import "./index.css"

const PianoRoll = () => {
  const pianoRef = useRef<HTMLDivElement | null>(null);
  const composeAreaRef = useRef<HTMLDivElement | null>(null);
  const pianoRollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const pianoRoll = pianoRollRef.current;
    if (pianoRoll) {
      const middleScroll =
        (pianoRoll.scrollHeight - pianoRoll.clientHeight) / 2;
      pianoRoll.scrollTop = middleScroll;
    }
  }, []);

  return (
    <div className="piano-roll-wrapper" ref={pianoRollRef}>
      <div className="piano-wrapper" ref={pianoRef}>
        <Piano />
      </div>
      <div
        className="compose-area-and-canvas-component-wrapper"
        ref={composeAreaRef}
      >
        <div className="compose-area-wrapper">
          <ComposeArea />
        </div>
        <div className="canvas-component-wrapper">
          <CanvasComponent />
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;
