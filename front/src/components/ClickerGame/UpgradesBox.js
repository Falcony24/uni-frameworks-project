import { useState } from "react";

const UpgradesBox = ({ playerUpgrades, upgrade, image, currency, onBuy }) => {
    const [isHovered, setIsHovered] = useState(false);

    const playerUpgrade = playerUpgrades.find(u => u.upgrade_id === upgrade._id);
    const currentLevel = playerUpgrade?.lvl || 0;
    const nextLevelCost = upgrade.base_cost * (currentLevel + 1);
    const currentValue = upgrade.base_value * currentLevel;

    const handleClick = () => {
        if (currency >= nextLevelCost) {
            onBuy(upgrade);
        }
    };

    return (
        <div
            className="upgrade-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={image}
                alt={upgrade.name}
                className={`upgrade-image ${currency < nextLevelCost ? "disabled" : ""}`}
                onClick={handleClick}
            />

            {isHovered && (
                <div className="upgrade-tooltip">
                    <h4>{upgrade.name}</h4>
                    <div>Level: {currentLevel}</div>
                    <p>Next Cost: {nextLevelCost}⚡</p>
                    <p>Description: {upgrade.effect}</p>
                    <p>Current level: {currentValue}x</p>
                </div>
            )}
        </div>
    );
};

export default UpgradesBox;