import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Styles from "./ViewListings.module.css";

const ViewListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchDistance, setSearchDistance] = useState("");
    const [roomCount, setRoomCount] = useState("");
    const [bathroomCount, setBathroomCount] = useState("");
    const [lookingForCount, setLookingForCount] = useState("");

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get("/all-listings");
                setListings(response.data);
            } catch (err) {
                console.error("Error fetching listings", err);
                setError("Failed to fetch listings");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const filteredListings = listings.filter((listing) => {
        const matchesDistance =
            searchDistance === "" ||
            listing.distance <= parseInt(searchDistance);
        const matchesRoomCount =
            roomCount === "" ||
            (roomCount === "more than 5"
                ? listing.roomsCount > 5
                : listing.roomsCount === parseInt(roomCount));
        const matchesBathroomCount =
            bathroomCount === "" ||
            (bathroomCount === "more than 5"
                ? listing.bathroomCount > 5
                : listing.bathroomCount === parseInt(bathroomCount));
        const matchesLookingForCount =
            lookingForCount === "" ||
            (lookingForCount === "more than 5"
                ? listing.lookingForCount > 5
                : listing.lookingForCount === parseInt(lookingForCount));

        return (
            matchesDistance &&
            matchesRoomCount &&
            matchesBathroomCount &&
            matchesLookingForCount
        );
    });

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <h2 className={Styles.title}>All Listings</h2>
            </div>
            <div className={Styles.selectContainer}>
                <label>Distance (km):</label>
                <input
                    type="number"
                    placeholder="Search by distance"
                    value={searchDistance}
                    onChange={(e) => setSearchDistance(e.target.value)}
                    className={Styles.search}
                />
            </div>

            <div className={Styles.selectContainer}>
                <label>Room Count: </label>
                <select
                    className={Styles.select}
                    value={roomCount}
                    onChange={(e) => setRoomCount(e.target.value)}
                >
                    <option value="">Select</option>
                    {[...Array(5).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                    <option value="more than 5">More than 5</option>
                </select>
            </div>

            <div className={Styles.selectContainer}>
                <label>Bathroom Count: </label>
                <select
                    className={Styles.select}
                    value={bathroomCount}
                    onChange={(e) => setBathroomCount(e.target.value)}
                >
                    <option value="">Select</option>
                    {[...Array(5).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                    <option value="more than 5">More than 5</option>
                </select>
            </div>

            <div className={Styles.selectContainer}>
                <label>Looking For Count: </label>
                <select
                    className={Styles.select}
                    value={lookingForCount}
                    onChange={(e) => setLookingForCount(e.target.value)}
                >
                    <option value="">Select</option>
                    {[...Array(5).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                    <option value="more than 5">More than 5</option>
                </select>
            </div>

            {filteredListings.length === 0 ? (
                <p>No listings found</p>
            ) : (
                <ul className={Styles.list}>
                    {filteredListings.map((listing) => (
                        <li key={listing._id} className={Styles.listItem}>
                            <h3 className={Styles.listItemTitle}>
                                {listing.community} (community)
                            </h3>
                            <p className={Styles.listItemDetails}>
                                <strong>Address:</strong>{" "}
                                {listing.location[0].placeDescription}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Rooms Count:</strong>{" "}
                                {listing.roomsCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Description:</strong>{" "}
                                {listing.description}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>House Area:</strong> {listing.houseArea}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>House Width:</strong>{" "}
                                {listing.houseWidth}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Bathroom Count:</strong>{" "}
                                {listing.bathroomCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Looking For Count:</strong>{" "}
                                {listing.lookingForCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Distance from UNT:</strong>{" "}
                                {listing.distance} Km
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewListings;
