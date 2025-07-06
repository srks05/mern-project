import React, { useContext, useState, useEffect } from 'react';
import AuthContext from "../context/AuthContext";
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await fetch('http://localhost:4646/api/auth/getallusers');
                const usersData = await usersResponse.json();
                setUsers(usersData);

                const propertiesResponse = await fetch('http://localhost:4646/api/properties');
                const propertiesData = await propertiesResponse.json();
                setProperties(propertiesData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalUsers = users.length;
    const totalSellers = users.filter(u => u.role === 'Seller').length;
    const totalBuyers = users.filter(u => u.role === 'Buyer').length;
    const totalAdmins = users.filter(u => u.role === 'Admin').length;

    const totalProperties = properties.length;
    const pendingProperties = properties.filter(p => p.status === 'Pending').length;
    const approvedProperties = properties.filter(p => p.status === 'Approved').length;
    const rejectedProperties = properties.filter(p => p.status === 'Rejected').length;
    const onSellProperties = properties.filter(p => p.status === 'OnSell').length;
    const soldProperties = properties.filter(p => p.status === 'Selled').length;

    if (loading) {
        return <div className="text-center mt-5">Loading dashboard data...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container-fluid py-4">
                <h1 className="mb-4">Admin Dashboard</h1>

                {/* Welcome message */}
                <div className="alert alert-info">
                    Welcome back, <strong>{user?.username}</strong>! Here's what's happening with your platform.
                </div>

                {/* User Statistics */}
                <div className="row mb-4">
                    <div className="col-md-3 mb-4">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <h5 className="card-title">Total Users</h5>
                                <h2 className="card-text">{totalUsers}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-success text-white">
                            <div className="card-body">
                                <h5 className="card-title">Sellers</h5>
                                <h2 className="card-text">{totalSellers}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <h5 className="card-title">Buyers</h5>
                                <h2 className="card-text">{totalBuyers}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-warning text-dark">
                            <div className="card-body">
                                <h5 className="card-title">Admins</h5>
                                <h2 className="card-text">{totalAdmins}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Property Statistics */}
                <div className="row mb-4">
                    <div className="col-md-3 mb-4">
                        <div className="card bg-secondary text-white">
                            <div className="card-body">
                                <h5 className="card-title">Total Properties</h5>
                                <h2 className="card-text">{totalProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <h5 className="card-title">Pending</h5>
                                <h2 className="card-text">{pendingProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-success text-white">
                            <div className="card-body">
                                <h5 className="card-title">Approved</h5>
                                <h2 className="card-text">{approvedProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-danger text-white">
                            <div className="card-body">
                                <h5 className="card-title">Rejected</h5>
                                <h2 className="card-text">{rejectedProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <h5 className="card-title">On Sell</h5>
                                <h2 className="card-text">{onSellProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card bg-dark text-white">
                            <div className="card-body">
                                <h5 className="card-title">Sold</h5>
                                <h2 className="card-text">{soldProperties}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Users Table */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5>Recent Users</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.slice(0, 5).map(user => (
                                        <tr key={user._id}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.role === 'Admin' ? 'bg-warning text-dark' :
                                                        user.role === 'Seller' ? 'bg-success' : 'bg-info'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Properties Table */}
                <div className="card">
                    <div className="card-header bg-primary text-white">
                        <h5>Recent Properties</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Price</th>
                                        <th>Added</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.slice(0, 5).map(property => (
                                        <tr key={property._id}>
                                            <td>
                                                <div>
                                                    <strong>{property.type || 'N/A'}</strong>
                                                    <div className="text-muted small">
                                                        {property.noOfBedroom} Beds, {property.noOfBathroom} Baths
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {property.city}, {property.province}
                                                <div className="text-muted small">
                                                    Area Size(Marla) : {property.size}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${property.status === 'Pending' ? 'bg-primary' :
                                                        property.status === 'Approved' ? 'bg-success' :
                                                            property.status === 'Rejected' ? 'bg-danger' :
                                                                property.status === 'OnSell' ? 'bg-info' : 'bg-dark'
                                                    }`}>
                                                    {property.status}
                                                </span>
                                            </td>
                                            <td>PKR {property.price?.toLocaleString() || 'N/A'}</td>
                                            <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;