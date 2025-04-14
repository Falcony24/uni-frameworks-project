import { Link } from 'react-router-dom';
import { pageData } from "../pageData";
import { Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import "./index.css";

export default function Index() {
    const { user, logout } = useAuth();

    const mainPages = ['/game', '/profile'].filter(path =>
        pageData.some(page => page.path === path &&
            (user || !['/profile'].includes(path)))
    );

    const otherPages = pageData.filter(page =>
        !['/login', '/register', '/logout', '/game', '/profile'].includes(page.path)
    );

    return (
        <div className="navbar">
            {/* Empty left group for balance */}
            <div className="navbar-group"></div>

            {/* Center Group - Main navigation */}
            <div className="navbar-group center">
                {otherPages.map((page) => (
                    <Link to={page.path} className="navbar-item" key={page.path}>
                        <Button>{page.name}</Button>
                    </Link>
                ))}
                {mainPages.map((path) => {
                    const page = pageData.find(p => p.path === path);
                    return (
                        <Link to={path} className="navbar-item" key={path}>
                            <Button>{page.name}</Button>
                        </Link>
                    );
                })}
            </div>

            {/* Right Group - Auth/Logout */}
            <div className="navbar-group right">
                {!user ? (
                    <>
                        <Link to="/login" className="navbar-item">
                            <Button>Login</Button>
                        </Link>
                        <Link to="/register" className="navbar-item">
                            <Button>Register</Button>
                        </Link>
                    </>
                ) : (
                    <div className="navbar-item logout">
                        <Button onClick={logout}>Logout</Button>
                    </div>
                )}
            </div>
        </div>
    );
}