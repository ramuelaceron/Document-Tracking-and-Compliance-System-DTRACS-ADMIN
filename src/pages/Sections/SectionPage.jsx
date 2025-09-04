// src/pages/Sections/SectionPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { taskData } from "../../data/taskData";
import FocalCard from "../../components/FocalCard/FocalCard"; // Changed import
import { Outlet } from 'react-router-dom';
import "./SectionPage.css";

const SectionPage = () => {
  const { sectionId } = useParams();
  const section = taskData[sectionId];

  // If we are on /SGOD/SMME/task-list, don't show cards
  if (window.location.pathname.includes('task-list')) {
    return <Outlet />; // Render TaskListPage
  }

  if (!section || !Array.isArray(section) || section.length === 0) {
    return <div>No focal persons found for this section.</div>;
  }

  return (
    <div className="focal-container">
      {section.map((focal, index) => {
        // Transform the data to match FocalCard's expected props
        const stats = [
          { name: "Complete", value: 60 },    // You might want to calculate these dynamically
          { name: "Past Due", value: 15 },    // based on actual task data
          { name: "Pending", value: 25 }
        ];

        const documents = focal.tasklist.map(task => ({
          id: task.task_id,
          title: task.title,
          progress: task.task_status === "Completed" ? 100 : 50 // Simplified progress calculation
        }));

        return (
          <FocalCard
            key={focal.id || `focal-${index}`} // Use id if available, otherwise fallback
            section={focal.section_designation}
            name={focal.full_name}
            role={focal.office} // Using office as role
            stats={stats}
            documents={documents}
            sectionId={sectionId}
            id={focal.creator_id || `focal-${index}`} // Pass the creator_id or fallback
          />
        );
      })}
      <Outlet /> {/* In case you want to render nested routes below */}
    </div>
  );
};

export default SectionPage;