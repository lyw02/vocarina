import React, { useState } from "react";
import SiteHeader from "../components/siteHeader";
import PianoRoll from "../components/pianoRoll";
import Toolbar from "../components/toolbar";
import ParamaterBar from "../components/parameterBar";
import { NotesContextProvider } from "../contexts/notesContext";
import { ParamsContextProvider } from "../contexts/paramsContext";
import InputDialog from "../components/inputDialog";

function ProducePage() {
  const [isTimeSigDialogVisible, setIsTimeSigDialogVisible] = useState(false);

  const handleIsTimeSigDialogVisible = (flag) => {
    setIsTimeSigDialogVisible(flag)
  }

  return (
    <div>
      {isTimeSigDialogVisible && (
        <InputDialog
          title="Edit time signature"
          fields={{ numerator: 4, denominator: 4 }}
          isTimeSigDialogVisible={handleIsTimeSigDialogVisible}
        />
      )}
      <SiteHeader />
      <NotesContextProvider>
        <ParamsContextProvider>
          <Toolbar />
          <ParamaterBar isTimeSigDialogVisible={handleIsTimeSigDialogVisible} />
          <PianoRoll />
        </ParamsContextProvider>
      </NotesContextProvider>
    </div>
  );
}

export default ProducePage;
