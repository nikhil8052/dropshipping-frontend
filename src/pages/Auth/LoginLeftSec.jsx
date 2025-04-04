import { Col } from 'react-bootstrap';
import fbIcon from '@icons/fb-logo2.png';
// import twitterIconn from '@icons/twitter-logo.png';
import instalogin from '@icons//insta-logo2.png';
import logoImg from '@icons/logomain2.png';
import './auth.scss';

const LoginLeftSec = () => {
    return (
        <div className='top-bar'>
            <div className="auth-left-header-mob ">
                <img className="auth-logo " src={logoImg} alt="auth-logo" />
            </div>
            {/* <div className="auth-left-bg-column">
                <div className="auth-left-footer">
                    <a href="https://www.facebook.com/DropshipAcademyNL" target='_blank'><img className="auth-social-logo" src={fbIcon} alt="fb-logo" /></a>
                    <a href="https://www.instagram.com/joshuakaats/" target='_blank'><img className="auth-social-logo" src={instalogin} alt="fb-logo" /></a>
                </div>
            </div> */}
        </div>
    );
};

export default LoginLeftSec;
