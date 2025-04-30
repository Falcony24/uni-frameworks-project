import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import { signUp } from '../../api/authAPI';
import { useNavigate } from "react-router-dom";
import { usersSchema } from "../../shared/schemas/usersSchema";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { validationSchema } from "../../authUtil";

export default function Index() {
    const [user, setUserr] = useState({
        email: "",
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const toastId = "auth-register"

    function handleChange(e) {
        setUserr({ ...user, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validation = usersSchema.safeParse(user);
        setErrors(validationSchema(validation));

        if (!validation.success) return;

        toast.dismiss(toastId);
        try {
            await signUp(user);
            setUser(true);
            toast.success("Signup successful", { toastId: toastId });
            setTimeout(() => navigate("/profile"));
        } catch (error) {
            toast.error((error.response.data.message || "Signup failed"), { toastId: toastId });
        }
    }


    return (
        <div className="box">
            <h2>Signup</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRegisterEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        isInvalid={!!errors?.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors?.email && errors.email.map((error, index) => (
                            <div key={index} className="text-danger">
                                {error}
                            </div>
                        ))}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formRegisterUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        isInvalid={!!errors?.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors?.username && errors.username.map((error, index) => (
                            <div key={index} className="text-danger">
                                {error}
                            </div>
                        ))}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* password */}
                <Form.Group controlId="formRegisterPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Password"
                        isInvalid={!!errors?.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors?.password && errors.password.map((error, index) => (
                            <div key={index} className="text-danger">
                                {error}
                            </div>
                        ))}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* submit button */}
                <Button className="register-btn" variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </div>
    );
}
