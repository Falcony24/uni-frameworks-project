import Index from './Navbar';
import { Outlet } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
        return (
            <>
                <Index />
                    <Outlet />
            </>
        )
}