import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import PasswordReset from "./Components/PasswordReset/PasswordReset";
import Home from "./Components/Home/Home";
import ViewListings from "./Pages/ViewListings/ViewListings";
import Layout from "./Layout/Layout";
import AddListing from "./Pages/AddListings/AddListings";
import Navbar from "./Components/Navbar/Navbar";
import ViewCommunities from "./Pages/viewCommunities/viewCommunities";
import UserListings from "./Pages/UserListings/UserListings";
import EditListing from "./Pages/EditListing/EditListing";
import Community from "./Pages/Community/Community";

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<PasswordReset />} />
          
          <Route path="/home" element={<Home />} />

          <Route path="/home/:userId" element={<Layout />}>
          
            <Route path="add-listings" element={<AddListing />}  />
            <Route path="view-listings" element={<ViewListings />} />
            <Route path="view-communities" element={<ViewCommunities />} />
            <Route path="user-listings" element={<UserListings />} />
            <Route path="edit-listing/:listingId" element={<EditListing />} />
            <Route path="view-community/:communityId" element={<Community />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
