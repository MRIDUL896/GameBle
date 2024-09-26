import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    otherUserInfo: 'x',
    page : "Home",
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
        updateFriends : (state,action) => {
            if(state.userInfo) state.userInfo.friends = action.payload;
        },
        updatePendingFriendRequests : (state,action) => {
            if(state.userInfo) state.userInfo.pendingFriendRequests = action.payload;
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
        },
        updateOtherUserInfo : (state,action) => {
            state.otherUserInfo = action.payload;
        }
    }
});

export const { login, logout, updateBalance, updatePage, updateCurrentChating,updateFriends,
    updatePendingFriendRequests
} = userSlice.actions;

export default userSlice.reducer;