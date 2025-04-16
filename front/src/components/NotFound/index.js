import { useNavigate } from 'react-router-dom';
import './index.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404 - Circuit Not Found</h1>
                <p className="not-found-message">The path you're trying to access doesn't exist in this system.</p>

                <div className="circuit-animation">
                    <div className="circuit-line"></div>
                    <div className="chip"></div>
                    <div className="circuit-line"></div>
                </div>

                <button
                    className="not-found-button"
                    onClick={() => navigate('/')}
                >
                    Return to Main Board
                </button>
            </div>
        </div>
    );
}

export default NotFound;