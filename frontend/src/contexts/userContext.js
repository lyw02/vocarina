import React, { useState, useContext } from "react";

export const UserContext = React.createContext(null);

export const UserContextProvider = (props) => {
  const [user, setUser] = useState();

  const updateUser = (user) => {
    console.log("user: ", JSON.stringify(user));
    setUser(user);
    console.log("after updateUser: ", user);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext);
};
