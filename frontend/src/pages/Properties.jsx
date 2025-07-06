import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import ViewBids from "./ViewBids";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getAllProperties, addProperty, getAllPropertiesByUserId, deleteProperty, editProperty } from "../services/propertiesService";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";
const Properties = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [addFlag, setAddFlag] = useState(true);
  const [submitBtnOn, setSubmitBtnOn] = useState(false);
  
  const [userRole, setUserRole] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 33.6844, lng: 73.0479 }); // Default to Islamabad
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();
  // let PredictPrice = async () => {
  //     const predictedPrice = 200000;
  //     console.log("Predicted Price:", predictedPrice);
  //     setSubmitBtnOn(true);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       price: predictedPrice,
  //     }));
  // };
  const PredictPrice = async () => {
    try {
      const payload = {
        property_type: formData.type,
        location: formData.location,
        city: formData.city,
        province: formData.province,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        baths: parseInt(formData.noOfBathroom),
        bedrooms: parseInt(formData.noOfBedroom),
        area_size: parseFloat(formData.size)
      };

      const response = await axios.post("http://localhost:5000/predict", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        const predictedPriceStr = response.data.prediction;
        const predictedPrice = parseFloat(predictedPriceStr.replace(/[^\d.-]/g, ''));

        console.log("Predicted Price:", predictedPrice);

        setFormData((prevData) => ({
          ...prevData,
          price: predictedPrice
        }));

        setSubmitBtnOn(true);
      } else {
        console.error("Prediction error:", response.data.error);
        setSubmitBtnOn(false);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setSubmitBtnOn(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      setUserRole(user.role);
      if (user.role === "Seller") {
        fetchPropertiesbyid();
      } else if (user.role === "Buyer") {
        fetchProperties();
      }
    }
  }, [user, navigate]);
console.warn(user)
  const fetchProperties = async () => {
    try {
      const data = await getAllProperties();
      setProperties(data);
    } catch (err) {
      console.log("error to fetch properties", err);
    }
  };

  const fetchPropertiesbyid = async () => {
    try {
      const data = await getAllPropertiesByUserId(user._id);
      setProperties(data);
    } catch (err) {
      console.log("error to fetch properties", err);
    }
  };

  const [formData, setFormData] = useState({
    id: null,
    seller: user ? user._id : "",
    type: "",
    location: "",
    city: "",
    province: "",
    latitude: "",
    longitude: "",
    noOfBathroom: "",
    noOfBedroom: "",
    size: "",
    price: "",
    //soldPrice: "",
    status: "Pending",
    // // startingBid: "",
    startBiddingTime: "",
    endBiddingTime: "",
    images: [],
  });

  const [selectedProperty, setSelectedProperty] = useState(null);

  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = (endTime - startTime) / (1000 * 60 * 60);
    return isNaN(duration) ? "N/A" : duration.toFixed(2) + " hours";
  };

  const handleShowModal = (property = null) => {
    if (property) {
      setFormData(property);
      setAddFlag(false);
      if (property.latitude && property.longitude) {
        setSelectedLocation({
          lat: parseFloat(property.latitude),
          lng: parseFloat(property.longitude),
        });
        setMapCenter({
          lat: parseFloat(property.latitude),
          lng: parseFloat(property.longitude),
        });
      }
    } else {
      setAddFlag(true);
      setFormData({
        id: null,
        seller: user ? user._id : "",
        type: "",
        location: "",
        city: "",
        province: "",
        latitude: "",
        longitude: "",
        noOfBathroom: "",
        noOfBedroom: "",
        size: "",
        price: "",
        soldPrice: "",
        status: "Pending",
        // startingBid: "",
        startBiddingTime: "",
        endBiddingTime: "",
        images: [],
      });
      setSelectedLocation(null);
    }
  };

  const handleViewBids = (property) => {
    console.log(property)
    setSelectedProperty(property);
  };

  const truncateText = (text, lines) => {
    const words = text.split(" ");
    if (words.length > lines * 10) {
      return words.slice(0, lines * 10).join(" ") + "...";
    }
    return text;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === 'province' ? { city: '' } : {}) 
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedLocation({ lat, lng });
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.seller = user ? user._id : "";

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "id") {
        formDataObj.append(key, formData[key]);
      }
    });

    for (let i = 0; i < formData.images.length; i++) {
      formDataObj.append("images", formData.images[i]);
    }

    if (addFlag) {
      const newProperty = await addProperty(formDataObj);
      if (newProperty) {
        setProperties([...properties, newProperty]);
      }
    } else {
      const updatedProperty = await editProperty(formDataObj, formData._id);
      if (updatedProperty) {
        setProperties(properties.map((p) => (p._id === formData._id ? updatedProperty : p)));
      }
    }
    setSubmitBtnOn(false);
    document.getElementById("closeModal").click();
  };

  const handleDelete = async (id) => {
    const success = await deleteProperty(id);
    if (success) {
      setProperties(properties.filter((p) => p._id !== id));
    }
  };

  const propertyTypes = ["House", "FarmHouse", "Upper Portion", "Lower Portion", "Flat","Room"];
  const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir","Islamabad Capital"];
  const citiesByProvince = {
    Punjab: ["Lahore", "Faisalabad", "Rawalpindi"],
    Sindh: ["Karachi"],
    "Khyber Pakhtunkhwa": [],
    Balochistan: [],
    "Gilgit-Baltistan": [],
    "Azad Kashmir": [],
    "Islamabad Capital": ["Islamabad"] 
  };
  const availableCities = citiesByProvince[formData.province] || [];

  return (
    <>
      <Navbar />

      <div className="container mt-4" style={{ minHeight: "1000px" }}>
        <motion.h2 className="text-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {userRole === "Seller" ? "Manage Properties" : "Browse Properties"}
        </motion.h2>

        {userRole === "Seller" && (
          <motion.button
            className="btn btn-primary mb-3"
            data-bs-toggle="modal"
            data-bs-target="#propertyModal"
            onClick={() => handleShowModal()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Property
          </motion.button>
        )}

        <div className="row">
          {properties.length > 0 ? (
            properties.map((property) => (
              <motion.div
                key={property._id}
                className="col-md-6 col-lg-4 mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card shadow-sm">
                  <div className="card shadow-sm">
                    <div id={`carousel${property._id}`} className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-inner">
                        {property.images.length > 0 ? (
                          property.images.map((image, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                              <img
                                src={'http://localhost:4646/' + image}
                                className="d-block w-100"
                                alt={`Property ${index}`}
                                style={{ height: "200px", objectFit: "cover" }}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="carousel-item active">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                              className="d-block w-100"
                              alt="No Image"
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          </div>
                        )}
                      </div>
                      {property.images.length > 1 && (
                        <>
                          <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${property._id}`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          </button>
                          <button className="carousel-control-next" type="button" data-bs-target={`#carousel${property._id}`} data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      {property.type} in {property.city}, {property.province}
                    </h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-primary">{property.noOfBedroom} Beds</span>
                      <span className="badge bg-secondary">{property.noOfBathroom} Baths</span>
                      <span className="badge bg-success">{property.size} Area Size(Marla)</span>
                    </div>
                    <p className="fw-bold">Price: {property.price} PKR</p>
                    {/* {property.startingBid && (
                      <p className="fw-bold">Starting Bid: {property.startingBid} PKR</p>
                    )} */}
                    {property.startBiddingTime && property.endBiddingTime && (
                      <>
                        <p className="text-muted">Auction Duration: {calculateDuration(property.startBiddingTime, property.endBiddingTime)}</p>
                        <p className="text-muted small">Start: {new Date(property.startBiddingTime).toLocaleString()}</p>
                        <p className="text-muted small">End: {new Date(property.endBiddingTime).toLocaleString()}</p>
                      </>
                    )}
                    <p className="text-muted small mt-2">{property.location}</p>

                    <div className="d-flex justify-content-between mt-3">
                      {userRole === "Seller" && (
                        <div>
                          <motion.button
                            className="btn btn-info btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#viewBidsModal"
                            onClick={() => handleViewBids(property)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Bids
                          </motion.button>
                          <motion.button
                            className="btn btn-warning btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#propertyModal"
                            onClick={() => handleShowModal(property)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this property?")) {
                                handleDelete(property._id);
                              }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Delete
                          </motion.button>
                        </div>
                      )}
                      {userRole === "Buyer" && property.startBiddingTime && property.endBiddingTime && (
                        <motion.button
                          className="btn btn-success btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#viewBidsModal"
                          onClick={() => handleViewBids(property)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Bids
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div className="text-center w-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <p>No properties listed yet.</p>
            </motion.div>
          )}
        </div>

        {/* Property Modal */}
        <div className="modal fade" id="propertyModal" tabIndex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="propertyModalLabel">{formData.id ? "Edit Property" : "Add Property"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Property Type</label>
                        <select className="form-select" name="type" value={formData.type} onChange={handleChange} required>
                          <option value="">Select Type</option>
                          {propertyTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    

                        <div className="mb-3">
                          <label className="form-label">Number of Bedrooms</label>
                          <input type="number" className="form-control" name="noOfBedroom" value={formData.noOfBedroom} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Number of Bathrooms</label>
                          <input type="number" className="form-control" name="noOfBathroom" value={formData.noOfBathroom} onChange={handleChange} required />
                        </div>

                      <div className="mb-3">
                        <label className="form-label">Area Size(Marla)</label>
                        <input type="number" className="form-control" name="size" value={formData.size} onChange={handleChange} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price (PKR)</label>
                        <input disabled type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                      </div>
                      {/* <div className="mb-3">
                        <label className="form-label">Starting Bid (PKR)</label>
                        <input type="number" className="form-control" name="startingBid" value={formData.startingBid} onChange={handleChange} />
                      </div> */}
                      <div className="mb-3">
                        <label className="form-label">Start Bidding Time</label>
                        <input type="datetime-local" className="form-control" name="startBiddingTime" value={formData.startBiddingTime} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">End Bidding Time</label>
                        <input type="datetime-local" className="form-control" name="endBiddingTime" value={formData.endBiddingTime} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Upload Images</label>
                        <input type="file" className="form-control" multiple onChange={handleFileChange} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Select Location on Map</label>
                        <LoadScript googleMapsApiKey="AIzaSyCXHsxMZfGir0k4rS1nTSZVPEOjkDswEbQ">
                          <GoogleMap
                            mapContainerStyle={{ height: "400px", width: "100%" }}
                            center={mapCenter}
                            zoom={12}
                            onClick={handleMapClick}
                          >
                            {selectedLocation && (
                              <Marker position={selectedLocation} />
                            )}
                          </GoogleMap>
                        </LoadScript>
                      </div>
                      <div className="row d-none">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Latitude</label>
                          <input type="text" className="form-control" name="latitude" value={formData.latitude} onChange={handleChange} readOnly />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Longitude</label>
                          <input type="text" className="form-control" name="longitude" value={formData.longitude} onChange={handleChange} readOnly />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Province</label>
                        <select className="form-select" name="province" value={formData.province} onChange={handleChange} required>
                          <option value="">Select Province</option>
                          {provinces.map((province) => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <select
          className="form-select"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          disabled={availableCities.length === 0}
        >
          <option value="">Select City</option>
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label"> Area Address</label>
                        <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <motion.button onClick={PredictPrice} type="button" className="btn btn-success"  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Predict Price
                  </motion.button>
                  <motion.button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeModal" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Cancel
                  </motion.button>
                  <motion.button type="submit" disabled={!submitBtnOn} className="btn btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {formData.id ? "Update" : "Add"} Property
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* View Bids Modal */}
        <div className="modal fade" id="viewBidsModal" tabIndex="-1" aria-labelledby="viewBidsModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewBidsModalLabel">View Bids</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedProperty && <ViewBids property={selectedProperty} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
export default Properties;
//$$$$$$$$$$$$$$

// import React, { useEffect, useState, useContext } from "react";
// import { motion } from "framer-motion";
// import ViewBids from "./ViewBids";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";
// import { getAllProperties, addProperty, getAllPropertiesByUserId, deleteProperty, editProperty } from "../services/propertiesService";
// import AuthContext from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// // Import Google Maps API
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// const Properties = () => {
//   const { user } = useContext(AuthContext);
//   const [properties, setProperties] = useState([]);
//   const [addFlag, setAddFlag] = useState(true);
//   const [userRole, setUserRole] = useState("");
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     id: null,
//     seller: user ? user._id : "",
//     type: "",
//     location: "",
//     city: "",
//     province: "",
//     latitude: "",
//     longitude: "",
//     noOfBathroom: "",
//     noOfBedroom: "",
//     size: "",
//     price: "",
//     soldPrice: "",
//     status: "Pending",
//     startingBid: "",
//     startBiddingTime: "",
//     endBiddingTime: "",
//     images: [],
//   });

//   const [selectedProperty, setSelectedProperty] = useState(null); // Track the selected property for viewing bids
//   const [mapCenter, setMapCenter] = useState({ lat: 31.5204, lng: 74.3587 }); // Default to Lahore
//   const [markerPosition, setMarkerPosition] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyCXHsxMZfGir0k4rS1nTSZVPEOjkDswEbQ", // Replace with your Google Maps API key
//   });

//   useEffect(() => {
//     if (!user) {
//       navigate("/");
//     } else {
//       setUserRole(user.role);
//       if (user.role === "Seller") {
//         fetchPropertiesbyid();
//       } else if (user.role === "Buyer") {
//         fetchProperties();
//       }
//     }
//   }, [user, navigate]);

//   const fetchProperties = async () => {
//     try {
//       const data = await getAllProperties();
//       setProperties(data);
//     } catch (err) {
//       console.log("Error fetching properties:", err);
//     }
//   };

//   const fetchPropertiesbyid = async () => {
//     try {
//       const data = await getAllPropertiesByUserId(user._id);
//       setProperties(data);
//     } catch (err) {
//       console.log("Error fetching properties by ID:", err);
//     }
//   };

//   const handleShowModal = (property = null) => {
//     if (property) {
//       setFormData(property);
//       setMarkerPosition({ lat: parseFloat(property.latitude), lng: parseFloat(property.longitude) });
//       setAddFlag(false);
//     } else {
//       setAddFlag(true);
//       setFormData({
//         id: null,
//         seller: user ? user._id : "",
//         type: "",
//         location: "",
//         city: "",
//         province: "",
//         latitude: "",
//         longitude: "",
//         noOfBathroom: "",
//         noOfBedroom: "",
//         size: "",
//         price: "",
//         soldPrice: "",
//         status: "Pending",
//         startingBid: "",
//         startBiddingTime: "",
//         endBiddingTime: "",
//         images: [],
//       });
//       setMarkerPosition(null);
//     }
//   };

//   const handleMapClick = (e) => {
//     const { lat, lng } = e.latLng.toJSON();
//     setMarkerPosition({ lat, lng });
//     setFormData({ ...formData, latitude: lat.toString(), longitude: lng.toString() });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, images: [...e.target.files] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     formData.seller = user ? user._id : "";

//     const formDataObj = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (key === "images") {
//         for (let i = 0; i < formData.images.length; i++) {
//           formDataObj.append("images", formData.images[i]);
//         }
//       } else {
//         formDataObj.append(key, formData[key]);
//       }
//     });

//     if (addFlag) {
//       const newProperty = await addProperty(formDataObj);
//       if (newProperty) {
//         setProperties([...properties, newProperty]);
//       }
//     } else {
//       const updatedProperty = await editProperty(formDataObj, formData._id);
//       if (updatedProperty) {
//         setProperties(properties.map((p) => (p._id === formData._id ? updatedProperty : p)));
//       }
//     }
//     document.getElementById("closeModal").click();
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container mt-4" style={{ minHeight: "1000px" }}>
//         <motion.h2 className="text-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//           Manage Properties
//         </motion.h2>

//         {userRole === "Seller" && (
//           <motion.button
//             className="btn btn-primary mb-3"
//             data-bs-toggle="modal"
//             data-bs-target="#propertyModal"
//             onClick={() => handleShowModal()}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             + Add Property
//           </motion.button>
//         )}

//         {/* Property Cards */}
//         <div className="row">
//           {properties.length > 0 ? (
//             properties.map((property) => (
//               <motion.div
//                 key={property._id}
//                 className="col-md-6 col-lg-4 mb-4"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div className="card shadow-sm">
//                   <div className="card-body">
//                     <h5 className="card-title">{property.title}</h5>
//                     <p className="card-text">Type: {property.type}</p>
//                     <p className="card-text">Location: {property.location}</p>
//                     <p className="card-text">City: {property.city}</p>
//                     <p className="card-text">Province: {property.province}</p>
//                     <p className="card-text">Price: {property.price} PKR</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <p>No properties listed yet.</p>
//           )}
//         </div>

//         {/* Modal for Add/Edit Property */}
//         <div className="modal fade" id="propertyModal" tabIndex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="propertyModalLabel">{formData.id ? "Edit Property" : "Add Property"}</h5>
//                 <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Type</label>
//                     <input type="text" className="form-control" name="type" value={formData.type} onChange={handleChange} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Location</label>
//                     <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">City</label>
//                     <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Province</label>
//                     <input type="text" className="form-control" name="province" value={formData.province} onChange={handleChange} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Latitude</label>
//                     <input type="text" className="form-control" name="latitude" value={formData.latitude} onChange={handleChange} readOnly />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Longitude</label>
//                     <input type="text" className="form-control" name="longitude" value={formData.longitude} onChange={handleChange} readOnly />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Google Map</label>
//                     {isLoaded && (
//                       <GoogleMap
//                         mapContainerStyle={{ width: "100%", height: "300px" }}
//                         center={mapCenter}
//                         zoom={10}
//                         onClick={handleMapClick}
//                       >
//                         {markerPosition && <Marker position={markerPosition} />}
//                       </GoogleMap>
//                     )}
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Upload Images</label>
//                     <input type="file" className="form-control" multiple onChange={handleFileChange} />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <motion.button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeModal" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     Cancel
//                   </motion.button>
//                   <motion.button type="submit" className="btn btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     {formData.id ? "Update" : "Add"} Property
//                   </motion.button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Properties;