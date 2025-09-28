
import React, { useState, useRef } from "react";
import { PiClipboardTextBold } from "react-icons/pi";
import useClickOutside from "../../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import "./TaskDescription.css";
import LinkDisplay from "../../../components/LinkDisplay/LinkDisplay";

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

// ✅ FIXED: Robust date parser that handles "2025-09-27T16:22:18"
const parseDate = (str) => {
  if (!str) return null;
  if (str instanceof Date) return str;
  if (typeof str === 'string') {
    // If it's an ISO-like string WITHOUT timezone info,
    // assume it's in LOCAL time (not UTC), so DO NOT append 'Z'
    // Only treat as UTC if it explicitly has 'Z' or offset
    if (str.includes('T') && !str.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(str)) {
      // Keep as local time — do nothing
      // Example: "2025-09-27T16:22:18" → parsed as local 4:22 PM
    }
  }
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date;
};

// ✅ Icon color logic with remarks fallback
const getIconColor = ({ isCompleted, deadline, completedTime, remarks }) => {
  // Parse deadline once
  const due = parseDate(deadline);
  const now = new Date();

  // Case 1: Task is NOT completed
  if (!isCompleted) {
    // If deadline exists and is in the past → overdue (red)
    if (due && now > due) {
      return "#d32f2f"; // Red for overdue incomplete tasks
    }
    // Otherwise, it's incomplete but not overdue → blue
    return "#2196F3";
  }

  // Case 2: Task IS completed
  // Priority 1: Use remarks (most reliable)
  if (remarks === "TURNED IN LATE") {
    return "#FF9800"; // Orange for late submission
  }

  // Priority 2: Fallback to timestamp comparison
  if (!completedTime || !deadline) {
    return "#4CAF50"; // Default green
  }

  const actualCompletion = parseDate(completedTime);

  if (!actualCompletion || !due || isNaN(actualCompletion.getTime()) || isNaN(due.getTime())) {
    return "#4CAF50";
  }

  return actualCompletion > due ? "#FF9800" : "#4CAF50";
};


const TaskDescription = ({ 
  task, 
  creator_name, 
  creation_date, 
  deadline, 
  description, 
  isCompleted,
  onTaskUpdated,
  schools_required = [],
  accounts_required = [],
  token,
  completedTime,
  remarks, // ✅ Accept remarks prop
}) => {
  console.log("🔍 FINAL CHECK - TaskDescription Props:", {
  isCompleted,
  completedTime,
  deadline,
  remarks,
  iconColor: getIconColor({ isCompleted, deadline, completedTime, remarks })
});

  const navigate = useNavigate();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null);
  
  useClickOutside(optionsMenuRef, () => {
    if (showOptionsMenu) setShowOptionsMenu(false);
  });

  const iconColor = getIconColor({ 
    isCompleted, 
    deadline, 
    completedTime,
    remarks // ✅ Pass to color logic
  });

  // Determine pulse class based on status
  const getPulseClass = () => {
    if (!isCompleted) {
      const due = parseDate(deadline);
      const now = new Date();
      if (due && now > due) {
        return 'task-icon-pulse-red';
      }
      return 'task-icon-pulse'; // blue pulse
    }
    return ''; // no pulse if completed
  };

const pulseClass = getPulseClass();

  return (
    <div className="task-description">
      <div className="task-header">
        <div 
          className={`task-description-icon ${pulseClass}`}
          style={{ backgroundColor: iconColor }}
        >
          <PiClipboardTextBold className="icon-lg" style={{ color: "white" }} />
        </div>
        
        <div className="task-title-container">
          <h1 className="task-title">{task?.title || "Untitled Task"}</h1>
          
          <div className="task-actions-container">
            
            {showOptionsMenu && (
              <div ref={optionsMenuRef} className="options-dropdown">
                <button onClick={handleEditTask} className="dropdown-item">
                  Edit Task
                </button>
                <button onClick={handleDeleteTask} className="dropdown-item delete">
                  Delete Task
                </button>
                <button onClick={handleCopyLink} className="dropdown-item">
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="task-meta">
        <div className="task-category">{task?.section || task?.sectionName || "Unknown Section"}</div>
        {isCompleted && completedTime ? (
          <div className="task-completed">
            Completed on {formatDate(completedTime)} at {formatTime(completedTime)}
            {iconColor === "#FF9800" && (
              <span className="task-late-badge"> (Late)</span>
            )}
          </div>
        ) : (
          <div className="task-due">
            Due {formatDate(deadline || task?.deadline)} at {formatTime(deadline || task?.deadline)}
          </div>
        )}
      </div>

      <div className="divider" />

      <div className="task-author">
        <span className="author">{creator_name || task?.creator_name || "Unknown Creator"}</span>
        <span className="dot-space">•</span>
        <span className="posted">Posted on {formatDate(creation_date || task?.creation_date)}</span>
      </div>

      <div 
        className="task-body"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(description || task?.description || "<em>No description</em>") 
        }}
      />

      {task?.links && (
        (Array.isArray(task.links)
          ? task.links.length > 0
          : typeof task.links === 'string' && task.links.trim() !== ""
        ) && (
          <div className="task-links-section">
            <h3 className="task-link-header">
              Attach Link{Array.isArray(task.links) && task.links.length > 1 ? 's' : ''}:
            </h3>
            <div className="task-links-list">
              {Array.isArray(task.links)
                ? task.links.map((link, idx) => (
                    <LinkDisplay
                      key={idx}
                      url={link}
                      index={idx}
                      total={task.links.length}
                    />
                  ))
                : <LinkDisplay url={task.links} />}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TaskDescription;