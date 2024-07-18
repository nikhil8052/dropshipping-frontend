import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './auth_actions';

const initialState = {
    loading: false,
    userInfo: null,
    userToken: null,
    error: null,
    isLoggedIn: false,
    success: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.userInfo = null;
            state.userToken = null;
            state.success = false;
            state.loading = false;
            state.error = null;
            state.isLoggedIn = false;
        },
        loginWithoutAPI: (state, { payload }) => {
            state.isLoggedIn = true;
            state.userInfo = { email: payload.email, role: payload.role };
        },
        updateUserInfo: (state, { payload }) => {
            state.userInfo = payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state) => {
                state.userInfo = null;
                state.userToken = null;
                state.loading = true;
                state.error = null;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.userInfo = payload.user;
                state.userToken = payload.token;
                state.loading = false;
                state.error = null;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.userInfo = null;
                state.userToken = null;
                state.loading = false;
                state.error = payload;
                state.isLoggedIn = false;
            })
            .addCase(registerUser.pending, (state) => {
                state.userInfo = null;
                state.userToken = null;
                state.loading = true;
                state.error = null;
                state.isLoggedIn = true;
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.userInfo = payload.user;
                state.userToken = payload.token;
                state.loading = false;
                state.error = null;
                state.isLoggedIn = true;
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.userInfo = null;
                state.userToken = null;
                state.loading = false;
                state.error = payload;
                state.isLoggedIn = false;
            });
    }
});

export const { logoutUser, loginWithoutAPI, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
