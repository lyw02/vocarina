import ProducePage from "./pages/producePage";
import { ParamsContextProvider } from "./contexts/paramsContext";
import { NotesContextProvider } from "./contexts/notesContext";

function App() {
  return (
    <ParamsContextProvider>
      <NotesContextProvider>
        <div className="App">
          <ProducePage />
        </div>
      </NotesContextProvider>
    </ParamsContextProvider>
  );
}

export default App;
