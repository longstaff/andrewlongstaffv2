import React, { useContext, useState, createContext } from "react";
import { v1 } from "uuid";

type Focus = {
  focus: string;
  setFocus: (f: number) => void;
};

const FocusContext = createContext<Focus>({
  focus: "",
  setFocus: () => {},
});

export const FocusProvider: React.FC<{}> = ({ children }) => {
  const [focus, setFocus] = useState<string>(v1());
  const addFocus = () => setFocus(v1());

  return (
    <FocusContext.Provider value={{ focus, setFocus: addFocus }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocusContext = () => {
  const cont = useContext(FocusContext);
  return cont.focus;
};
export const useSetFocus = () => {
  const cont = useContext(FocusContext);
  return () => cont.setFocus(1);
};
