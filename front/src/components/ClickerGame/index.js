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
    const [showCritical, setShowCritical] = useState(false);
    const [clickEffect, setClickEffect] = useState(false);
    const [floatingValues, setFloatingValues] = useState([]);
    const [currencyBounce, setCurrencyBounce] = useState(false);

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

        const upgrade = upgrades.find(u => u.effect === "CLICK_POWER");
        if (!upgrade) return 1;

        const playerUpgrade = player.upgrades.find(u => u.upgrade_id === upgrade._id);
        const level = playerUpgrade?.lvl || 1;

        return upgrade.base_value * level;
    };

    const calculateCrit = (upgrades, player) => {
        if (!Array.isArray(upgrades) || !Array.isArray(player?.upgrades)) {
            return 1;
        }

        const upgrade = upgrades.find(u => u.effect === "CLICK_CRIT_CHANCE");
        if (!upgrade) return 1;
        const playerUpgrade = player.upgrades.find(u => u.upgrade_id === upgrade._id);

        const level = playerUpgrade?.lvl || 1;

        if(Math.random() * 100 <= level) return 2
        else return 1;
    }


    const handleClick = (e) => {
        const crit = calculateCrit(upgrades, player);
        const click_power = calculateClickPower(upgrades, player);
        const value = click_power * crit;
        const newCurrency = currency + value;
        const clicks = player.clicks + 1;

        // Show click effect
        setClickEffect(true);
        setTimeout(() => setClickEffect(false), 400);

        // Add floating value
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setFloatingValues(prev => [
            ...prev,
            {
                id: Date.now(),
                value: `+${value}`,
                x: x,
                y: y,
                critical: crit > 1
            }
        ]);
        setCurrencyBounce(true);
        setTimeout(() => setCurrencyBounce(false), 500);

        // Update state
        setCurrency(newCurrency);
        setPlayer(prev => ({
            ...prev,
            currency: newCurrency,
            clicks: clicks
        }));
    };
    useEffect(() => {
        if (floatingValues.length > 0) {
            const timer = setTimeout(() => {
                setFloatingValues(prev => prev.slice(1));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [floatingValues]);

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
        <div className="clicker-container">
            <h2>Elektrony: <span className={`currency-display ${currencyBounce ? 'currency-update' : ''}`}>
            {currency}
        </span>⚡</h2>

            <div className="clicker-image-container">
                <img
                    src={at32}
                    alt="Click me"
                    className="clicker-image"
                    onClick={handleClick}
                />
                {clickEffect && <div className="click-effect"></div>}
                {floatingValues.map((fv) => (
                    <div
                        key={fv.id}
                        className={`floating-value ${fv.critical ? 'critical' : ''}`}
                        style={{
                            left: `${fv.x}px`,
                            top: `${fv.y}px`
                        }}
                    >
                        {fv.value}
                    </div>
                ))}
            </div>

            <div className="upgrades-grid">
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
            </div>

            <div className="items-container">
                <ItemsBox/>
            </div>
        </div>
    );
}

