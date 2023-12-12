import React from "react";
import { useParameters } from "../../contexts/paramsContext";
import "./index.css";

export default function ParamaterBar({ isTimeSigDialogVisible }) {
  const { numerator, denominator, bpm } = useParameters();

  const handleIsTimeSigDialogVisible = (flag) => {
    isTimeSigDialogVisible(flag);
  };
  
  return (
    <div className="param-wrapper">
      <span className="param-item" onClick={() => handleIsTimeSigDialogVisible(true)}>
        {numerator}/{denominator}
      </span>
      <span className="param-item">BPM: {bpm}</span>
    </div>
  );
}
