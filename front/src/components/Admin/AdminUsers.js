import {Button, Table, Badge, Spinner, Form, Tab, Modal, Tabs} from 'react-bootstrap';
import { FaTrash, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { fetchUsers, deleteUser } from '../../api/adminAPI';

export default function AdminUsers() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadUsers = async () => {
        setLoading(true);
        try {
            const usersData = await fetchUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                loadUsers();
            } catch (error) {
                console.error("Deletion failed:", error);
            }
        }
    };

    const filteredUsers = users.filter(userData => {
        const user = userData.user;
        return (
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Users Management</h2>
                <div className="d-flex" style={{ width: '300px' }}>
                    <Form.Control
                        className="admin-search"
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-primary" className="ms-2">
                        <FaSearch />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="mt-3">
                        <thead className="table-dark">
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(userData => (
                            <tr
                                key={userData.user._id}
                                onClick={() => {
                                    setSelectedUser(userData);
                                    setShowDetails(true);
                                }}
                                style={{ cursor: 'pointer' }}
                                className="hover-row"
                            >
                                <td>
                                    <strong>{userData.user.username}</strong>
                                    {userData.user.role === 'ADMIN' && (
                                        <span className="ms-2 badge bg-danger">ADMIN</span>
                                    )}
                                </td>
                                <td>{userData.user.email}</td>
                                <td>
                                    <Badge className={userData.user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}>
                                        {userData.user.role}
                                    </Badge>
                                </td>
                                <td>{new Date(userData.user.created_at).toLocaleDateString()}</td>
                                <td>
                                    <Badge className={userData.player?.ban_status ? 'badge-banned' : 'badge-active'}>
                                        {userData.player?.ban_status ? 'Banned' : 'Active'}
                                    </Badge>
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(userData.user._id)}
                                        disabled={userData.user.role === 'ADMIN'}
                                        title="Delete user"
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
                <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title>
                            User Details: {selectedUser.user.username}
                            {selectedUser.user.role === 'ADMIN' && (
                                <span className="ms-2 badge bg-danger">ADMIN</span>
                            )}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs defaultActiveKey="profile" className="mb-3">
                            {/* Profile Tab */}
                            <Tab eventKey="profile" title="Profile">
                                <div className="p-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5 className="mb-3">Account Information</h5>
                                            <p><strong>Username:</strong> {selectedUser.user.username}</p>
                                            <p><strong>Email:</strong> {selectedUser.user.email}</p>
                                            <p><strong>User ID:</strong> {selectedUser.user._id}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <h5 className="mb-3">Account Status</h5>
                                            <p>
                                                <strong>Role:</strong> {' '}
                                                <Badge bg={selectedUser.user.role === 'ADMIN' ? 'danger' : 'primary'}>
                                                    {selectedUser.user.role}
                                                </Badge>
                                            </p>
                                            <p><strong>Joined:</strong> {new Date(selectedUser.user.created_at).toLocaleString()}</p>
                                            <p>
                                                <strong>Status:</strong> {' '}
                                                {selectedUser.player?.ban_status ? (
                                                    <Badge bg="danger">Banned</Badge>
                                                ) : (
                                                    <Badge bg="success">Active</Badge>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Tab>

                            {/* Player Tab */}
                            <Tab
                                eventKey="player"
                                title="Game Data"
                                disabled={!selectedUser.player}
                            >
                                <div className="p-3">
                                    {selectedUser.player ? (
                                        <>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h5 className="mb-3">Game Statistics</h5>
                                                    <p><strong>Currency:</strong> {selectedUser.player.currency}</p>
                                                    <p><strong>Total Clicks:</strong> {selectedUser.player.clicks}</p>
                                                    <p>
                                                        <strong>Status:</strong> {' '}
                                                        {selectedUser.player.ban_status ? (
                                                            <Badge bg="danger">Banned</Badge>
                                                        ) : (
                                                            <Badge bg="success">Active</Badge>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <h5 className="mb-3">Inventory</h5>
                                                    <p><strong>Items:</strong> {selectedUser.player.items?.length || 0}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h5 className="mb-3">Upgrades</h5>
                                                {selectedUser.player.upgrades?.length > 0 ? (
                                                    <Table striped bordered size="sm">
                                                        <thead>
                                                        <tr>
                                                            <th>Upgrade ID</th>
                                                            <th>Level</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {selectedUser.player.upgrades.map(upgrade => (
                                                            <tr key={upgrade._id}>
                                                                <td>{upgrade.upgrade_id}</td>
                                                                <td>{upgrade.lvl}</td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </Table>
                                                ) : (
                                                    <p className="text-muted">No upgrades purchased</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4 text-muted">
                                            No player data available
                                        </div>
                                    )}
                                </div>
                            </Tab>

                            <Tab
                                eventKey="customer"
                                title="Customer Data"
                                disabled={!selectedUser.customer}
                            >
                                <div className="p-3">
                                    {selectedUser.customer ? (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h5 className="mb-3">Contact Information</h5>
                                                <p><strong>Address:</strong> {selectedUser.customer.address || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted">
                                            No customer data available
                                        </div>
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDetails(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};