import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from "./context/AuthContext";
import {PlayerProvider} from "./context/PlayerContext";
import {UpgradesProvider} from "./context/UpgradesContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <UpgradesProvider>
            <PlayerProvider>
                <App />
            </PlayerProvider>
        </UpgradesProvider>
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
