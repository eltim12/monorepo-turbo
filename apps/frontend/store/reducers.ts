const initialState = {
  user: null,
};

export default function userReducer(state = initialState, action: any) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT_USER":
      return { ...state, user: null };
    default:
      return state;
  }
}
