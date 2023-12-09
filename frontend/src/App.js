import SiteHeader from "./components/siteHeader";
import PianoRoll from "./components/pianoRoll";
import Toolbar from "./components/toolbar";
import ParamaterBar from "./components/parameterBar";
import { NotesContextProvider } from "./contexts/notesContext";
import { ParamsContextProvider } from "./contexts/paramsContext";

function App() {
  return (
    <div className="App">
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

export default App;
