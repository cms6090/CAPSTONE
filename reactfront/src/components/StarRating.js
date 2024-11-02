// components/StarRating.js
import React from 'react';

export default function StarRating({ rating }) {
  const maxStars = 5; // 최대 별 개수

  return (
    <div className="star-rating">
      {[...Array(maxStars)].map((_, index) => (
        <span key={index} className={index < rating ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </div>
  );
}
