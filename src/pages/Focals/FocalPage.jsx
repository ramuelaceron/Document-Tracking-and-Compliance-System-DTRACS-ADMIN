import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import TaskTabs from "../../components/TaskTabs/TaskTabs";
import { taskData } from "../../data/taskData"; // import your merged data
import "./FocalPage.css";

const FocalPage = ({ isExpanded }) => {
  const { sectionId, focalId } = useParams(); // get from URL
  const [activeTab, setActiveTab] = useState("ongoing");
  const [sortFilter, setSortFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
   
  useEffect(() => {
    if (sectionData[sectionId]) {
      const focal = taskData[sectionId].find(f => f.id === focalId);
      if (focal) {
        // keep the original index for routing
        const withIdx = (focal.documents || []).map((doc, idx) => ({ ...doc, idx }));
        setTasks(withIdx);
      }
    }
  }, [sectionId, focalId]);

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => task.status === activeTab);

  return (
    <div className={`sections-container ${isExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      {/* ✅ Single TaskTabs, with counts and handlers */}
      <TaskTabs
        onTabChange={setActiveTab}
        onSortChange={setSortFilter}
        taskCounts={{
          //Dots appear if task count> 0
          ongoing: tasks.filter(t => t.status === "ongoing").length,
          pastdue: tasks.filter(t => t.status === "pastdue").length,
          history: tasks.filter(t => t.status === "history").length,
        }}
      />

      <div className="task-list-wrapper">
        <TaskList 
          tasks={filteredTasks}
          sectionId={sectionId} 
          focalId={focalId}  
        />
      </div>
    </div>
  );
};

export default FocalPage;