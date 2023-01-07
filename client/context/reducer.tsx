type ReducerActionType = {
  type: "LOGIN";
  payload: {
    accessToken: String;
    entity: String;
  };
};

const reducer = (state: authContextType, action: ReducerActionType) => {
  switch (action.type) {
    case "LOGIN":
      break;

    default:
      throw new Error();
      break;
  }
};

export default reducer;
