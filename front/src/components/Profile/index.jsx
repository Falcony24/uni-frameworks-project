import { useEffect, useState } from "react";
import { fetchUserData } from "../../api/userAPI";
import "./index.css";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ProfileBox from "./ProfileBox";
import {usePlayer} from "../../context/PlayerContext";
import {Card, Spinner} from "react-bootstrap";
import {useUpgrades} from "../../context/UpgradesContext";
import GameStatsBox from "./GameStatsBox";
import ShoppingBox from "./ShoppingBox";

export async function fetchAndCacheProfileData() {
    const [userResponse, customerResponse] = await Promise.all([
        fetchUserData("users"),
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
                    <GameStatsBox player={player} localUpgrades={localUpgrades} />
                )}
                {profile.customer?.address && (
                    <ShoppingBox address={profile.customer.address} />
                )}
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
}
