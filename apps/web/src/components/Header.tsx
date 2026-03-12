'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [language, setLanguage] = useState('EN');
  const [currency, setCurrency] = useState('USD');

  return (
    <header>
      <div className="max-w-7xl px-4">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-circle">C</div>
            <span className="logo-text">CaterHub</span>
          </Link>

          {/* Navigation */}
          <nav>
            <Link href="/">Home</Link>
            <Link href="#caterers">Caterers</Link>
            <Link href="#menus">Menus</Link>
            <Link href="#reviews">Reviews</Link>
          </nav>

          {/* Right Section */}
          <div className="header-right">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>EN</option>
              <option>ES</option>
              <option>FR</option>
            </select>

            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>

            <button className="btn-login">Login</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;