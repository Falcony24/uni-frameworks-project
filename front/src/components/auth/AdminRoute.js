import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    return user === "ADMIN" ? children : <Navigate to="/" />;
};

export default AdminRoute;
