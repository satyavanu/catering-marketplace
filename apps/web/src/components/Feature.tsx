import React from "react";
import FeatureItem from "./FeatureItem";
import { VerifiedIcon, TagIcon, RefreshIcon } from "./SVGS";

const Features = () => {
  return (
    <div style={{ display: "flex", gap: "40px" }}>
      <FeatureItem
        icon={<VerifiedIcon />}
        title="Verified"
        text="Background checked chefs"
      />

      <FeatureItem
        icon={<TagIcon />}
        title="Instant Pricing"
        text="Get quotes from top chefs"
      />

      <FeatureItem
        icon={<RefreshIcon />}
        title="Free Cancellation"
        text="Cancel anytime, no hidden charges"
      />
    </div>
  );
};

export default Features;
