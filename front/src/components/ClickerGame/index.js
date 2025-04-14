import {useCallback, useEffect, useState} from "react";
import at32 from '../../assets/images/ClickerGame/MainClicker/at32.svg'
import { usePlayer } from "../../context/PlayerContext";
import { useUpgrades } from "../../context/UpgradesContext";
import {saveProgress} from "../../api/gameAPI";
import {toast} from "react-toastify";
import {useAuth} from "../../context/AuthContext";
import "./index.css"
import { upgradeImages } from "../constants"
import UpgradesBox from "./UpgradesBox";
import ItemsBox from "./ItemsBox";

export default function Index() {
    const { player, loading: playerLoading, setPlayer } = usePlayer();
    const { user, loading: userLoading } = useAuth();
    const [currency, setCurrency] = useState(player.currency);
    const { upgrades, loading: upgradesLoading } = useUpgrades();
    const [clicks, setClicks] = useState([player.clicks]);
    const buyUpgrade = (upgrade) => {
        const toastId = `upgrade-${upgrade._id}`;
        const existingUpgrade = player.upgrades.find(u => u.upgrade_id === upgrade._id);
        const currentLevel = existingUpgrade?.lvl || 0;
        const upgradeCost = upgrade.base_cost * (currentLevel + 1);

        if (currency < upgradeCost) {
            toast.dismiss(toastId);
            toast.info("Too few electrons", { toastId });
            return;
        }

        let newUpgrades;

        if (existingUpgrade) {
            newUpgrades = player.upgrades.map(u =>
                u.upgrade_id === upgrade._id
                    ? { ...u, lvl: u.lvl + 1 }
                    : u
            );
        } else {
            newUpgrades = [
                ...player.upgrades,
                {
                    upgrade_id: upgrade._id,
                    lvl: 1,
                    unlocked: true
                }
            ];
        }

        const newCurrency = currency - upgradeCost;

        setCurrency(newCurrency);
        setPlayer(prev => ({
            ...prev,
            currency: newCurrency,
            upgrades: newUpgrades
        }));

        toast.dismiss(toastId);
        toast.success(`${upgrade.name} upgraded to level ${currentLevel + 1}`, { toastId });
    };

    const calculateClickPower = (upgrades, player) => {
        if (!Array.isArray(upgrades) || !Array.isArray(player?.upgrades)) {
            return 1;
        }

        const upgrade = upgrades.find(u => u.effect === "CLICK_MULTIPLIER");
        if (!upgrade) return 1;

        const playerUpgrade = player.upgrades.find(u => u.upgrade_id === upgrade._id);
        const level = playerUpgrade?.lvl || 1;

        return upgrade.base_value * level;
    };

    const calculateCrit = (upgrades, player) => {
        if (!Array.isArray(upgrades) || !Array.isArray(player?.upgrades)) {
            return 1;
        }

        const upgrade = upgrades.find(u => u.effect === "CLICK_CRIT");
        if (!upgrade) return 1;
        const playerUpgrade = player.upgrades.find(u => u.upgrade_id === upgrade._id);

        const level = playerUpgrade?.lvl || 1;

        if(Math.random() * 100 <= level) return 2
        else return 1;
    }

    const handleClick = () => {
        const crit = calculateCrit(upgrades, player)
        const click_power = calculateClickPower(upgrades, player);
        const newCurrency = currency + click_power * crit;
        const clicks = player.clicks + 1

        setCurrency(newCurrency);
        setPlayer(prev => ({
            ...prev,
            currency: newCurrency,
            clicks: clicks
        }));
    };


    const saveGame = useCallback(async () => {
        const toastId = "save-progress";
        try {
            const currentPlayer = player;
            if (!user) {
                setPlayer(prev => ({
                    ...prev,
                    currency: currency,
                    clicks: clicks
                }));
                toast.info("Saved locally", { toastId });
                return;
            }

            toast.dismiss();
            toast.loading("Saving...", { toastId });

            await saveProgress(currentPlayer);
            toast.update(toastId, {
                render: "Saved in cloud",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(toastId, {
                render: "Error saving progress",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    }, [user, player, currency]);

    useEffect(() => {
        if (playerLoading || upgradesLoading || userLoading) return;

        const handleBeforeUnload = () => saveGame();
        window.addEventListener("beforeunload", handleBeforeUnload);
        const interval = setInterval(saveGame, 30000);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            clearInterval(interval);
        };
    }, [saveGame, playerLoading, upgradesLoading, userLoading]);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Elektrony: {currency}</h2>
            <img
                src={at32}
                alt="Click me"
                onClick={handleClick}
                style={{ cursor: "pointer", width: "200px", height: "200px" }}
            />
            <div>
                {upgrades.map((upgrade) => (
                    <UpgradesBox
                        key={upgrade._id}
                        playerUpgrades={player.upgrades}
                        upgrade={upgrade}
                        image={upgradeImages[upgrade.name.toLowerCase().replace(/\s+/g, '_')]}
                        currency={currency}
                        onBuy={buyUpgrade}
                    />
                ))}
                <ItemsBox/>
            </div>
        </div>
    );
}

