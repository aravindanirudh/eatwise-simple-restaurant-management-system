import { useEffect, useState } from "react";
import axios from 'axios';

const Reviews = () => {
  // State to hold reviews data
  const [reviews, setReviews] = useState([]);

  // Fetch reviews from the backend when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:8800/reviews");
        setReviews(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReviews();
  }, []);

  // Function to render star ratings
  const renderStars = (rating) => {
  const rounded = Math.round(rating); // rounds 4.1 to 4, 4.7 to 5
  return Array.from({ length: 5 }, (_, i) =>
    <span key={i}>{i < rounded ? '★' : '☆'}</span>
  );
  };

  return (  
    <section className="reviews-section">
      <h2>WHAT OTHERS ARE SAYING...</h2>
      <p>Reviews from our frequent visitors</p>
      <div className="reviews-container">
        {reviews.map((review) => (
          <div className="review-card" key={review.review_id}>
          <p className="review-card-description">"{review.description}"</p>
          <p className="review-author">- {review.username}</p>
          <p className="rating-value">{renderStars(review.rating)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;