import React from 'react';
import { Cater } from '../types';

interface CaterCardProps {
  cater: Cater;
}

const CaterCard = ({ cater }: CaterCardProps) => {
  return (
    <div className="card">
      <div className="card-image">Image</div>
      <div className="card-content">
        <h3>{cater.name}</h3>
        <p>{cater.cuisine}</p>

        <div className="card-meta">
          <span className="rating">★★★★★</span>
          <span className="reviews">({cater.reviews} reviews)</span>
        </div>

        <p className="card-price">${cater.pricePerPerson}/person</p>

        <button className="btn-primary">View Details</button>
      </div>
    </div>
  );
};

export default CaterCard;