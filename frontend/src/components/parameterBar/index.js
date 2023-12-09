import React from "react";
import { useParameters } from "../../contexts/paramsContext";
import "./index.css";

export default function ParamaterBar() {
  const { numerator, denominator, bpm } = useParameters();
  return (
    <div className="param-wrapper">
      <span className="param-item">
        {numerator}/{denominator}
      </span>
      <span className="param-item">BPM: {bpm}</span>
    </div>
  );
}
