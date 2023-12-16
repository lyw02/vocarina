import React from "react";
import "./index.css";

export default function ParamaterBar({ numerator, denominator, bpm, isDialogVisible }) {

  const handleIsTimeSigDialogVisible = (flag) => {
    isDialogVisible("isTimeSigDialogVisible", flag);
  };

  const handleIsBpmDialogVisible = (flag) => {
    isDialogVisible("isBpmgDialogVisible", flag);
  };

  return (
    <div className="param-wrapper">
      <span className="param-item" onClick={() => handleIsTimeSigDialogVisible(true)}>
        {numerator}/{denominator}
      </span>
      <span className="param-item" onClick={() => handleIsBpmDialogVisible(true)}>BPM: {bpm}</span>
    </div>
  );
}
