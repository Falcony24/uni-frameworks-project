import { Card } from "react-bootstrap";
import { upgradeImages } from "../../constants";

export default function GameStatsBox({ player, localUpgrades }) {
    if (!player) return null;

    return (
        <Card className="box">
            <h3><span className="led-indicator"></span>GAME</h3>
            <div className="game-stats">
                <p>Clicks: {player.clicks}</p>
                <p>Currency: {player.currency}</p>
                <p>Items: {player.items.length === 0 ? "Did not unlocked yet" : player.items}</p>
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
    );
}
