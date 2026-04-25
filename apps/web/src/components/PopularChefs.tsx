import React from "react";
import ChefCard from "./ChefCard";
import BecomeChefCTA from "./BecomeChef";

const PopularChefsBlock = () => {
  return (
    <div style={{
      display: "flex",
      gap: 30,
      padding: "20px 0",
      alignItems: "flex-start"
    }}>
      
      <div style={{ display: "flex", gap: 20 }}>
        <ChefCard
          photo="chef1.jpg"
          name="Chef Ramesh"
          specialty="South Indian Specialist"
          price={250}
          distance={2.3}
          rating={4.8}
        />

        <ChefCard
          photo="chef2.jpg"
          name="Chef Priya"
          specialty="Homestyle Meals"
          price={300}
          distance={1.8}
          rating={4.7}
        />

        <ChefCard
          photo="chef3.jpg"
          name="Chef Arjun"
          specialty="North Indian Expert"
          price={280}
          distance={3.0}
          rating={4.6}
        />

        <ChefCard
          photo="chef4.jpg"
          name="Chef Meena"
          specialty="Healthy Meals"
          price={320}
          distance={2.0}
          rating={4.6}
        />
      </div>

      <BecomeChefCTA />
    </div>
  );
};

export default PopularChefsBlock;
