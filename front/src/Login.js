import React, {useState} from 'react'
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const configuration = {
            method: "post",
            url: "http://localhost:3000/users/login",
            data: {
                username,
                password,
            },
        };

        axios(configuration)
            .then((result) => {
                setLogin(true);
            })
            .catch((error) => {
                error = new Error();
            });
    }

    return (
        <>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
                {/* username / email*/}
                <Form.Group controlId="formLoginUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username or email"/>
                </Form.Group>


                {/* password */}
                <Form.Group controlId="formLoginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"/>
                </Form.Group>

                {/* submit button */}
                <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => handleSubmit(e)}>
                    Login
                </Button>

                {/* display success message */}
                {login ? (
                    <p className="text-success">You Are Logged in Successfully</p>
                ) : (
                    <p className="text-danger">You Are Not Logged in</p>
                )}
            </Form>
        </>
    )
}