import React, { useState, useContext } from "react";

export const ParamsContext = React.createContext(null);

export const ParamsContextProvider = (props) => {
  const [numerator, setNumerator] = useState(4);
  const [denominator, setDenominator] = useState(4);
  const [bpm, setBpm] = useState(120);

  const handleSetNumerator = (newValue) => {
    setNumerator(newValue);
  }

  const handleSetDenominator = (newValue) => {
    setDenominator(newValue);
  }

  const handleSetBpm = (newValue) => {
    setBpm(newValue);
  }

  return (
    <ParamsContext.Provider
      value={{
        numerator,
        denominator,
        bpm,
        handleSetNumerator,
        handleSetDenominator,
        handleSetBpm,
      }}
    >
      {props.children}
    </ParamsContext.Provider>
  );
};

export const useParameters = () => {
  return useContext(ParamsContext);
};
