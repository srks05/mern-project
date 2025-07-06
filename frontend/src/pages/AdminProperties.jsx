import React, { useContext, useState, useEffect } from 'react';
import AuthContext from "../context/AuthContext";
import Navbar from '../components/Navbar';
import './designCss/AdminProperties.css'
import { deleteProperty, getAllProperties, propertyUpdateStatus } from '../services/propertiesService';

const AdminProperties = () => {
    const { user } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const propertiesPerPage = 5;
    const [selectedProperty, setSelectedProperty] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertiesData = await getAllProperties(true);
                setProperties(propertiesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const openModal = (property) => {
        setSelectedProperty(property);
        const modal = new window.bootstrap.Modal(document.getElementById("propertyModal"));
        modal.show();
    };

    // Filter properties based on search and status
    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.city?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id) => {
        const success = await deleteProperty(id);
        if (success) {
            setProperties(properties.filter((p) => p._id !== id));
        }
    };

    const handleStatusUpdate = async (propertyId, newStatus) => {
        try {
            let obj = { propertyId, newStatus };
            const updatedProperty = await propertyUpdateStatus(obj);
            setProperties(properties.map(prop => 
                prop._id === updatedProperty._id ? updatedProperty : prop
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Calculate statistics
    const totalProperties = properties.length;
    const pendingProperties = properties.filter(p => p.status === 'Pending').length;
    const approvedProperties = properties.filter(p => p.status === 'Approved').length;
    const rejectedProperties = properties.filter(p => p.status === 'Rejected').length;
    const onSellProperties = properties.filter(p => p.status === 'OnSell').length;
    const soldProperties = properties.filter(p => p.status === 'Sold').length;

    // Pagination logic
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

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
        <div className="admin-properties">
            <Navbar />
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">Property Management</h1>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                        />
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="OnSell">On Sell</option>
                            <option value="Sold">Sold</option>
                        </select>
                    </div>
                </div>

                {/* Property Statistics Cards */}
                <div className="row mb-4">
                    <div className="col-xl-2 col-md-4 col-sm-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Total Properties</h6>
                                <h2 className="card-text text-primary">{totalProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-2 col-md-4 col-sm-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Pending</h6>
                                <h2 className="card-text text-warning">{pendingProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-2 col-md-4 col-sm-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Approved</h6>
                                <h2 className="card-text text-success">{approvedProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-2 col-md-4 col-sm-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Rejected</h6>
                                <h2 className="card-text text-danger">{rejectedProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-2 col-md-4 col-sm-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">On Sell</h6>
                                <h2 className="card-text text-info">{onSellProperties}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-2 col-md-4 col-sm-6 mb-4">
                        <div className="card stat-card bg-white border-0 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Sold</h6>
                                <h2 className="card-text text-dark">{soldProperties}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Properties Table */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                        <h5 className="mb-0">Property List</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Price</th>
                                        <th>Size</th>
                                        <th>Added</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProperties.length > 0 ? (
                                        currentProperties.map(property => (
                                            <tr key={property._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <h6 className="mb-0">{property.type || 'N/A'}</h6>
                                                            <small className="text-muted">
                                                                {property.noOfBedroom} Beds, {property.noOfBathroom} Baths
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {property.city}, {property.province}
                                                    <br />
                                                    <small className="text-muted">{property.location}</small>
                                                </td>
                                                <td>
                                                    <span className={`badge rounded-pill ${property.status === 'Pending' ? 'bg-warning' :
                                                        property.status === 'Approved' ? 'bg-success' :
                                                            property.status === 'Rejected' ? 'bg-danger' :
                                                                property.status === 'OnSell' ? 'bg-info' : 'bg-dark'
                                                        }`}>
                                                        {property.status}
                                                    </span>
                                                </td>
                                                <td>PKR {property.price?.toLocaleString() || 'N/A'}</td>
                                                <td>{property.size} Area Size(Marla)</td>
                                                <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        onClick={() => openModal(property)}
                                                        className="btn btn-sm btn-outline-primary me-2">
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this Property?")) {
                                                                handleDelete(property._id);
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
                                            <td colSpan="7" className="text-center py-4">
                                                No properties found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredProperties.length > propertiesPerPage && (
                            <nav className="d-flex justify-content-center mt-4">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                            Previous
                                        </button>
                                    </li>
                                    {[...Array(totalPages).keys()].map(number => (
                                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
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

                {/* Property Details Modal */}
                <div className="modal fade" id="propertyModal" tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold text-primary">
                                    {selectedProperty?.type || 'Property Details'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body p-0">
                                {selectedProperty && (
                                    <div className="container-fluid">
                                        <div className="row g-0">
                                            <div className="col-md-7 p-4 border-end">
                                                <div id={`propertySlider-${selectedProperty._id}`} className="carousel slide mb-4 shadow-sm" data-bs-ride="carousel">
                                                    <div className="carousel-inner rounded-2 overflow-hidden">
                                                        {selectedProperty.images?.length > 0 ? (
                                                            selectedProperty.images.map((image, index) => (
                                                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                                                    <img
                                                                        src={`http://localhost:4646/${image}`}
                                                                        className="d-block w-100"
                                                                        style={{ height: '250px', objectFit: 'cover' }}
                                                                        alt={`Property ${index + 1}`}
                                                                    />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="carousel-item active">
                                                                <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '250px' }}>
                                                                    <span className="text-muted">No images available</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {selectedProperty.images?.length > 1 && (
                                                        <>
                                                            <button className="carousel-control-prev" type="button" data-bs-target={`#propertySlider-${selectedProperty._id}`} data-bs-slide="prev">
                                                                <span className="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                                                                <span className="visually-hidden">Previous</span>
                                                            </button>
                                                            <button className="carousel-control-next" type="button" data-bs-target={`#propertySlider-${selectedProperty._id}`} data-bs-slide="next">
                                                                <span className="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                                                                <span className="visually-hidden">Next</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                <h6 className="fw-bold text-uppercase text-muted mb-3">Property Specifications</h6>
                                                
                                                <div className="row">
                                                    <div className="col-6 mb-3">
                                                        <p className="mb-1"><strong>Bedrooms:</strong></p>
                                                        <p>{selectedProperty.noOfBedroom || 'N/A'}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <p className="mb-1"><strong>Bathrooms:</strong></p>
                                                        <p>{selectedProperty.noOfBathroom || 'N/A'}</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <p className="mb-1"><strong>Size:</strong></p>
                                                        <p>{selectedProperty.size || 'N/A'} Area Size(Marla)</p>
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <p className="mb-1"><strong>Price:</strong></p>
                                                        <p>PKR {selectedProperty.price?.toLocaleString() || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <p className="mb-1"><strong>Location:</strong></p>
                                                    <p>{selectedProperty.location || 'N/A'}</p>
                                                </div>

                                                <div className="mb-3">
                                                    <p className="mb-1"><strong>City/Province:</strong></p>
                                                    <p>{selectedProperty.city}, {selectedProperty.province}</p>
                                                </div>

                                                <div className="mb-3">
                                                    <p className="mb-1"><strong>Coordinates:</strong></p>
                                                    <p>{selectedProperty.latitude}, {selectedProperty.longitude}</p>
                                                </div>
                                            </div>

                                            <div className="col-md-5 p-4">
                                                <h6 className="fw-bold text-uppercase text-muted mb-3">Status & Bidding</h6>
                                                
                                                <div className="mb-3">
                                                    <p className="mb-1"><strong>Status:</strong></p>
                                                    <span className={`badge ${
                                                        selectedProperty.status === 'Pending' ? 'bg-warning' :
                                                        selectedProperty.status === 'Approved' ? 'bg-success' :
                                                        selectedProperty.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'
                                                    }`}>
                                                        {selectedProperty.status}
                                                    </span>
                                                </div>

                                                {selectedProperty.startingBid && (
                                                    <div className="mb-3">
                                                        <p className="mb-1"><strong>Starting Bid:</strong></p>
                                                        <p>PKR {selectedProperty.startingBid?.toLocaleString()}</p>
                                                    </div>
                                                )}

                                                {selectedProperty.startBiddingTime && (
                                                    <div className="mb-3">
                                                        <p className="mb-1"><strong>Bidding Starts:</strong></p>
                                                        <p>{new Date(selectedProperty.startBiddingTime).toLocaleString()}</p>
                                                    </div>
                                                )}

                                                {selectedProperty.endBiddingTime && (
                                                    <div className="mb-3">
                                                        <p className="mb-1"><strong>Bidding Ends:</strong></p>
                                                        <p>{new Date(selectedProperty.endBiddingTime).toLocaleString()}</p>
                                                    </div>
                                                )}

                                                <div className="border-top pt-3 mt-3">
                                                    <h6 className="fw-bold text-uppercase text-muted mb-3">Seller Information</h6>
                                                    <div className="d-flex align-items-start mb-3">
                                                        <div className="avatar bg-primary text-white rounded-circle me-3" 
                                                            style={{ width: '50px', height: '50px', lineHeight: '50px', textAlign: 'center' }}>
                                                            {selectedProperty.seller?.username?.charAt(0).toUpperCase() || 'S'}
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1">{selectedProperty.seller?.username || 'Unknown Seller'}</h6>
                                                            <p className="text-muted small mb-1">{selectedProperty.seller?.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer bg-light">
                                <button className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                {selectedProperty?.status === 'Pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedProperty._id, 'Approved')}
                                        className="btn btn-success" data-bs-dismiss="modal">
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedProperty._id, 'Rejected')}
                                        className="btn btn-danger" data-bs-dismiss="modal">
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProperties;