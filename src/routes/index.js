import PublicRoutes from './public';
import { adminRoutes, coachesRoutes, studentRoutes } from './protectedRoutes';

export const routes = (role = 'public') => {
    return role === 'admin'
        ? [...adminRoutes, ...PublicRoutes]
        : role === 'coach'
          ? [...coachesRoutes, ...PublicRoutes]
          : role === 'student'
            ? [...studentRoutes, ...PublicRoutes]
            : [...PublicRoutes];
};
