import { useEffect, useState } from "react";
import { fetchUserData } from "../../api/userAPI";
import "./index.css";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ProfileBox from "./ProfileBox";
import {usePlayer} from "../../context/PlayerContext";
import {Card, Spinner} from "react-bootstrap";
import { upgradeImages } from "../constants"
import {useUpgrades} from "../../context/UpgradesContext";

export async function fetchAndCacheProfileData() {
    const [userResponse, customerResponse] = await Promise.all([
        fetchUserData("users"),
        fetchUserData("customers")
    ]);

    return {
        user: userResponse || null,
        customer: customerResponse || null,
    };
}

export default function Index() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState({ user: null, customer: null });
    const [loading, setLoading] = useState(true);
    const { player } = usePlayer();
    const toastId = "auth-profile";
    const { upgrades, loading: upgradesLoading } = useUpgrades();

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setLoading(true);
                const data = await fetchAndCacheProfileData();
                setProfile(data);
            } catch (error) {
                toast.warning("Failed to load profile data", { toastId });
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, []);

    const handleLogout = async () => {
        toast.dismiss(toastId);
        try {
            await logout();
        } catch (error) {
            toast.error("Logout failed", { toastId });
        }
    };

    if (loading || upgradesLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="container">
            <ProfileBox user={profile.user} setProfile={setProfile} />
            <div className="bottom-boxes">
                {player && (
                    <Card className="box">
                        <h1>Game</h1>
                        <p>Clicks: {player?.clicks}</p>
                        <p>Currency: {player?.currency}</p>
                        <p>Items: {player?.items.length === 0 ? "Did not unlocked yet" : player.items}</p>
                        {upgrades.map((upgrade) => (
                            <img
                                key={upgrade._id}
                                src={upgradeImages[upgrade.name.toLowerCase().replace(/\s+/g, '_')]}
                                alt={upgrade.name}
                                className={`upgrade-image`}
                            />
                        ))}
                    </Card>
                )}
                {profile.customer?.address && (
                    <Card className="box">
                        <h1>Address</h1>
                        <p>City: {profile.customer.address}</p>
                        <button>Change address</button>
                    </Card>
                )}
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
}
