import { createContext, useState, useEffect } from "react";

interface LogStatusContext {
  status: boolean;
  setStatus: (status: boolean) => void;
}

const LogStatus = createContext<LogStatusContext>({
  status: false,
  setStatus: () => {},
});

interface pdpIDContext{
  id: string
  setId: (id: string) => void
}

const pdpID = createContext<pdpIDContext>({
  id: "",
  setId: () => {}
})

interface ContextProviderProps {
  children: React.ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {

  const [status, setStatus] = useState<boolean>(() => {
    const storedStatus = localStorage.getItem("loginStatus");
    return storedStatus ? JSON.parse(storedStatus) : false;
  });

   
 
  useEffect(() => {
    localStorage.setItem("loginStatus", JSON.stringify(status));
  }, [status]);

  return (
    <LogStatus.Provider value={{ status, setStatus }}>
      {children}
    </LogStatus.Provider>
  );
};

export const ContextProviderPDP: React.FC<ContextProviderProps> = ({ children }) => {

  const [id, setId] = useState<string>(() => {
    const storedStatus = localStorage.getItem("pdpId");
    return storedStatus ? JSON.parse(storedStatus) : '';
  });

 
  useEffect(() => {
    localStorage.setItem("pdpId", JSON.stringify(id));
  }, [id]);

  return (
    <pdpID.Provider value={{ id, setId }}>
      {children}
    </pdpID.Provider>
  );
};

export { LogStatus, pdpID };
 