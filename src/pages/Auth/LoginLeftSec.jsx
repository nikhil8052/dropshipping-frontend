import { Col } from 'react-bootstrap';
import fbIcon from '@icons/fb-logo.png';
import twitterIconn from '@icons/twitter-logo.png';
import instalogin from '@icons//insta-logo.png';
import logoImg from '@icons/logo-main.png';
import './auth.scss';

const LoginLeftSec = () => {
    return (
        <Col xs={12} sm={12} md={12} lg={6}>
            <div className="auth-left-header-mob ">
                <img className="auth-logo " src={logoImg} alt="auth-logo" />
            </div>
            <div className="auth-left-bg-column">
                <img className="auth-logo" src={logoImg} alt="auth-logo" />
                <div className="auth-left-footer mx-auto">
                    <img className="auth-social-logo" src={fbIcon} alt="fb-logo" />
                    <img className="auth-social-logo" src={twitterIconn} alt="twitter-logo" />
                    <img className="auth-social-logo" src={instalogin} alt="insta-logo" />
                </div>
            </div>
        </Col>
    );
};

export default LoginLeftSec;
