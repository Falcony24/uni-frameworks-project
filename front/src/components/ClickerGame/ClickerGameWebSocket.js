import { useEffect, useState } from "react";
import at32 from '../../assets/images/ClickerGame/MainClicker/at32.svg'
import userAPI from '../../api/userAPI'

const socket = new WebSocket("ws://localhost:5000");

export default function Index() {
    const [clicks, setClicks] = useState(0);

    const handleClick = () => {
        setClicks(prev => prev + 1);
        socket.send(JSON.stringify({ type: "click", clicks: 1 }));
    };

    useEffect(() => {
        socket.onmessage = (event) => {
            console.log("Server message:", event.data);
        };
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Kliknięcia: {clicks}</h2>
            <img
                src={at32}
                alt="Kliknij mnie"
                onClick={handleClick}
                style={{ cursor: "pointer", width: "200px", height: "200px" }}
            />
        </div>
    );
};
