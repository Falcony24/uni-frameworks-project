import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import { signIn } from "../../api/authAPI"
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { usersLoginSchema } from "../../shared/schemas/usersSchema";
import { validationSchema } from "../../authUtil";

export default function Index() {
    const [user, setUserr] = useState({
        username: "",
        password: "",
    })
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const toastId = "auth-signin"

    function handleChange(e) {
        setUserr({ ...user, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e){
        e.preventDefault();

        const validation = usersLoginSchema.safeParse(user);
        setErrors(validationSchema(validation));

        toast.dismiss(toastId);
        try{
            await signIn(user)
            setUser(true);
            toast.success("Signing successful", { toastId: toastId });
            navigate("/profile");
        } catch (error){
            console.log(error)
            toast.error(error.message, { toastId: toastId });
        }
    }

    return (
        <div className="box">
            <h2>Signin</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLoginUsername">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        placeholder="Enter username or email"
                        isInvalid={errors?.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors?.username && errors.username.map((error, index) => (
                            <div key={index} className="text-danger">
                                {error}
                            </div>
                        ))}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formLoginPassword">
                    <Form.Label>Hasło</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        isInvalid={errors?.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors?.password && errors.password.map((error, index) => (
                            <div key={index} className="text-danger">
                                {error}
                            </div>
                        ))}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    );
}
