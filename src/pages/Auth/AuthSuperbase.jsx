import { useEffect, useState } from "react";
import { supabase } from '../../utils/superbase.js';
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        if (user) {
            if (userRole === 'ADMIN') {
                navigate('/admin/courses-supabase');
            } else if (userRole === 'COACH') {
                navigate('/coach');
            } else if (userRole === 'STUDENT') {
                navigate('/student/courses-supabase');
            } else {
                navigate('/login');
            }
        }
    }, [user]);

    useEffect(() => {
        const exchangeCode = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get('code');
            if (code) {
                const data = await supabase.auth.exchangeCodeForSession(code)
                console.log(data, 'data from exchangeCodeForSession');
                if (data?.session) {
                    const session = data.session;
                    if (session?.user) {
                        setUser(session.user);
                        setUserRole(session.user.role || '');
                        const values = {
                            email: session.user.email,
                            password: session.provider_token || '',
                            access_token: session.access_token,
                            refresh_token: session.refresh_token
                        };
                        dispatch(loginUser(values));
                    }
                }

            } else {
                console.warn('No auth code found in URL');
                navigate('/auth/auth-code-error');
            }
        };

        exchangeCode();
    }, []);

    return <div>Logging you in...</div>;
}
