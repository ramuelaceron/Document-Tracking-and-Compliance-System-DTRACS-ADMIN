import React, { useState, useEffect } from "react";
import FocalCard from "./FocalCard";
import { API_BASE_URL } from "../../api/api";
import "./FocalCard.css";

const COLORS = ["#4CAF50", "#E53935", "#1E88E5"];

const FocalCardWithData = ({ section, name, sectionId, id }) => {
  const [stats, setStats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFocalData = async () => {
      try {
        setLoading(true);

        // Build URL with your API_BASE_URL
        const url = new URL(`${API_BASE_URL}/admin/recharts/task/data`);
        url.searchParams.append('user_id', id);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        console.log("Focal data response:", data); // Debug log

        // ✅ CORRECTED: Handle the actual response structure
        const taskStatus = data.task_status && data.task_status.length > 0 
          ? data.task_status[0] 
          : { complete: 0, incomplete: 0, ongoing: 0 };
        
        const assignments = data.assignments_status || [];

        // 1. Extract focal stats for pie chart from task_status
        const complete = taskStatus.complete || 0;
        const incomplete = taskStatus.incomplete || 0;
        const ongoing = taskStatus.ongoing || 0;

        setStats([
          { name: "Complete", value: complete },
          { name: "Past Due", value: incomplete },
          { name: "Pending", value: ongoing },
        ]);

        // 2. Map assignments to documents (tasks)
        // We need to fetch additional task details to get titles, deadlines, etc.
        const docs = await Promise.all(
          assignments.map(async (assignment) => {
            try {
              // Fetch task details to get title, description, etc.
              const taskResponse = await fetch(
                `${API_BASE_URL}/admin/tasks/all/focal_id/?user_id=${id}`
              );
              
              if (taskResponse.ok) {
                const tasks = await taskResponse.json();
                const taskDetail = tasks.find(task => task.task_id === assignment.task_id);
                
                if (taskDetail) {
                  return {
                    id: assignment.task_id,
                    title: taskDetail.title || `Task ${assignment.task_id}`,
                    progress: assignment.complete > 0 && assignment.incomplete === 0 ? 100 :
                             assignment.incomplete > 0 ? 0 : 50,
                    deadline: taskDetail.deadline || "",
                    creation_date: taskDetail.creation_date || "",
                    description: taskDetail.description || "",
                    creator_name: taskDetail.creator_name || name,
                    section_designation: section,
                    task_status: assignment.complete > 0 && assignment.incomplete === 0 ? "Completed" :
                                 assignment.incomplete > 0 ? "Incomplete" : "Ongoing",
                    // Include assignment data
                    complete: assignment.complete,
                    incomplete: assignment.incomplete,
                  };
                }
              }
              
              // Fallback if task details not found
              return {
                id: assignment.task_id,
                title: `Task ${assignment.task_id}`,
                progress: assignment.complete > 0 && assignment.incomplete === 0 ? 100 :
                         assignment.incomplete > 0 ? 0 : 50,
                deadline: "",
                creation_date: "",
                description: "",
                creator_name: name,
                section_designation: section,
                task_status: assignment.complete > 0 && assignment.incomplete === 0 ? "Completed" :
                             assignment.incomplete > 0 ? "Incomplete" : "Ongoing",
                complete: assignment.complete,
                incomplete: assignment.incomplete,
              };
            } catch (err) {
              console.error(`Error fetching task ${assignment.task_id}:`, err);
              // Return basic task data if details fetch fails
              return {
                id: assignment.task_id,
                title: `Task ${assignment.task_id}`,
                progress: assignment.complete > 0 && assignment.incomplete === 0 ? 100 :
                         assignment.incomplete > 0 ? 0 : 50,
                deadline: "",
                creation_date: "",
                description: "",
                creator_name: name,
                section_designation: section,
                task_status: assignment.complete > 0 && assignment.incomplete === 0 ? "Completed" :
                             assignment.incomplete > 0 ? "Incomplete" : "Ongoing",
                complete: assignment.complete,
                incomplete: assignment.incomplete,
              };
            }
          })
        );

        setDocuments(docs);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch focal data:", err);
        setError("Failed to load task data");
        setLoading(false);
      }
    };

    if (id && id !== "Not yet assigned" && id !== "No yet assigned") {
      fetchFocalData();
    } else {
      setLoading(false);
      setStats([
        { name: "Complete", value: 0 },
        { name: "Past Due", value: 0 },
        { name: "Pending", value: 0 },
      ]);
      setDocuments([]);
    }
  }, [id, name, section, API_BASE_URL]);

  if (loading) {
    return (
      <div className="focal-card">
        <div className="focal-header">
          <div className="focal-avatar-generated" style={{ backgroundColor: "#ccc" }}>
            ...
          </div>
          <div>
            <h3>{section}</h3>
            <p>{name}</p>
          </div>
        </div>
        <div className="focal-body">
          <div className="focal-chart">
            <h4 className="summary">Monthly Summary</h4>
            <div style={{ width: 180, height: 180, background: "#f5f5f5", borderRadius: "50%" }}></div>
            <div className="focal-legend">
              <span><span className="legend-box complete"></span>Loading...</span>
            </div>
          </div>
          <div className="focal-documents">
            <div className="focal-document skeleton">Loading tasks...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="focal-card">
        <div className="focal-header">
          <div className="focal-avatar-generated" style={{ backgroundColor: "#ef4444" }}>
            ❌
          </div>
          <div>
            <h3>{section}</h3>
            <p>{name}</p>
          </div>
        </div>
        <div className="focal-body">
          <div className="focal-documents">
            <div className="focal-document error">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FocalCard
      section={section}
      name={name}
      stats={stats}
      documents={documents}
      sectionId={sectionId}
      id={id}
    />
  );
};

export default FocalCardWithData;