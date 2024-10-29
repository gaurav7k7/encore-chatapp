export const initialState = {
    user: null, // Correctly set null without quotes
  };
  
  export const actionTypes = {
    SET_USER: "SET_USER",
  };
  
  const reducer = (state, action) => {
    console.log("Reducer action:", action); // Log action for debugging
    switch (action.type) {
      case actionTypes.SET_USER:
        return {
          ...state,
          user: action.user, // Update user state when action is SET_USER
        };
      default:
        return state;
    }
  };
  
  export default reducer;