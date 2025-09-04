import React from "react";
import { PiClipboardTextBold } from "react-icons/pi";
import "./TaskDescription.css"

// Utility to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Utility to format time
const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

// Get status color based on task status
const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "#4CAF50"; // Green for completed
    case "Incomplete":
      return "#D32F2F"; // Red for incomplete
    case "Ongoing":
    default:
      return "#2196F3"; // Blue for ongoing
  }
};

const TaskDescription = ({ task, creator_name, creation_date, completion_date, deadline, description, isCompleted }) => {
  // Determine the actual status (if manually completed, override the task status)
  const actualStatus = isCompleted ? "Completed" : (task?.task_status || "Ongoing");
  const statusColor = getStatusColor(actualStatus);

  return (
    <div className="task-description">
      <div className="task-header">
        <div
          className="task-icon"
          style={{ backgroundColor: statusColor }}
        >
          <PiClipboardTextBold className="icon-lg" style={{ color: "white" }} />
        </div>
        <h1 className="task-title">{task?.title || "Untitled Task"}</h1>
      </div>

      {/* Meta Info */}
      <div className="task-meta">
        <div className="task-category">{task?.section || task?.sectionName || "Unknown Section"}</div>
        {actualStatus === "Completed" && completion_date ? (
          <div className="task-completed">
            Completed on {formatDate(completion_date)} at {formatTime(completion_date)}
          </div>
        ) : (
          <div className="task-due">
            Due {formatDate(deadline || task?.deadline)} at {formatTime(deadline || task?.deadline)}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Author & Date */}
      <div className="task-author">
        <span className="author">{creator_name || task?.creator_name || "Unknown Creator"}</span>
        <span className="dot-space">•</span>
        <span className="posted">Posted on {formatDate(creation_date || task?.creation_date)}</span>
      </div>

      {/* Description */}
      <div className="task-body">
        {description || task?.description || "No description provided."}
      </div>
    </div>
  );
};

export default TaskDescription;