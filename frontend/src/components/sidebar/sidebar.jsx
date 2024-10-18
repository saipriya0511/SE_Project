import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Styles from './Sidebar.module.css';

const Sidebar = () => {
  const userId = localStorage.getItem("userId");

  return (
    <div className={Styles.container}>
      <div className={Styles.sidebar}>
        <NavLink 
          to={`/home/${userId}/add-listings`} 
          className={({ isActive }) => (isActive ? Styles.activeLink : Styles.link)}
        >
          Add Listing
        </NavLink>
        <NavLink 
          to={`/home/${userId}/view-listings`} 
          className={({ isActive }) => (isActive ? Styles.activeLink : Styles.link)}
        >
          View Listings
        </NavLink>

        <div className={Styles.spacer}></div>
        
        <Link to="/" onClick={() => localStorage.removeItem("userId")} className={Styles.logout}>Logout</Link>
      </div>
    </div>
  );
};

export default Sidebar;
