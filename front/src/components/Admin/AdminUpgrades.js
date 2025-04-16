import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getUpgrades, createUpgrade, updateUpgrade, deleteUpgrade } from '../../api/gameAPI';

const UpgradeForm = ({
                         show,
                         onHide,
                         onSubmit,
                         formData,
                         setFormData,
                         isEditing
                     }) => (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Edit' : 'Create'} Upgrade</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmit}>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Effect</Form.Label>
                    <Form.Select
                        value={formData.effect}
                        onChange={(e) => setFormData({...formData, effect: e.target.value})}
                        required
                    >
                        <option value="">Select Effect</option>
                        <option value="CLICK_POWER">Click power</option>
                        <option value="AUTO_CLICK">Auto Click</option>
                        <option value="CLICK_CRIT_CHANCE">Click crit chance</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Base Value</Form.Label>
                    <Form.Control
                        type="number"
                        value={formData.base_value}
                        onChange={(e) => setFormData({...formData, base_value: e.target.value})}
                        required
                        min="0"
                        step="0.1"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Base Cost</Form.Label>
                    <Form.Control
                        type="number"
                        value={formData.base_cost}
                        onChange={(e) => setFormData({...formData, base_cost: e.target.value})}
                        required
                        min="0"
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    {isEditing ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
);

const UpgradeRow = ({ upgrade, onEdit, onDelete }) => (
    <tr>
        <td>{upgrade.name}</td>
        <td>{upgrade.effect}</td>
        <td>{upgrade.base_value}</td>
        <td>{upgrade.base_cost}</td>
        <td>
            <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => onEdit(upgrade)}
                aria-label={`Edit ${upgrade.name}`}
            >
                <FaEdit />
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(upgrade._id)}
                aria-label={`Delete ${upgrade.name}`}
            >
                <FaTrash />
            </Button>
        </td>
    </tr>
);

export default function AdminUpgrades() {
    const [upgrades, setUpgrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentUpgrade, setCurrentUpgrade] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        effect: '',
        base_value: 0,
        base_cost: 0
    });

    useEffect(() => {
        fetchUpgrades();
    }, []);

    const fetchUpgrades = async () => {
        setLoading(true);
        try {
            const upgradesData = await getUpgrades();
            setUpgrades(upgradesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUpgrade) {
                await updateUpgrade(currentUpgrade._id, formData);
            } else {
                await createUpgrade(formData);
            }
            fetchUpgrades();
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this upgrade permanently?')) {
            try {
                await deleteUpgrade(id);
                fetchUpgrades();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEditClick = (upgrade) => {
        setCurrentUpgrade(upgrade);
        setFormData({
            name: upgrade.name,
            effect: upgrade.effect,
            base_value: upgrade.base_value,
            base_cost: upgrade.base_cost
        });
        setShowModal(true);
    };

    return (
        <div className="admin-upgrades">
            <div className="d-flex justify-content-between mb-4">
                <h2>Upgrades Management</h2>
                <Button
                    className="admin-nav-btn"
                    onClick={() => {
                        setCurrentUpgrade(null);
                        setFormData({
                            name: '',
                            effect: '',
                            base_value: 0,
                            base_cost: 0
                        });
                        setShowModal(true);
                    }}
                >
                    Add New Upgrade
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Effect</th>
                        <th>Base Value</th>
                        <th>Base Cost</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {upgrades.map(upgrade => (
                        <UpgradeRow
                            key={upgrade._id}
                            upgrade={upgrade}
                            onEdit={handleEditClick}
                            onDelete={handleDelete}
                        />
                    ))}
                    </tbody>
                </Table>
            )}

            <UpgradeForm
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!currentUpgrade}
            />
        </div>
    );
}