import { useSelector } from "react-redux";
import { RootState } from "@/types";

import "./index.css";

const ParameterBar = () => {
  const { numerator, denominator, bpm } = useSelector(
    (state: RootState) => state.params
  );
  return (
    <div className="param-wrapper">
      <span
        className="param-item"
        //   onClick={() => handleIsTimeSigDialogVisible(true)}
      >
        {numerator}/{denominator}
      </span>
      <span
        className="param-item"
        //   onClick={() => handleIsBpmDialogVisible(true)}
      >
        BPM: {bpm}
      </span>
    </div>
  );
};

export default ParameterBar;
