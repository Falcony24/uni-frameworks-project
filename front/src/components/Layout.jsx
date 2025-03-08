import Navbar from './Navbar';
import {Outlet, Route} from "react-router-dom"
import CliickerGame from "./CliickerGame";

export default function Layout() {
        return (
            <>
                <Navbar />
                    <Outlet />
            </>
        )
}