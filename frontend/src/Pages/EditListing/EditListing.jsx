import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Styles from "./EditListing.module.css";
import { useParams } from "react-router-dom";

const EditListing = () => {
    const listingId = useParams().listingId;
    const [suggestions, setSuggestions] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({
        lat: null,
        lon: null,
    });
    const [distanceFromUNT, setDistanceFromUNT] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    const [inputLocation, setInputLocation] = useState("");

    const untUniversitycords = {
        lat: 33.207488,
        lon: -97.1525862,
    };

    const userId = localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        userId: userId,
        community: "",
        houseImage: null,
        location: "",
        placeId: "",
        placeDescription: "",
        lat: "",
        long: "",
        roomsCount: "",
        price: "",
        houseArea: "",
        houseWidth: "",
        bathroomCount: "",
        lookingForCount: "",
        description: "",
        distance: "",
    });

    useEffect(() => {
        const getListingsData = async () => {
            try {
                const response = await axiosInstance.get(`/listing/${listingId}`);
                setFormData(response.data);
                setInputLocation(response.data.location);
                console.log(response.data.location);
                setImagePreviewUrl(response.data.houseImage);
                setDistanceFromUNT(response.data.distance);
            } catch (error) {
                toast.error("Error fetching listing data: " + error.message);
            }
        };

        if (listingId) {
            getListingsData();
        }
    }, [listingId]);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lon: longitude });
                },
                (error) => {
                    toast.error("Could not retrieve location: " + error.message);
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, houseImage: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const locationChange = async (e) => {
        const value = e.target.value;
        setFormData({ ...formData, location: value });

        if (currentLocation.lat && currentLocation.lon && value.trim() !== "") {
            const data = {
                input: value,
                location: {
                    lat: currentLocation.lat,
                    lng: currentLocation.lon,
                },
                radius: 1000,
            };
            try {
                const response = await axiosInstance.post("/autocomplete", data);
                setSuggestions(response.data.length ? response.data : []);
            } catch (error) {
                console.error("Error fetching place data:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSuggestionClick = (suggestion) => {
        const { lat, lng } = suggestion.location;
        

        const distance = calculateDistance(
            untUniversitycords.lat,
            untUniversitycords.lon,
            lat,
            lng
        );

        setFormData({
            ...formData,
            location: suggestion.description,
            lat,
            long: lng,
            placeId: suggestion.place_id,
            placeDescription: suggestion.description,
            distance: distance,
        });
        setDistanceFromUNT(distance * 0.621371);
        console.log(distanceFromUNT);
        setSuggestions([]);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (value) => (value * Math.PI) / 180;
        const earthRadius = 6371;
        const latDiff = toRadians(lat2 - lat1);
        const lonDiff = toRadians(lon2 - lon1);
        const a =
            Math.sin(latDiff / 2) ** 2 +
            Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(lonDiff / 2) ** 2;
        return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const locationValue = formData.location.length ? formData.location : [{ 
            placeId: formData.placeId, 
            placeDescription: formData.placeDescription, 
            lat: formData.lat, 
            long: formData.long 
        }];
    
        const dataToSend = new FormData();
        Object.entries({ ...formData, location: locationValue }).forEach(([key, value]) =>
            dataToSend.append(key, value)
        
        );
        console.log(dataToSend);

        try {
            const response = await axiosInstance.put(`/update-listing/${listingId}`, dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.success("Listing updated successfully!");
            }
            console.log(formData);
        } catch (error) {
            toast.error(
                "Error updating listing: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };


    // Array.isArray() &&

    return (
        <div className={Styles.container}>
            <h2 className={Styles.heading}>Edit Listing</h2>
            <form className={Styles.form} onSubmit={handleSubmit}>
                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Community:</label>
                    <input
                        type="text"
                        name="community"
                        value={formData.community}
                        onChange={handleInputChange}
                        className={Styles.input}
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label htmlFor="houseImage">House Image:</label>
                    <input
                        type="file"
                        id="houseImage"
                        name="houseImage"
                        onChange={handleImageChange}
                    />
                    {imagePreviewUrl && (
                        <div className={Styles.imagePreviewContainer}>
                            <img
                                className={Styles.imagePreview}
                                src={imagePreviewUrl}
                                alt="House Preview"
                            />
                        </div>
                    )}
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location[0]?.placeDescription}
                        autoComplete="off"
                        onFocus={getCurrentLocation}
                        onChange={locationChange}
                        
                        className={Styles.input}
                        hidden={!formData.location[0]?.placeDescription}
                        placeholder="Search for a location..."
                    />
                    <input 
                    id = "location2"
                        type="text"
                        name="location"
                        value={formData.location}
                        autoComplete="off"
                        onFocus={getCurrentLocation}
                        onChange={locationChange}
                        className={Styles.input}
                        hidden={formData.location[0]?.placeDescription}
                        placeholder="Search for a location"
                    />

                    {suggestions.length > 0 && (
                        <ul className={Styles.suggestionsList}>
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={Styles.suggestionItem}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {distanceFromUNT && (
                    <div className={Styles.distanceInfo}>
                        Distance from UNT: {(distanceFromUNT * 0.621371).toFixed(2)} miles
                    </div>
                )}

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>House Area:</label>
                    <input
                        type="number"
                        name="houseArea"
                        value={formData.houseArea}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>House Width:</label>
                    <input
                        type="number"
                        name="houseWidth"
                        value={formData.houseWidth}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Bathroom Count:</label>
                    <input
                        type="number"
                        name="bathroomCount"
                        value={formData.bathroomCount}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Looking For Count:</label>
                    <input
                        type="number"
                        name="lookingForCount"
                        value={formData.lookingForCount}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Rooms Count:</label>
                    <input
                        type="number"
                        name="roomsCount"
                        value={formData.roomsCount}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="1"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Price in $:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={Styles.input}
                        min="0"
                    />
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.label}>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={Styles.input}
                    />
                </div>

                <div className={Styles.formGroup}>
                    <button type="submit" className={Styles.submitButton}>
                        Update Listing
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditListing;
