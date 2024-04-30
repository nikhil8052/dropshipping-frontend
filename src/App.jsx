import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import MainRoutes from './routes/Routes';
import Loading from '@components/Loading/Loading';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryComponent } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <ErrorBoundary fallback={<ErrorBoundaryComponent />}>
            <React.Suspense fallback={<Loading />}>
                <React.Fragment>
                    <MainRoutes />
                    <Toaster
                        toastOptions={{
                            position: 'top-right',
                            duration: 3000
                        }}
                    />
                </React.Fragment>
            </React.Suspense>
        </ErrorBoundary>
    );
}

export default App;
