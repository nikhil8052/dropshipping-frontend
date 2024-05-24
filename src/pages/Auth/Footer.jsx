import './auth.scss';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div>
            <p className="footer-static">© {currentYear} dropship academy x. All Rights Reserved</p>
        </div>
    );
};

export default Footer;
