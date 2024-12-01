import React, { useEffect, useState } from 'react'
import Styles from './UserListings.module.css'

import axios from "../../axios";
import { useNavigate } from 'react-router-dom';

const UserListings = () => {

    const navigate = useNavigate();

    const [UserListings, setUserListings] = useState([]);
    const userId = localStorage.getItem("userId");

    const getUserListings = async () => {
        try {
            const res = await axios.get(`/user-listings/${userId}`);
            setUserListings(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserListings();
    }, [userId]);

    const handleEdit = (listingId) => {
        navigate(`/home/${userId}/edit-listing/${listingId}`);
    }

  return (
    <div>
        <h3 style={{textAlign:"center"}}>My Listings</h3>
         {UserListings && UserListings.length > 0 ? (
                <ul className={Styles.list}>
                    {UserListings.map((listing) => (
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

                            <div>
                                <button  onClick={() => handleEdit(listing._id)} className={Styles.listItemButton}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </ul>
            ) : (
                <p className={Styles.noListings}>No listings found</p>
            )}
    </div>
  )
}

export default UserListings