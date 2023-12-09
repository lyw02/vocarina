import "./index.css";
import Piano from "../piano";
import CanvasComponent from "../canvasComponent";
import ComposeArea from "../composeArea";

function PianoRoll() {
  return (
    <div className="piano-roll-wrapper">
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
