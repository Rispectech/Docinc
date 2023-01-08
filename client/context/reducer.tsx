type ReducerActionType =
  | {
      type: "CREATE_SESSION";
      payload: {
        accessToken: String;
        entity: String;
      };
    }
  | {
      type: "SET_LOADING";
      payload: {
        status: boolean;
      };
    };
const reducer = (state: authStateContextType, action: ReducerActionType) => {
  switch (action.type) {
    case "CREATE_SESSION":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        entity: action.payload.entity,
      } as authStateContextType;
      break;

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload.status,
      } as authStateContextType;
    default:
      throw new Error();
      break;
  }
};

export default reducer;
