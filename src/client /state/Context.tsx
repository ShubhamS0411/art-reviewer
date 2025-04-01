import { createContext, useState, useEffect } from "react";

interface LogStatusContext {
  status: boolean;
  setStatus: (status: boolean) => void;
}

const LogStatus = createContext<LogStatusContext>({
  status: false,
  setStatus: () => {},
});

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

export { LogStatus };
