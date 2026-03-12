import React from 'react';
import CaterCard from './CaterCard';
import { Cater } from '../types';

const mockCaters: Cater[] = [
  {
    id: 1,
    name: 'Elegant Events Catering',
    cuisine: 'French & International',
    pricePerPerson: 45,
    reviews: 128,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Spice Route Kitchen',
    cuisine: 'Indian & Asian Fusion',
    pricePerPerson: 35,
    reviews: 95,
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Mediterranean Bites',
    cuisine: 'Mediterranean & Greek',
    pricePerPerson: 40,
    reviews: 110,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Grill Master BBQ',
    cuisine: 'American BBQ',
    pricePerPerson: 30,
    reviews: 87,
    rating: 4.5,
  },
  {
    id: 5,
    name: 'Sushi Artistry',
    cuisine: 'Japanese',
    pricePerPerson: 50,
    reviews: 142,
    rating: 4.9,
  },
  {
    id: 6,
    name: 'Farm to Table Delights',
    cuisine: 'Organic & Vegetarian',
    pricePerPerson: 38,
    reviews: 76,
    rating: 4.7,
  },
];

const CaterList = () => {
  return (
    <section id="caterers" className="bg-gray-50">
      <div className="max-w-7xl px-4">
        <h2>Featured Caterers</h2>
        <p>Explore our curated selection of top-rated catering services</p>

        <div className="grid grid-3">
          {mockCaters.map((cater) => (
            <CaterCard key={cater.id} cater={cater} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaterList;