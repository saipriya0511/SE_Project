import React from "react";
import Styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserFriends, FaPlus } from "react-icons/fa";

const Home = () => {
    const userId = localStorage.getItem("userId");
    const Navigate = useNavigate();

    return (
        <div className={Styles.container}>
            <div className={Styles.home}>
                <h1 className={Styles.heading}>House hunt</h1>
                <p className={Styles.subHeading}>Find your ideal place or roommate with ease!</p>
                <button
                    className={`${Styles.button} ${Styles.searchButton}`}
                    onClick={() => Navigate(`/home/${userId}/view-communities`)}
                >
                    <FaSearch className={Styles.icon} />
                    Search for House
                </button>
                <button
                    className={`${Styles.button} ${Styles.roommateButton}`}
                    onClick={() => Navigate(`/home/${userId}/view-listings`)}
                >
                    <FaUserFriends className={Styles.icon} />
                    Search for Roommate
                </button>
                <button
                    className={`${Styles.button} ${Styles.addButton}`}
                    onClick={() => Navigate(`/home/${userId}/add-listings`)}
                >
                    <FaPlus className={Styles.icon} />
                    Seeking for Roommate
                </button>
            </div>
        </div>
    );
};

export default Home;
