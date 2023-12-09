import React, { useState, useContext } from "react";

export const ParamsContext = React.createContext(null);

export const ParamsContextProvider = (props) => {
  const [numerator, setNumerator] = useState(4);
  const [denominator, setDenominator] = useState(4);
  const [bpm, setBpm] = useState(120);

  return (
    <ParamsContext.Provider value={{ numerator, denominator, bpm }}>
      {props.children}
    </ParamsContext.Provider>
  );
};

export const useParameters = () => {
  return useContext(ParamsContext);
};
