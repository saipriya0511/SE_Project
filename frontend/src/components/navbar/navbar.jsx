import React, { useEffect, useState } from "react";
import Styles from "./Navbar.module.css";
import axios from "../../axios";


const Navbar = () => {
  const [userName, setUserName] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function getUserName(req, res) {
      try {
        const res = await axios.get(`/get-username/${userId}`);

        if (res.data.userName) {
          setUserName(res.data.userName);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserName();
  }, []);

  return (
    <div className={Styles.navbar}>
      <div className={Styles.spacer}></div>
      <div className={Styles.userName}>{userName.toUpperCase()}</div>
    </div>
  );
};

export default Navbar;
