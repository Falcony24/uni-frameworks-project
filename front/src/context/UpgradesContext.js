import { createContext, useContext, useEffect, useState } from "react";
import { getUpgrades } from "../api/gameAPI";

const UpgradesContext = createContext(undefined);

export const useUpgrades = () => useContext(UpgradesContext);

export const UpgradesProvider = ({ children }) => {
    const [upgrades, setUpgrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUpgrades = async () => {
            try {
                const data = await getUpgrades();
                if(data)
                    setUpgrades(data);
            } catch (err) {
                console.error("Failed to load upgrades:", err);
            } finally {
                setLoading(false);
            }
        };

        loadUpgrades();
    }, []);

    return (
        <UpgradesContext.Provider value={{ upgrades, setUpgrades, loading }}>
            {children}
        </UpgradesContext.Provider>
    );
}

