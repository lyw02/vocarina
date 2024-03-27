import React, { useState, useContext } from "react";

export const NotesContext = React.createContext(null);

export const NotesContextProvider = (props) => {
  const [notes, setNotes] = useState([]);

  const updateNotes = (updatedNotes) => {
    setNotes(updatedNotes);
  };

  return (
    <NotesContext.Provider value={{ notes, updateNotes }}>
      {props.children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NotesContext);
};
