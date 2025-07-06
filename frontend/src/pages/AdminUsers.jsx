import React, { useContext, useState, useEffect } from 'react';
import AuthContext from "../context/AuthContext";
import Navbar from '../components/Navbar';
import './designCss/AdminUsers.css'
import { getAllUsers } from '../services/authService';
import { deleteProperty } from '../services/propertiesService';
const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const usersResponse = await fetch('http://localhost:4646/api/auth/getallusers');
                const usersData = await getAllUsers()
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const handleDelete = async (id) => {
        // const success = await delete(id);
        // if (success) {
        //   setProperties(properties.filter((p) => p._id !== id));
        // }
    };
    
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalUsers = users.length;
    const totalSellers = users.filter(u => u.role === 'Seller').length;
    const totalBuyers = users.filter(u => u.role === 'Buyer').length;
    const totalAdmins = users.filter(u => u.role === 'Admin').length;

   
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-users">
            <Navbar />
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">User Management</h1>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                        />
                        <select
                            className="form-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="All">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Seller">Seller</option>
                            <option value="Buyer">Buyer</option>
                        </select>
                    </div>
                </div>

                {/* User Statistics Cards */}
                <div className="row mb-4">
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Total Users</h6>
                                <h2 className="card-text text-primary">{totalUsers}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Admins</h6>
                                <h2 className="card-text text-warning">{totalAdmins}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Sellers</h6>
                                <h2 className="card-text text-success">{totalSellers}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Buyers</h6>
                                <h2 className="card-text text-info">{totalBuyers}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                        <h5 className="mb-0">User List</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Last Active</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map(user => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar me-3">
                                                            {user.profileImage ? (
                                                                <img
                                                                    src={user.profileImage}
                                                                    alt={user.username}
                                                                    className="rounded-circle"
                                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        backgroundColor: '#f0f0f0',
                                                                        color: '#666'
                                                                    }}
                                                                >
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">{user.username}</h6>
                                                            <small className="text-muted">ID: {user._id.substring(0, 6)}...</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${user.role === 'Admin' ? 'bg-warning' :
                                                            user.role === 'Seller' ? 'bg-success' : 'bg-info'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                <td>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary me-2">
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    {/* <button className="btn btn-sm btn-outline-success me-2">
                                                        <i className="bi bi-pencil"></i>
                                                    </button> */}
                                                    <button onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this User?")) {
                                                            handleDelete(user._id);
                                                        }
                                                    }}
                                                        className="btn btn-sm btn-outline-danger">
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredUsers.length > usersPerPage && (
                            <nav className="d-flex justify-content-center mt-4">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                            Previous
                                        </button>
                                    </li>
                                    {[...Array(totalPages).keys()].map(number => (
                                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? '' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(number + 1)}>
                                                {number + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;