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
    const [localUpgrades, setLocalUpgrades] = useState([]);

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setLoading(true);
                const data = await fetchAndCacheProfileData();

                if (!player?.upgrades || !upgrades) return;

                const result = upgrades.filter(item => {
                    const matchingItem = player.upgrades.find(i => i.upgrade_id === item._id);
                    return matchingItem && matchingItem.lvl > 0;
                });

                setLocalUpgrades(result);
                setProfile(data);
            } catch (error) {
                toast.warning("Failed to load profile data", { toastId });
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [player, upgrades]);

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
                        <h3><span className="led-indicator"></span>GAME</h3>
                        <div className="game-stats">
                            <p>Clicks: {player?.clicks}</p>
                            <p>Currency: {player?.currency}</p>
                            <p>Items: {player?.items.length === 0 ? "Did not unlocked yet" : player.items}</p>
                        </div>
                        <div className="unlocks-section">
                            <h4><p>Unlocked Upgrades:</p></h4>
                            <div className="upgrades-grid">
                                {localUpgrades.map((upgrade) => (
                                    <div key={upgrade._id} className="upgrade-item">
                                        <img
                                            src={upgradeImages[upgrade.name.toLowerCase().replace(/\s+/g, '_')]}
                                            alt={upgrade.name}
                                            className="upgrade-image"
                                        />
                                        <small>{upgrade.name}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
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
