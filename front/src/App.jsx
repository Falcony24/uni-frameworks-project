import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Index from "./components/ClickerGame";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
import PublicRoute from "./components/auth/PublicRoute";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import "./App.css"
import "./login_register.css"
import "./toast.css"
import AdminRoute from "./components/auth/AdminRoute";
import Admin from "./components/Admin";

function App() {
    return (
        <Router>
            <ToastContainer
                position={"bottom-center"}
                autoClose={2000}
                closeOnClick={true}
                pauseOnHover={false}
                pauseOnFocus={false}
                pauseOnFocusLoss={false}
            />
            <Routes>
                <Route element={<Layout />} >
                    <Route path="/" element={<Index />}/>

                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />

                    <Route path="/register" element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    } />

                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }/>

                    <Route path="/admin" element={
                        <AdminRoute>
                            <Admin/>
                        </AdminRoute>
                    }/>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}


export default App;