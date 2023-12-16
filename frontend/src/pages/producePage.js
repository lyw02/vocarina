import React, { useState } from "react";
import SiteHeader from "../components/siteHeader";
import PianoRoll from "../components/pianoRoll";
import Toolbar from "../components/toolbar";
import ParamaterBar from "../components/parameterBar";
import InputDialog from "../components/inputDialog";
import { useParameters } from "../contexts/paramsContext";

function ProducePage() {
  const {
    numerator,
    denominator,
    bpm,
    handleSetNumerator,
    handleSetDenominator,
    handleSetBpm,
  } = useParameters();

  const [isDialogVisible, setIsDialogVisible] = useState({
    isTimeSigDialogVisible: false,
    isBpmgDialogVisible: false,
  });

  const handleIsDialogVisible = (isVisible, flag) => {
    setIsDialogVisible((prevState) => {
      return {
        ...prevState,
        [isVisible]: flag,
      };
    });
  };

  return (
    <div>
      {isDialogVisible["isTimeSigDialogVisible"] && (
        <InputDialog
          title="Edit time signature"
          fields={{ numerator: numerator, denominator: denominator }}
          setters={{
            numerator: handleSetNumerator,
            denominator: handleSetDenominator,
          }}
          isDialogVisible={handleIsDialogVisible}
          visibleAlias="isTimeSigDialogVisible"
        />
      )}
      {isDialogVisible["isBpmgDialogVisible"] && (
        <InputDialog
          title="Edit BPM"
          fields={{ bpm: bpm }}
          setters={{ bpm: handleSetBpm }}
          isDialogVisible={handleIsDialogVisible}
          visibleAlias="isBpmgDialogVisible"
        />
      )}
      <SiteHeader />
      <Toolbar />
      <ParamaterBar
        numerator={numerator}
        denominator={denominator}
        bpm={bpm}
        isDialogVisible={handleIsDialogVisible}
      />
      <PianoRoll />
    </div>
  );
}

export default ProducePage;
