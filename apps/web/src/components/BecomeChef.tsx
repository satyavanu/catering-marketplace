import React from "react";
import { RupeeIcon, ChefHatIcon, BagIcon } from "./SVGS";

const BecomeChefCTA = () => {
  return (
    <div style={{
      width: 330,
      background: "linear-gradient(#FFF7F3, #FFF9F6)",
      padding: 28,
      borderRadius: 18,
      position: "relative",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    }}>
      
      <h2 style={{ margin: 0, fontWeight: 700 }}>Become a Chef<br />with <span style={{ color: "#FF6A21" }}>Droooly</span></h2>

      <p style={{ color: "#777", marginTop: 8 }}>
        Join our community of verified home chefs and start earning.
      </p>

      <button style={{
        marginTop: 14,
        padding: "10px 22px",
        background: "#FF6A21",
        border: "none",
        color: "#fff",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer"
      }}>
        Join Now →
      </button>

      <div style={{ position: "absolute", right: 10, top: 40, opacity: 0.3 }}>
        <RupeeIcon />
        <BagIcon />
        <ChefHatIcon />
      </div>

      <img
        src="chef_photo.png"
        alt="Chef"
        style={{
          position: "absolute",
          right: -10,
          bottom: 0,
          height: 190
        }}
      />
    </div>
  );
};

export default BecomeChefCTA;
