// src/pages/Sections/SectionPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { taskData } from "../../data/taskData";
import FocalCard from "../../components/FocalCard/FocalCard";
import { Outlet } from "react-router-dom";
import { API_BASE_URL } from "../../api/api"; // Import API base
import "./SectionPage.css";

const SectionPage = () => {
  const { sectionId } = useParams();
  const section = taskData[sectionId];

  const [focalNames, setFocalNames] = useState({}); // { section_designation: "Full Name" or "No yet assigned" }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If on task-list route, render Outlet only
  if (window.location.pathname.includes("task-list")) {
    return <Outlet />;
  }

  // Fetch focal names for all section_designations in this section
  useEffect(() => {
    if (!section || !Array.isArray(section) || section.length === 0) {
      setLoading(false);
      return;
    }

    const fetchFocalNames = async () => {
      try {
        const nameMap = {};

        for (const item of section) {
          const { section_designation } = item;

          const response = await fetch(
            `${API_BASE_URL}/school/office/section?section_designation=${encodeURIComponent(section_designation)}`
          );


          if (!response.ok) {
            console.warn(`Failed to fetch focal for: ${section_designation}`);
            nameMap[section_designation] = "No yet assigned";
            continue;
          }

          const data = await response.json();
          if (data && data.length > 0) {
            const firstFocal = data[0];
            const fullName = `${firstFocal.first_name} ${firstFocal.middle_name ? firstFocal.middle_name + " " : ""}${firstFocal.last_name}`.trim();
            nameMap[section_designation] = fullName;
          } else {
            nameMap[section_designation] = "No yet assigned";
          }
        }

        setFocalNames(nameMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching focal names:", err);
        setError("Failed to load focal assignments.");
        setLoading(false);
      }
    };

    fetchFocalNames();
  }, [sectionId, section]);

  // Error state
  if (error) {
    return <div className="error">⚠️ {error}</div>;
  }

  // No section data
  if (!section || !Array.isArray(section) || section.length === 0) {
    return <div>No focal persons found for this section.</div>;
  }

  return (
    <div className="focal-container">
      {section.map((focal, index) => {
        const sectionDesignation = focal.section_designation;

        // Transform tasklist for FocalCard
        const documents = focal.tasklist?.map((task) => ({
          id: task.task_id,
          title: task.title,
          progress: task.task_status === "Completed" ? 100 : task.task_status === "Incomplete" ? 0 : 50,
          ...task,
        })) || [];

        // Stats (you can enhance this later with real data)
        const stats = [
          { name: "Complete", value: documents.filter(d => d.progress === 100).length },
          { name: "Past Due", value: documents.filter(d => d.progress === 0).length },
          { name: "Pending", value: documents.filter(d => d.progress === 50).length },
        ];

        // Get focal name from fetched data, fallback to "No yet assigned"
        const focalName = focalNames[sectionDesignation] || "No yet assigned";

        return (
          <FocalCard
            key={focal.id || `focal-${index}`}
            section={sectionDesignation}
            name={focalName}
            role={focal.office}
            stats={stats}
            documents={documents}
            sectionId={sectionId}
            id={focal.creator_id || `focal-${index}`}
          />
        );
      })}
      <Outlet />
    </div>
  );
};

export default SectionPage;