import React, { useState } from "react";
import API from "../api/api";

export default function RatingForm({ store, onClose, onSuccess }) {
  const [rating, setRating] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      await API.post("/ratings", {
        store_id: store.id,
        rating,
      });
      setMessage("Rating submitted successfully!");
      setTimeout(() => {
        onSuccess(); // Call the success handler passed from parent
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to submit rating");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, margin: 12 }}>
      <h3>Rate {store.name}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option value={n} key={n}>
                {n} star{n > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
        <button type="button" onClick={onClose} style={{ marginLeft: 8 }} disabled={isSubmitting}>
          Cancel
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}