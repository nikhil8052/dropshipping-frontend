import StudentRoutes from './student';
import CoachRoutes from './coach';
import PublicRoutes from './public';
import AdminRoutes from './admin';

export const routes = (role = 'PUBLIC') => {
    return role === 'STUDENT'
        ? [...StudentRoutes, ...PublicRoutes]
        : role === 'COACH'
          ? [...CoachRoutes, ...PublicRoutes]
          : role === 'ADMIN'
            ? [...AdminRoutes, ...PublicRoutes]
            : [...PublicRoutes];
};
