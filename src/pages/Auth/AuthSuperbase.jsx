// src/pages/Test.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/superbase';
import axios from 'axios';
import { loginUser } from '@redux/auth/auth_actions';
import { useSelector, useDispatch } from 'react-redux';

const AuthSuperbase = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const handleOAuthCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            const values = {
                email: session.user.email,
                password:'supa',
                auth_type: 'superbase'
            }
            dispatch(loginUser(values));
        };

        handleOAuthCallback();
    }, []);

    return <div>Logging in, please wait...</div>;
};

export default AuthSuperbase;
