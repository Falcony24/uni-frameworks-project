import { createContext, useContext, useEffect, useState } from "react";
import { Spinner, Container } from "react-bootstrap";
import { fetchUserData } from "../api/userAPI";
import { useAuth } from "./AuthContext";
import { useUpgrades } from "./UpgradesContext";

const PlayerContext = createContext(undefined);
export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const { user } = useAuth();
    const { upgrades, loading: upgradesLoading } = useUpgrades();

    const [player, setPlayer] = useState({
        currency: 0,
        clicks: 0,
        items: [],
        upgrades: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const data = await fetchUserData("players");
                    if (data) setPlayer(data);
                } else {
                    const local = localStorage.getItem("player");
                    if (local) setPlayer(JSON.parse(local));
                }
            } catch (error) {
                console.error("Error fetching player data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        if (!user && !loading && !upgradesLoading && player.upgrades.length === 0) {
            const clickUpgrade = upgrades.find(u => u.effect === "CLICK_MULTIPLIER");
            if (clickUpgrade) {
                setPlayer(prev => ({
                    ...prev,
                    upgrades: [{
                        upgrade_id: clickUpgrade._id,
                        lvl: 1,
                        unlocked: true
                    }]
                }));
            }
        }
    }, [user, loading, upgradesLoading, upgrades, player.upgrades]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem("player", JSON.stringify(player));
        }
    }, [player, user]);

    return (
        <PlayerContext.Provider value={{ player, setPlayer, loading }}>
            {loading ? (
                <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            ) : (
                children
            )}
        </PlayerContext.Provider>
    );
};
