import { createContext, useContext } from "react";

const defaultState = {
  accessToken: "",
  entity: "",
};

const AuthContext = createContext<authContextType | undefined>(undefined);

const useAppContext = (): authContextType => {
  return useContext(AuthContext) as authContextType;
};

const AppProvider: React.FC<childrenPropsType> = ({ children }) => {
  return <AuthContext.Provider value={defaultState}>{children}</AuthContext.Provider>;
};

export { AppProvider, useAppContext };
