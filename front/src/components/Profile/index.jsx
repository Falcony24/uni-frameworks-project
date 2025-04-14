import { useEffect, useState } from "react";
import { fetchUserData } from "../../api/userAPI";
import "./index.css";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ProfileBox from "./ProfileBox";
import {usePlayer} from "../../context/PlayerContext";
import {Card} from "react-bootstrap";
import { upgradeImages } from "../constants"
import {useUpgrades} from "../../context/UpgradesContext";

export async function fetchAndCacheProfileData() {
    const userResponse = await fetchUserData("users");
    const customerResponse = await fetchUserData("customers");

    return {
        user: userResponse ?? null,
        customer: customerResponse ?? null,
    };
}

export default function Index() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState({ user: null, customer: null });
    const { player } = usePlayer();
    const toastId = "auth-profile"
    const { upgrades, loading: upgradesLoading } = useUpgrades();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (upgradesLoading) return;

        const loadProfileData = async () => {
            try {
                const data = await fetchAndCacheProfileData();
                setProfile(prev => ({ ...prev, ...data }));
            } catch (error) {
                toast.warning("Something went wrong, refresh this page", { toastId: "a" });
            }
        };

        loadProfileData();
    }, []);

    const handleLogout = async () => {
        toast.dismiss(toastId);
        try {
            await logout();
        } catch (error) {
            toast.error("Something went wrong, refresh this page", { toastId: toastId });
        }
    };

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
