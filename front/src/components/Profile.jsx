import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/user/profile", { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch((err) => {
                setError("Unauthorized. Please log in.");
                console.error(err);
            });
    });

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3000/user/logout", {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h2>Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
