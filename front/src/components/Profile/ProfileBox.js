import { useState } from "react";
import { Card, Button, Form, Row, Col, Collapse } from "react-bootstrap";
import { changeUsername, changePassword } from "../../api/userAPI";
import { toast } from "react-toastify";
import "./ProfileBox.css";

export default function ProfileBox({ user, setProfile }) {
    const [newUsername, setNewUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showUsernameForm, setShowUsernameForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const handleChangeUsername = async () => {
        if (!newUsername.trim()) return toast.error("Username cannot be empty");

        try {
            setLoading(true);
            await changeUsername(newUsername.trim());
            toast.success("Username changed!");
            setNewUsername("");
            setShowUsernameForm(false);
            setProfile(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    username: newUsername.trim()
                }
            }));

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) return toast.error("Please fill all fields");

        try {
            setLoading(true);
            let a = await changePassword(currentPassword, newPassword);
            console.log(a)
            toast.success("Password changed!");
            setCurrentPassword("");
            setNewPassword("");
            setShowPasswordForm(false);
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="box">
            <h3>Account Settings</h3>
            <p><strong>Username:</strong> { user?.username }</p>

            { !showPasswordForm &&
                <div className="section">
                    <Button
                        variant="outline-primary"
                        onClick={() => setShowUsernameForm(prev => !prev)}
                    >
                        {showUsernameForm ? "Cancel" : "Change Username"}
                    </Button>
                    <Collapse in={showUsernameForm}>
                        <div>
                            <Form className="mt-3">
                                <Form.Group controlId="formNewUsername">
                                    <Form.Label>New Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter new username"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        disabled={loading}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    className="mt-2"
                                    onClick={handleChangeUsername}
                                    disabled={loading}
                                >
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </Collapse>
                </div>
            }
            { !showUsernameForm &&
                <div className="section">
                    <Button
                        variant="outline-warning"
                        onClick={() => setShowPasswordForm(prev => !prev)}
                    >
                        {showPasswordForm ? "Cancel" : "Change Password"}
                    </Button>
                    <Collapse in={showPasswordForm}>
                        <div>
                            <Form className="mt-3">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="formCurrentPassword">
                                            <Form.Label>Current Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Current password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="formNewPassword">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="New password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button
                                    variant="warning"
                                    className="mt-3"
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                >
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </Collapse>
                </div>
            }
        </Card>
    );
}
