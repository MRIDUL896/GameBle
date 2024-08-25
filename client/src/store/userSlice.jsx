import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn : false,
    userInfo : null,
}

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        login : (state, action) => {
            state.isLoggedIn = true;
            state.userInfo = action.payload;
        } ,
        logout: (state) => {
            state.isLoggedIn = false;
            state.userInfo = null;
        }
    }
});

export const {login,logout} = userSlice.actions;

export default userSlice.reducer;