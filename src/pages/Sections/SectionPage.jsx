// src/pages/Sections/SectionPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { taskData } from "../../data/taskData";
import FocalCardWithData from "../../components/FocalCard/FocalCardWithData";
import { Outlet } from "react-router-dom";
import { API_BASE_URL } from "../../api/api";
import "./SectionPage.css";

const SectionPage = () => {
  const { sectionId } = useParams();
  const section = taskData[sectionId];

  const [focalNames, setFocalNames] = useState({});
  const [focalData, setFocalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch focal data for all section_designations in this section
  useEffect(() => {
    // If on task-list route, don't fetch data
    if (window.location.pathname.includes("task-list")) {
      setLoading(false);
      return;
    }

    if (!section || !Array.isArray(section) || section.length === 0) {
      setLoading(false);
      return;
    }

    const fetchFocalData = async () => {
      try {
        const nameMap = {};
        const dataMap = {};

        for (const item of section) {
          const { section_designation } = item;

          const response = await fetch(
            `${API_BASE_URL}/admin/office/section?section_designation=${encodeURIComponent(section_designation)}`
          );

          if (!response.ok) {
            if (response.status === 404) {
              console.log(`No focals found for: ${section_designation}`);
              nameMap[section_designation] = "Not yet assigned";
              dataMap[section_designation] = null;
            } else {
              console.warn(`Failed to fetch focal for: ${section_designation}`);
              nameMap[section_designation] = "Error loading data";
              dataMap[section_designation] = null;
            }
            continue;
          }

          const data = await response.json();
          if (data && data.length > 0) {
            const firstFocal = data[0];
            const fullName = `${firstFocal.first_name} ${firstFocal.middle_name ? firstFocal.middle_name + " " : ""}${firstFocal.last_name}`.trim();
            nameMap[section_designation] = fullName;
            dataMap[section_designation] = firstFocal;
          } else {
            nameMap[section_designation] = "Not yet assigned";
            dataMap[section_designation] = null;
          }
        }

        setFocalNames(nameMap);
        setFocalData(dataMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching focal data:", err);
        setError("Failed to load focal assignments.");
        setLoading(false);
      }
    };

    fetchFocalData();
  }, [sectionId, section]);

  // If on task-list route, render Outlet only
  if (window.location.pathname.includes("task-list")) {
    return <Outlet />;
  }

  // Error state
  if (error) {
    return <div className="error">⚠️ {error}</div>;
  }

  // Loading state
  if (loading) {
    return <div className="loading">Loading focal assignments...</div>;
  }

  // No section data
  if (!section || !Array.isArray(section) || section.length === 0) {
    return <div>No section data found for {sectionId}.</div>;
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

        // Stats
        const stats = [
          { name: "Complete", value: documents.filter(d => d.progress === 100).length },
          { name: "Past Due", value: documents.filter(d => d.progress === 0).length },
          { name: "Pending", value: documents.filter(d => d.progress === 50).length },
        ];

        // Get focal name from fetched data
        const focalName = focalNames[sectionDesignation] || "Not yet assigned";
        
        // Get the actual focal data for ID and other properties
        const actualFocal = focalData[sectionDesignation];
        const focalId = actualFocal?.user_id || `focal-${index}`;

        return (
          <FocalCardWithData
            key={focalId}
            section={sectionDesignation}
            name={focalName}
            sectionId={sectionId}
            id={focalId}  // This should be the actual user_id from the backend
          />
        );
      })}
      <Outlet />
    </div>
  );
};

export default SectionPage;