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

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
        <Routes>

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
