import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={Styles.layoutContainer}>
      <div>
        <Sidebar />
      </div>
      <div className={Styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
