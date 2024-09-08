import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    page : "games",
    currentChating : ""
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userInfo = null;
        },
        updateBalance: (state, action) => {
            if (state.userInfo) {
                state.userInfo.balance = action.payload;
            }
        },
        updatePage : (state, action) => {
            state.page = action.payload;
        },
        updateCurrentChating : (state,action) => {
            state.currentChating = action.payload;
        }
    }
});

export const { login, logout, updateBalance, updatePage, updateCurrentChating } = userSlice.actions;

export default userSlice.reducer;