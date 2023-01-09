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

const entityRefreshLinks: { [key: string]: string } = {
  Admin: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/admin/refreshAccessToken`,
  Client: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/client/refreshAccessToken`,
};

const AuthContext = createContext<authContextType | undefined>(undefined);

const useAppContext = (): authContextType => {
  return useContext(AuthContext) as authContextType;
};

const AppProvider: React.FC<childrenPropsType> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, defaultState);

  const isUserAuthenticated = () => !!state.accessToken;

  const createSession = (entity: string, accessToken: string) => {
    dispatch({ type: "CREATE_SESSION", payload: { entity, accessToken } });
  };

  const refreshAccesstoken = async (refreshToken: string, entity: string) => {
    // console.log(entityRefreshLinks[entity]);
    try {
      const res = await axios.post(entityRefreshLinks[entity], {
        refreshToken,
      });
      // console.log(res, res.data);
      createSession(entity, res.data.data.accessToken);
      setTimeout(() => {}, 10000);

      // dispatch({ type: "SET_LOADING", payload: { status: false } });
    } catch (error) {
      if (entity === "Admin") router.push("/admin/auth");
      else router.push("/client/auth");
    }
  };

  useEffect(() => {
    const refreshToken = getCookie("refreshToken");
    const entity = getCookie("entity");

    if (refreshToken && entity && state.accessToken === "") {
      // console.log("working");
      refreshAccesstoken(refreshToken, entity)
        .then(() => {
          dispatch({ type: "SET_LOADING", payload: { status: false } });
        })
        .catch((error) => console.log(error));
      return;
    }

    // setTimeout(() => {}, 10000);

    dispatch({ type: "SET_LOADING", payload: { status: false } });
  }, [state.isLoading]);

  // console.log(state, isUserAuthenticated());
  return (
    <AuthContext.Provider value={{ ...state, createSession, isUserAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AppProvider, useAppContext };
