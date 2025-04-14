import { createContext, useContext, useEffect, useState } from "react";
import {authenticateUser, signOut} from "../api/authAPI";
import { Spinner, Container } from "react-bootstrap";
import {toast} from "react-toastify";
import {clearAllCookies} from "../utilCookie";

const AuthContext = createContext(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifyToken = async () => {
        const isAuthenticated = await authenticateUser();
        console.log(isAuthenticated)
        setUser(isAuthenticated);
        setLoading(false);
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const logout = async () => {
        setUser(null);
        await signOut();
        toast.success("Logout successful", { toastId: "logout" });
        clearAllCookies();
    };


    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {loading ? (
                <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
