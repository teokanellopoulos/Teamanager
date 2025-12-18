import { combineReducers } from "redux";
import { authReducer } from "./authReducer.js";
import { tokenReducer } from "./tokenReducer.js";

export const allReducers = combineReducers({
    auth: authReducer,
    token: tokenReducer
});
