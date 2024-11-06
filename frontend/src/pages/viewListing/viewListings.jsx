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
    const [priceRange, setPriceRange] = useState("");

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
            (searchDistance === "5" && listing.distance <= 5) ||
            (searchDistance === "10" && listing.distance <= 10) ||
            (searchDistance === "15" && listing.distance <= 15);
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
        const matchesPriceRange =
            priceRange === "" || listing.price <= parseInt(priceRange);

        return (
            matchesDistance &&
            matchesRoomCount &&
            matchesBathroomCount &&
            matchesLookingForCount &&
            matchesPriceRange
        );
    });

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <h2 className={Styles.title}>All Listings</h2>
            </div>

            <div className={Styles.filters}>
                <div className={Styles.selectContainer}>
                    <label></label>
                    <select
                        className={Styles.select}
                        value={searchDistance}
                        onChange={(e) => setSearchDistance(e.target.value)}
                    >
                        <option value="">Distance</option>
                        <option value="5">Below 5 miles</option>
                        <option value="10">Below 10 miles</option>
                        <option value="15">Below 15 miles</option>
                    </select>
                </div>

                {/* Other Filters */}
                <div className={Styles.selectContainer}>
                    <label> </label>
                    <select
                        className={Styles.select}
                        value={roomCount}
                        onChange={(e) => setRoomCount(e.target.value)}
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
                        value={bathroomCount}
                        onChange={(e) => setBathroomCount(e.target.value)}
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
                        value={lookingForCount}
                        onChange={(e) => setLookingForCount(e.target.value)}
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
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                    >
                        <option value="">Price Range</option>
                        {[...Array(10).keys()].map((i) => (
                            <option key={i + 1} value={(i + 1) * 100}>
                                Below ${(i + 1) * 100}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {filteredListings.length === 0 ? (
                <p className={Styles.noListings}>No listings found</p>
            ) : (
                <ul className={Styles.list}>
                    {filteredListings.map((listing) => (
                        <div key={listing._id} className={Styles.listItem}>
                            <h3 className={Styles.listItemTitle}>
                                {listing?.community} (community)
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
                                {listing.bathroomCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Looking For Count:</strong>{" "}
                                {listing?.lookingForCount}
                            </p>
                            <p className={Styles.listItemDetails}>
                                <strong>Distance from UNT:</strong>{" "}
                                {(listing?.distance * 0.621371).toFixed(2)} miles
                                </p>
                        </div> 
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewListings;
