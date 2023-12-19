import React, { useState, useContext } from "react";

export const GenerateContext = React.createContext(null);

export const GenerateContextProvider = (props) => {
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleSetHasGenerated = (newValue) => {
    setHasGenerated(newValue);
  };

  return (
    <GenerateContext.Provider
      value={{
        hasGenerated,
        handleSetHasGenerated,
      }}
    >
      {props.children}
    </GenerateContext.Provider>
  );
};

export const useGenerate = () => {
  return useContext(GenerateContext);
};
