import { Card, Button } from "react-bootstrap";

export default function ShoppingBox({ address }) {
    if (!address) return null;

    return (
        <Card className="box">
            <h1>Address</h1>
            <p>City: {address}</p>
            <Button variant="secondary">Change address</Button>
        </Card>
    );
}
