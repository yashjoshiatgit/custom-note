import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../app/store';

const ProtectedRoute = ({ requiredRole }) => {
    const { isAuthenticated, user } = useStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
