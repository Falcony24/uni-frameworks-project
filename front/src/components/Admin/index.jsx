import { useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import AdminUpgrades from './AdminUpgrades';
import AdminUsers from './AdminUsers';
import "./index.css"

export default function AdminIndex() {
    const [activeComponent, setActiveComponent] = useState('dashboard');

    const renderComponent = () => {
        switch(activeComponent) {
            case 'upgrades':
                return <AdminUpgrades />;
            case 'users':
                return <AdminUsers />;
            default:
                return (
                    <div className="admin-welcome">
                        <h3>Admin Dashboard</h3>
                        <p>Select a section to manage</p>
                    </div>
                );
        }
    };

    return (
        <div className="admin-index">
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body className="d-flex gap-3">
                            <Button
                                variant={activeComponent === 'dashboard' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveComponent('dashboard')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant={activeComponent === 'upgrades' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveComponent('upgrades')}
                            >
                                Manage Upgrades
                            </Button>
                            <Button
                                variant={activeComponent === 'users' ? 'primary' : 'outline-primary'}
                                onClick={() => setActiveComponent('users')}
                            >
                                Manage Users
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            {renderComponent()}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};