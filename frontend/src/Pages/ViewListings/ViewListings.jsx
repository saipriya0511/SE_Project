import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Styles from "./ViewListings.module.css";
import { ToastContainer, toast } from "react-toastify";
import {FaStar} from "react-icons/fa";

const ViewListings = () => {
    const [listings, setListings] = useState([]);
    const [searchedListings, setSearchedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [searchDistance, setSearchDistance] = useState("");
    const [roomCount, setRoomCount] = useState("");
    const [bathroomCount, setBathroomCount] = useState("");
    const [lookingForCount, setLookingForCount] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    const [ratedListing, setRatedListing] = useState(false);

    const emojiReactions = ["😡", "😕", "😐", "😊", "😁"];

    const handleReview = async (listingId) => {
        toast.dismiss();
        try {
            const listing = listings.find(
                (listing) => listing._id === listingId
            );
            if (!listing) {
                console.log("Listing not found");
                return;
            }
            // check if user has already reviewed this listing
            listing.reviews.some(
                (review) =>
                    review.userId.toString() === localStorage.getItem("userId")
            );
            if (
                listing.reviews.some(
                    (review) =>
                        review.userId.toString() ===
                        localStorage.getItem("userId")
                )
            ) {
                window.location.reload();
                return alert("You have already reviewed this listing");
                
            }

            if (rating <= 0 || rating > 5) {
                toast.error("Please rate between 1 to 5");
                return;
            }
            if (feedback === "") {
                return toast.error("Please enter a feedback");
            }
            const res = await axios.post(`/add-review/${listingId}`, {
                userId: localStorage.getItem("userId"),
                rating: rating[listingId],
                feedback: feedback[listingId]
            });
            if (res.data.reviewMsg) {
                alert(res.data.reviewMsg);
            }
            console.log(res.data);

            window.location.reload();
            setRating(0);
            setFeedback("");
        } catch (err) {
            console.log(err);
        }

        console.log("Rating:", rating);
        console.log("Feedback:", feedback);
        console.log("Listing ID:", listingId);
    };

    const renderStars = (listingId, index) => {
        setRating((prevRatings) => ({
            ...prevRatings,
            [listingId]: index + 1,
        }));
    };

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get("/all-listings");
                setListings(response.data);
            } catch (err) {
                console.error("Error fetching listings", err);
                setError("No listings Found");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);



    const handleSearch = async () => {
        try {
            const response = await axios.get("/all-listings/search", {
                params: {
                    roomsCount: roomCount,
                    bathroomCount: bathroomCount,
                    lookingForCount: lookingForCount,
                    distance: searchDistance,
                    price: priceRange,
                },
            });

            if (response.data) {
                setSearchedListings(response.data.searchedListings);
                setSearchClicked(true);
                console.log(response.data);
                
            }
        } catch (err) {
            console.error("Error fetching searched listings", err);
            setError("No listings Found");
        }
    };


    const userId = localStorage.getItem("userId");
    const [filters, setFilters] = useState({
        roomsCount: "",
        bathroomCount: "",
        lookingForCount: "",
        distance: "",
        price: "",
    });
    
    useEffect(() => {
        const updateSearchHistory = async () => {
            try {
                const response = await axios.post("/listings-search-history", {
                    userId,
                    ...filters,
                });
                console.log("Search history updated:", response.data);
            } catch (err) {
                console.error("Error updating search history", err);
            }
        };
    
        if (
            filters.roomsCount ||
            filters.bathroomCount ||
            filters.lookingForCount ||
            filters.distance ||
            filters.price
        ) {
            updateSearchHistory();
        }
    }, [filters, userId]);
    
    const handleFilterChange = (key, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
    };


    const listingsToDisplay = searchClicked ? searchedListings : listings;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <h2 className={Styles.title}>
                    {searchClicked ? "Searched Listings" : "Listings"}
                </h2>
            </div>
            <div className={Styles.filters}>
                <div className={Styles.selectContainer}>
                    <label></label>
                    <select
                        className={Styles.select}
                        value={filters.distance}
                        onChange={(e) => handleFilterChange("distance", e.target.value)}
                    >
                        <option value="">Distance</option>
                        <option value="5">Below 5 miles</option>
                        <option value="10">Below 10 miles</option>
                        <option value="15">Below 15 miles</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label> </label>
                    <select
                        className={Styles.select}
                        value={filters.roomsCount}
                        onChange={(e) => handleFilterChange("roomsCount", e.target.value)}
                    >
                        <option value="">Room Count</option>
                        {[...Array(5).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                        <option value="more than 5">More than 5</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label></label>
                    <select
                        className={Styles.select}
                        value={filters.bathroomCount}
                        onChange={(e) => handleFilterChange("bathroomCount", e.target.value)}
                    >
                        <option value="">Bathroom Count</option>
                        {[...Array(5).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                        <option value="more than 5">More than 5</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label> </label>
                    <select
                        className={Styles.select}
                        value={filters.lookingForCount}
                        onChange={(e) => handleFilterChange("lookingForCount", e.target.value)}
                    >
                        <option value="">Looking For Count</option>
                        {[...Array(5).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                        <option value="more than 5">More than 5</option>
                    </select>
                </div>

                <div className={Styles.selectContainer}>
                    <label> </label>
                    <select
                        className={Styles.select}
                        value={filters.price}
                        onChange={(e) => handleFilterChange("price", e.target.value)}
                    >
                        <option value="">Price Range</option>
                        {[...Array(10).keys()].map((i) => (
                            <option key={i + 1} value={(i + 1) * 100}>
                                Below ${(i + 1) * 100}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSearch}>Search</button>
            </div>

            {listingsToDisplay && listingsToDisplay.length > 0 ? (
                <ul className={Styles.list}>
                    {listingsToDisplay.map((listing) => (
                        <div key={listing._id} className={Styles.listItem}>
                            <h3 className={Styles.listItemTitle}>
                                {listing?.community}
                            </h3>
                            <img
                                className={Styles.listItemImage}
                                src={listing?.houseImage}
                                alt={listing?.community}
                            />
                            <p className={Styles.listItemDetails}>
                                <strong>Address:</strong>{" "}
                                {listing?.location[0]?.placeDescription}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Rooms Count:</strong>{" "}
                                {listing?.roomsCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Price:</strong> ${listing?.price}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Description:</strong>{" "}
                                {listing?.description}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>House Area:</strong>{" "}
                                {listing?.houseArea}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>House Width:</strong>{" "}
                                {listing?.houseWidth}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Bathroom Count:</strong>{" "}
                                {listing?.bathroomCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Looking For Count:</strong>{" "}
                                {listing?.lookingForCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Distance from UNT:</strong>{" "}
                                {(listing?.distance * 0.621371).toFixed(2)}{" "}
                                miles
                            </p>

                            {/* <div className={Styles.reviewContainer}>
                                <h3 className={Styles.reviewTitle}>Review Here</h3>
                            <div className={Styles.starContainer}>
                            {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            size={20}
                                            color={index < (rating[listing._id] || 0) ? "#ffc107" : "#e4e5e9"}
                                            onClick={() => renderStars(listing._id, index)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    ))}
                                {rating[listing._id] ? emojiReactions[rating[listing._id] - 1] : rating[listing._id]}
                                </div>
                                <textarea
                                    placeholder="Feedback"
                                    value={feedback[listing._id] || ""}
                                    onChange={(e) =>
                                        setFeedback((prevFeedbacks) => ({
                                            ...prevFeedbacks,
                                            [listing._id]: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    className={Styles.reviewButton}
                                    onClick={() => handleReview(listing._id)}
                                >
                                    Rate
                                </button>
                            </div> */}
                        </div>
                    ))}
                </ul>
            ) : (
                <p className={Styles.noListings}>No listings found</p>
            )}
            <ToastContainer autoClose={3000} position="top-center" />
        </div>
    );
};

export default ViewListings;
