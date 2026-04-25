import React from "react";

const FeatureItem = ({ icon, title, text }: any) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {icon}
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>
          {title}
        </div>
        <div style={{ color: "#666", fontSize: "14px" }}>{text}</div>
      </div>
    </div>
  );
};

export default FeatureItem;
