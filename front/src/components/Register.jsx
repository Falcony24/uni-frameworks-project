import React, {useState} from 'react'
import { Form, Button } from "react-bootstrap";
import userAPI from '../userAPI'
import axios from "axios";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()

        const configuration = {
            method: "post",
            url: "http://localhost:3000/user/register",
            data: {
                email,
                username,
                password,
            },
            config: { withCredentials: true }
        };

        axios(configuration)
            .then((result) => {
                setRegister(true);
            })
            .catch((error) => {
                error = new Error();
            });
    }

    return (
        <>
            <h2>Register</h2>
            <Form onSubmit={handleSubmit}>
                {/* email */}
                <Form.Group controlId="formRegisterEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter"
                    />
                </Form.Group>

                {/* username */}
                <Form.Group controlId="formRegisterUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                </Form.Group>

                {/* password */}
                <Form.Group controlId="formRegisterPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </Form.Group>

                {/* submit button */}
                <Button
                    variant="primary"
                    type="submit"
                >
                    Register
                </Button>

                {/* display success message */}
                {register ? (
                    <p className="text-success">You Are Registered Successfully</p>
                ) : (
                    <p className="text-danger">You Are Not Registered</p>
                )}
            </Form>
        </>
    )
}