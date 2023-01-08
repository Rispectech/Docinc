import { createContext, useContext, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import { getCookie } from "../utils/Cookies";
import reducer from "./reducer";
import axios from "axios";

const defaultState = {
  accessToken: "",
  entity: "",
  isLoading: true,
};

const AuthContext = createContext<authContextType | undefined>(undefined);

const useAppContext = (): authContextType => {
  return useContext(AuthContext) as authContextType;
};

const AppProvider: React.FC<childrenPropsType> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, defaultState);

  console.log(state);
  const isUserAuthenticated = () => !!state.accessToken;

  const createSession = (entity: string, accessToken: string) => {
    dispatch({ type: "CREATE_SESSION", payload: { entity, accessToken } });
  };

  const refreshAccesstoken = async (refreshToken: string, entity: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/client/refreshAccessToken`,
        {
          refreshToken,
        }
      );
      // console.log(res, res.data);
      createSession(entity, res.data.data.accessToken);
      dispatch({ type: "SET_LOADING", payload: { status: false } });
    } catch (error) {
      router.push("/client/auth");
    }
  };

  useEffect(() => {
    const refreshToken = getCookie("refreshToken");
    const entity = getCookie("entity");

    if (refreshToken && entity === "Client" && state.accessToken === "") {
      refreshAccesstoken(refreshToken, entity);
    }
  });

  console.log(state);
  return (
    <AuthContext.Provider value={{ ...state, createSession, isUserAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AppProvider, useAppContext };
