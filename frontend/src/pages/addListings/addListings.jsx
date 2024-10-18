import React, { useState } from "react";
import axiosInstance from "../../axios";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Styles from "./AddListings.module.css";

const AddListing = () => {

  const [suggestions, setSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    community: "",
    location: "",
    roomsCount: "",
    houseArea: "",
    houseWidth: "",
    bathroomCount: "",
    lookingForCount: "",
    description: "",
  });

  const {
    community,
    location,
    roomsCount,
    description,
    houseArea,
    houseWidth,
    bathroomCount,
    lookingForCount,
  } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !community ||
        !location ||
        !roomsCount ||
        !description ||
        !houseArea ||
        !houseWidth ||
        !bathroomCount ||
        !lookingForCount
      ) {
        toast.dismiss();
        toast.error("Please fill all the fields");
        return;
      }
      
      const response = await axiosInstance.post("/add-listing", formData);
      toast.dismiss();

      if (response.data.Added) {
        toast.success("Listing added successfully!");
      }
    } catch (error) {
      console.error("There was an error adding the listing!", error);
      toast.error("Error adding the listing. Try again.");
    }
  };

  const locationChange = async (e) => {
    const { value } = e.target;

    setFormData({
      ...formData,
      location: value,
    });

    if (value) {
      const results = await autoCompletePlaces(value);

      console.log(results.predictions)

      

      const descriptions = results.predictions.map(result => result.description);
        console.log(descriptions); 
    
      
      setSuggestions(results.description);
    }
  };

  async function autoCompletePlaces(input) {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?input=${input}&api_key=keJsi8v9wvcTK6yiSujDT6bPZ3mzzYPYKDPKcGhx`,
        {
          headers: {
            "X-Request-Id": Math.random().toString(36).slice(2),
            "X-Correlation-Id": Math.random().toString(36).slice(2),
          },
        }
      );
      return response.data; 
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  return (
    <div className={Styles.container}>
      <h2 className={Styles.heading}>Add Listing</h2>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.formGroup}>
          <label className={Styles.label}>Community:</label>
          <input
            type="text"
            name="community"
            value={community}
            onChange={handleInputChange}
            className={Styles.input}
          />
        </div>
        <div className={Styles.formGroup}>
          <label className={Styles.label}>Location:</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={locationChange}
            className={Styles.input}
          />
        </div>

        {}
        <div className={Styles.formGroup}>
          <label className={Styles.label}>Rooms Count:</label>
          <input
            type="number"
            name="roomsCount"
            value={roomsCount}
            onChange={handleInputChange}
            className={Styles.input}
            min="1"
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>House Area:</label>
          <input
            type="text"
            name="houseArea"
            value={houseArea}
            onChange={handleInputChange}
            className={Styles.input}
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>House Width:</label>
          <input
            type="text"
            name="houseWidth"
            value={houseWidth}
            onChange={handleInputChange}
            className={Styles.input}
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>Bathroom Count:</label>
          <input
            type="number"
            name="bathroomCount"
            value={bathroomCount}
            onChange={handleInputChange}
            className={Styles.input}
            min="1"
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>Looking For Count:</label>
          <input
            type="number"
            name="lookingForCount"
            value={lookingForCount}
            onChange={handleInputChange}
            className={Styles.input}
            min="1"
          />
        </div>

        <div className={Styles.formGroup}>
          <label className={Styles.label}>Description:</label>
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
            className={Styles.textarea}
          />
        </div>

        <button type="submit" className={Styles.submitButton}>
          Add Listing
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddListing;