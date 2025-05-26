import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosWrapper from '../../utils/api';

export const loginUser = createAsyncThunk('auth/api/login', async ({ email, password , ...rest }, { rejectWithValue }) => {
    try {
        const payload = { email, password, ...rest }; 

        const { data } = await axiosWrapper('post', `${import.meta.env.VITE_API_URL}/api/supabase/user/login/email`, payload );
        return data;
      
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ email, password, name }, { rejectWithValue }) => {
        try {
            const { data } = await axiosWrapper('post', `${import.meta.env.VITE_API_URL}/api/user/register`, {
                email,
                password,
                name
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
