const initialState = {
    athlete: {},
    isLogged: false,
    isAdmin: false
};

export const authReducer = (state = initialState, action) => {
    switch(action.type){
        case "LOGIN":
            return {
                ...state,
                isLogged: true
            }
        case "GET_ATHLETE":
            return {
                ...state,
                athlete: action.payload.athlete,
                isAdmin: action.payload.isAdmin
            }
        default:
            return state;
    }
}
