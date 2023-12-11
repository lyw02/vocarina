import SiteHeader from "../components/siteHeader";
import PianoRoll from "../components/pianoRoll";
import Toolbar from "../components/toolbar";
import ParamaterBar from "../components/parameterBar";
import { NotesContextProvider } from "../contexts/notesContext";
import { ParamsContextProvider } from "../contexts/paramsContext";
import InputDialog from "../components/inputDialog";

function ProducePage() {
  return (
    <div>
      <InputDialog title="Edit time signature" fields={{ numerator: 4, denominator: 4 }} />
      <SiteHeader />
      <NotesContextProvider>
        <ParamsContextProvider>
          <Toolbar />
          <ParamaterBar />
          <PianoRoll />
        </ParamsContextProvider>
      </NotesContextProvider>
    </div>
  );
}

export default ProducePage;
