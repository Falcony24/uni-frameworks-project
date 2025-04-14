import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    return !user ? children : <Navigate to="/profile" replace />;
}

export default PublicRoute;
