import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateGoogleTokens } from '../../redux/auth/auth_slice';
import Loading from '@components/Loading/Loading';
import axiosWrapper from '../../utils/api';
import { API_URL } from '../../utils/apiUrl';

let isCall = false;

const CallBack = () => {
    const location = useLocation();
    const token = useSelector((state) => state?.auth?.userToken);
    const { userInfo } = useSelector((state) => state?.auth);
    const role = userInfo?.role?.toLowerCase();
    const eventId = useSelector((state) => state?.root?.eventId);
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getToken = async (accessCode) => {
        try {
            const response = await axiosWrapper('GET', `${API_URL.CALLBACK}?code=${accessCode}`, {}, token);
            const { googleTokens } = response.data;

            if (googleTokens) {
                dispatch(
                    updateGoogleTokens({
                        googleTokens
                    })
                );
            }

            switch (role) {
                case 'admin':
                    if (eventId) {
                        navigate('/admin/events/edit', {
                            state: {
                                eventId
                            }
                        });
                    } else navigate('/admin/events/new');
                    break;
                case 'coach':
                    if (eventId) {
                        navigate('/coach/events/edit', {
                            state: {
                                eventId
                            }
                        });
                    } else navigate('/coach/events/new');
                    break;
                case 'student':
                    if (eventId) {
                        navigate('/student/events/edit', {
                            state: {
                                eventId
                            }
                        });
                    } else navigate('/student/events/');
                    break;
                default:
                    navigate('/login');
                    break;
            }
        } catch (error) {
            navigate('/login');
        }
    };

    useEffect(() => {
        if (code && !isCall) {
            isCall = true;
            getToken(code);
        }
    }, [code]);

    return (
        <div>
            <Loading />
        </div>
    );
};

export default CallBack;
