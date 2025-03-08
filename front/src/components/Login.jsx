import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage("Wprowadź login i hasło.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:3000/user/login",
                { username, password },
                { withCredentials: true }
            );

            setAuthenticated(true);
            setMessage("SUC");
        } catch (error) {
            setMessage(error.response?.data?.message || "Błąd logowania. Spróbuj ponownie.");
        }
    };

    return (
        <>
            <h2>Logowanie</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLoginUsername">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Wprowadź login lub email"
                    />
                </Form.Group>

                <Form.Group controlId="formLoginPassword">
                    <Form.Label>Hasło</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Hasło"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Zaloguj się
                </Button>

                {message && <p className="mt-2">{message}</p>}
            </Form>
        </>
    );
}
