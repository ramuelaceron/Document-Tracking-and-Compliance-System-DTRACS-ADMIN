import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import SectionCard from "../../components/SectionCard/SectionCard"; // adjust path if needed
import { sections } from "../../data/sections"; // assuming you have a sections data file

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="section-container">
      {sections.map((section, index) => (
        <SectionCard
          key={index}
          title={section.title}   // ✅ use string
          image={section.image}   // ✅ use string path
          onClick={() => navigate(`/sections/${section.id}`)} // Navigate to the section path
        />
      ))}
    </div>
  );
};

export default Dashboard;