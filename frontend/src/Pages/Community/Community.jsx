import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Community.module.css';
import axios from '../../axios';

const Community = () => {
  const [community, setCommunity] = useState({});
  const userId = localStorage.getItem("userId");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const communityId = useParams().communityId;
  const [locData, setLocData] = useState('');
  const [reviews, setReviews] = useState([]);

  const getCommunity = async () => {
    try {
      const res = await axios.get(`/community/${communityId}`);
      setCommunity(res.data);
      setReviews(res.data.reviews);
      setLocData(res.data.location[0]?.placeDescription);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCommunity();
  }, []);

  const addReview = async (e) => {
    e.preventDefault();
    try {
      if (rating <= 0 || rating > 5) {
        alert('Please rate between 1 to 5');
        return;
      }
      if (!feedback.trim()) {
        alert('Please enter feedback');
        return;
      }
      const res = await axios.post(`/add-review/${communityId}`, {
        userId,
        rating,
        feedback,
      });
      if (res.data.AlreadyAdded) alert(res.data.AlreadyAdded);
      if (res.data.reviewMsg) {alert(res.data.reviewMsg) 
        window.location.reload();
      };
      //getCommunity(); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleStarHover = (index) => {
    setHoverRating(index);
  };

  const handleStarHoverLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className={styles.containerMain}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{community.community}</h1>
          <img src={community.houseImage} alt={`${community.community} preview`} />
        </div>
        <div className={styles.detailsAndReview}>
          <div className={styles.content}>
            <p><strong>Location:</strong> {locData}</p>
            <p><strong>Description:</strong> {community.description}</p>
            <p><strong>Price:</strong> {community.price}</p>
            <p><strong>Rooms:</strong> {community.roomsCount}</p>
            <p><strong>Bathrooms:</strong> {community.bathroomCount}</p>
{/*             <p><strong>Looking for:</strong> {community.lookingForCount}</p> */}
            <p><strong>Width:</strong> {community.houseWidth}</p>
            <p><strong>Area:</strong> {community.houseArea}</p>
            <p><strong>Distance from UNT:</strong>{" "}
                {(community?.distance * 0.621371).toFixed(2)}{" "}
            miles</p>
          </div>
          <div className={styles.reviewForm}>
            <h4>Leave a Review</h4>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((index) => (
                <span
                  key={index}
                  className={`${styles.star} ${index <= (hoverRating || rating) ? styles.filled : ''}`}
                  onClick={() => handleStarClick(index)}
                  onMouseEnter={() => handleStarHover(index)}
                  onMouseLeave={handleStarHoverLeave}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              onChange={(e) => setFeedback(e.target.value)}
              name="comment"
              cols="30"
              rows="4"
              placeholder="Write your feedback"
            />
            <button onClick={addReview}>Submit</button>
          </div>
        </div>
      </div>
      <div className={styles.reviews}>
        <h4>Reviews</h4>
        {reviews.map((review) => (
          <div className={styles.reviewCard} key={review._id}>
            <p><strong>Feedback:</strong> {review.feedback}</p>
            <span><strong>Rating:</strong> {review.rating}</span>
          </div>
        ))}
        {reviews.length === 0 && <p>No reviews yet</p>}
      </div>
    </div>
  );
};

export default Community;
