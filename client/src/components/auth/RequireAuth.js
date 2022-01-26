import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const RequireAuth = () => {
    const {
        authState: { isAuthenticated }
    } = useContext(AuthContext);

    const location = useLocation();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to='/login' state={{ from: location }} />
    );
};

export default RequireAuth;
