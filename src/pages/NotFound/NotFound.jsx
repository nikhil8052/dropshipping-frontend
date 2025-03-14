import React from 'react';
import { Helmet } from 'react-helmet';
import './notFound.scss';

const NotFound = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>404 Not Found | Dropship Academy</title>
            </Helmet>

            <div className="error_boundary">
                <img className="img" src="/not-found.png" alt="not-found" />
                <p>Requested page not found!</p>
            </div>
        </React.Fragment>
    );
};

export default NotFound;
