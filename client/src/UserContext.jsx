import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "./config";

export const UserContext = createContext({});
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios
        .get(BACKEND_BASE_URL + "/api/profile")
        .then(({ data }) => {
          // alert(JSON.stringify(data, 2, null));
          setUser(data);
          setReady(true);
        })
        .catch((error) => {
          console.log("ERROR fetching user Context, Error= ", error);
        });
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
