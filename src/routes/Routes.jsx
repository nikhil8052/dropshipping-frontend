import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import CoachLayout from '@layout/CoachLayout/CoachLayout';
import StudentLayout from '@layout/StudentLayout/StudentLayout';
import AdminLayout from '@layout/AdminLayout/AdminLayout';
import PublicLayout from '@layout/PublicLayout/PublicLayout';

const Home = lazy(() => import('@pages/Home/Home'));
const Login = lazy(() => import('@pages/Auth/Login'));
const SignUp = lazy(() => import('@pages/Auth/SignUp'));
const Listing = lazy(() => import('@pages/Listing/Listing'));
const ListingDetails = lazy(() => import('@pages/ListingDetails/ListingDetails'));
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route path="login" exact element={<Login />} />
                <Route path="signup" exact element={<SignUp />} />
            </Route>
            {/* protected layout */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index exact element={<Home />} />
                <Route path="products" exact element={<Listing />} />
                <Route path="product/:id" exact element={<ListingDetails />} />
                <Route path="groups/:id" exact element={<Listing />} />
            </Route>
            <Route path="/coach" element={<CoachLayout />}>
                <Route index exact element={<Home />} />
                <Route path="products" exact element={<Listing />} />
                <Route path="product/:id" exact element={<ListingDetails />} />
                <Route path="groups/:id" exact element={<Listing />} />
            </Route>
            <Route path="/student" element={<StudentLayout />}>
                <Route index exact element={<Home />} />
                <Route path="products" exact element={<Listing />} />
                <Route path="product/:id" exact element={<ListingDetails />} />
                <Route path="groups/:id" exact element={<Listing />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default MainRoutes;
