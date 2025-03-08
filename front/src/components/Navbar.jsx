import { Link } from 'react-router-dom'
import { pageData } from "./pageData";
import {Button} from "react-bootstrap";

export default function Navbar() {
    return (
        <div className="navbar">
            {pageData.map((page) => (
                <Link to={page.path} className="navbar-item" key={page.path}>
                    <Button>{page.name}</Button>
                </Link>
            ))}
        </div>
    );
}