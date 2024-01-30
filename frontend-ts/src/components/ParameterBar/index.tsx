import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import InputDialog from "../InputDialog";

import "./index.css";


const ParameterBar = () => {
  const [isTimeSigDialogVisible, setIsTimeSigDialogVisible] = useState<boolean>(false)
  const [isBpmDialogVisible, setIsBpmDialogVisible] = useState<boolean>(false)

  const { numerator, denominator, bpm } = useSelector(
    (state: RootState) => state.params
  );

  return (
    <div className="param-wrapper">
      <span
        className="param-item"
        onClick={() => setIsTimeSigDialogVisible(true)}
      >
        {numerator}/{denominator}
      </span>
      <span
        className="param-item"
        //   onClick={() => handleIsBpmDialogVisible(true)}
      >
        BPM: {bpm}
      </span>
      <InputDialog
        title="Edit Time Signature"
        formType="EditTimeSignatureForm"
        isOpen={isTimeSigDialogVisible}
        setIsOpen={setIsTimeSigDialogVisible}
      />
    </div>
  );
};

export default ParameterBar;
