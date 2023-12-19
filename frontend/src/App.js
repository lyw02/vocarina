import ProducePage from "./pages/producePage";
import { ParamsContextProvider } from "./contexts/paramsContext";
import { NotesContextProvider } from "./contexts/notesContext";
import { GenerateContextProvider } from "./contexts/generateContext";

function App() {
  return (
    <GenerateContextProvider>
      <ParamsContextProvider>
        <NotesContextProvider>
          <div className="App">
            <ProducePage />
          </div>
        </NotesContextProvider>
      </ParamsContextProvider>
    </GenerateContextProvider>
  );
}

export default App;
