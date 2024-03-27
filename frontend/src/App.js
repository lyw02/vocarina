import ProducePage from "./pages/producePage";
import { ParamsContextProvider } from "./contexts/paramsContext";
import { NotesContextProvider } from "./contexts/notesContext";
import { GenerateContextProvider } from "./contexts/generateContext";
import { UserContextProvider } from "./contexts/userContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/authPages/registerPage";
import LoginPage from "./pages/authPages/loginPage";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <GenerateContextProvider>
          <ParamsContextProvider>
            <NotesContextProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<ProducePage />} />
                </Routes>
              </BrowserRouter>
            </NotesContextProvider>
          </ParamsContextProvider>
        </GenerateContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
