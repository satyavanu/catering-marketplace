import React from "react";
import { StarIcon, HeartIcon } from "./SVGS";

const ChefCard = ({ photo, name, specialty, price, distance, rating }: any) => {
  return (
    <div style={{
      width: 230,
      borderRadius: 16,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
    }}>
      
      <div style={{ position: "relative" }}>
        <img src={photo} alt={name} style={{ width: "100%", height: 150, objectFit: "cover" }} />
        
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "#fff", borderRadius: 20, padding: "2px 8px",
          display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600
        }}>
          <StarIcon /> {rating}
        </div>

        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <HeartIcon />
        </div>
      </div>

      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ color: "#777", fontSize: 13 }}>{specialty}</div>

        <div style={{ marginTop: 6, fontSize: 14 }}>
          <strong>₹{price}</strong> <span style={{ color: "#777" }}>/ person</span>
        </div>

        <div style={{ color: "#777", fontSize: 12, marginTop: 4 }}>
          📍 {distance} km away
        </div>
      </div>
    </div>
  );
};

export default ChefCard;
