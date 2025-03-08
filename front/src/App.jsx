import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CliickerGame from "./components/CliickerGame";
import Profile from "./components/Profile";
import Layout from "./components/Layout";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />} >
                    <Route path="/" element={<CliickerGame />}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />}/>
                </Route>
            </Routes>
        </Router>
    );
}


export default App;