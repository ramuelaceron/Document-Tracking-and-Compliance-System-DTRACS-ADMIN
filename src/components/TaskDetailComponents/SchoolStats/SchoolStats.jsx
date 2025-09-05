// src/components/SchoolStats/SchoolStats.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolStats.css";
import { IoMdCheckmark } from "react-icons/io";
import schoolLogo from "../../../assets/images/Start-Up.png"

// Import taskData and schoolAccounts
import { taskData } from "../../../data/taskData";
import { schoolAccounts } from "../../../data/schoolAccounts";

// Status mapping
const statusLabels = {
  Completed: (
    <span>
      <IoMdCheckmark size={14} /> Completed
    </span>
  ),
  Ongoing: "Pending",
  Incomplete: "Past Due",
};

const getDisplayStatus = (status) => {
  switch (status) {
    case "Completed":
      return "submitted";
    case "Incomplete":
      return "past_due";
    case "Ongoing":
    default:
      return "not_submitted";
  }
};

const SchoolStats = ({ task: propTask, taskId: propTaskId, sectionId: propSectionId }) => {
  const [activeTab, setActiveTab] = useState("assigned");
  const navigate = useNavigate();

  // Get task from props or fallback to taskData
  const task = useMemo(() => {
    if (propTask) return propTask;

    if (propTaskId && propSectionId) {
      const section = taskData[propSectionId];
      if (Array.isArray(section)) {
        for (const focal of section) {
          const found = focal.tasklist?.find(t => t.task_id === propTaskId);
          if (found) return found;
        }
      }
    }
    return null;
  }, [propTask, propTaskId, propSectionId]);

  // Function to get school logo by school name
  const getSchoolLogo = (schoolName) => {
    const school = schoolAccounts.find(account => account.school_name === schoolName);
    return school ? school.logo : schoolLogo; // Return the school logo or default if not found
  };

  // Handle account click - navigate to attachments page (only for completed status)
  const handleAccountClick = (school, account) => {
    if (account.status !== "Completed") return; // Only allow click for completed tasks
    
    // Create a URL-friendly slug from the task title
    const taskSlug = task?.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    navigate(`/task/${propSectionId}/${taskSlug}/attachments`, {
      state: {
        schoolName: school.name,
        accountName: account.assignedTo,
        attachments: account.attachments || [],
        taskTitle: task?.title,
        taskId: propTaskId // Still pass taskId in state for data retrieval
      }
    });
  };

  // Group accounts by school
  const schools = useMemo(() => {
    if (!task || !task.accounts_required) return [];

    // Group accounts by school
    const schoolGroups = {};
    task.accounts_required.forEach((account) => {
      if (!schoolGroups[account.school_name]) {
        schoolGroups[account.school_name] = {
          id: `${task.task_id}-${account.school_id}`,
          taskId: task.task_id,
          taskTitle: task.title,
          schoolId: account.school_id,
          name: account.school_name,
          logo: getSchoolLogo(account.school_name),
          accounts: []
        };
      }
      
      schoolGroups[account.school_name].accounts.push({
        id: `${task.task_id}-${account.school_id}-${account.account_id}`,
        accountId: account.account_id,
        assignedTo: account.account_name,
        status: account.status,
        remarks: account.remarks,
        attachments: account.attachments || [] // Include attachments if available
      });
    });

    // Convert to array and determine overall school status
    return Object.values(schoolGroups).map(school => {
      // Determine overall school status based on account statuses
      const accountStatuses = school.accounts.map(acc => acc.status);
      
      if (accountStatuses.every(status => status === "Completed")) {
        school.status = "Completed";
      } else if (accountStatuses.some(status => status === "Incomplete")) {
        school.status = "Incomplete";
      } else {
        school.status = "Ongoing";
      }
      
      return school;
    });
  }, [task]);

  // Calculate counts
  const counts = useMemo(() => {
    const assigned = schools.length;
    const submitted = schools.filter((s) => s.status === "Completed").length;
    const notSubmitted = schools.filter(
      (s) => s.status === "Ongoing" || s.status === "Incomplete"
    ).length;

    return { assigned, submitted, notSubmitted };
  }, [schools]);

  // Filter schools by tab
  const filteredSchools = useMemo(() => {
    if (activeTab === "assigned") return schools;
    if (activeTab === "submitted") return schools.filter((s) => s.status === "Completed");
    if (activeTab === "not_submitted")
      return schools.filter((s) => s.status === "Ongoing" || s.status === "Incomplete");
    return [];
  }, [activeTab, schools]);

  if (!task) {
    return (
      <div className="no-task-data">
        <p>No task data available.</p>
      </div>
    );
  }

  return (
    <div className="school-stats">
      <div className="stats-tabs">
        <div
          className={`tab ${activeTab === "assigned" ? "active" : ""}`}
          onClick={() => setActiveTab("assigned")}
        >
          <div className="tab-count">{counts.assigned}</div>
          <div className="tab-label">Assigned</div>
        </div>
        <div
          className={`tab ${activeTab === "submitted" ? "active" : ""}`}
          onClick={() => setActiveTab("submitted")}
        >
          <div className="tab-count">{counts.submitted}</div>
          <div className="tab-label">Submitted</div>
        </div>
        <div
          className={`tab ${activeTab === "not_submitted" ? "active" : ""}`}
          onClick={() => setActiveTab("not_submitted")}
        >
          <div className="tab-count">{counts.notSubmitted}</div>
          <div className="tab-label">Not Submitted</div>
        </div>
      </div>

      {/* School List */}
      <div className="school-list">
        {filteredSchools.length > 0 ? (
          filteredSchools.map((school) => (
            <SchoolCard 
              key={school.id} 
              school={school} 
              statusLabels={statusLabels}
              getDisplayStatus={getDisplayStatus}
              onAccountClick={handleAccountClick}
            />
          ))
        ) : (
          <div className="no-schools">No schools Available.</div>
        )}
      </div>
    </div>
  );
};

// Separate SchoolCard component for individual hover state
const SchoolCard = ({ school, statusLabels, getDisplayStatus, onAccountClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="school-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="school-header">
        <div className="school-left">
          <img src={school.logo} alt="school-logo" /> 
          <h4 className="school-name">{school.name}</h4>
        </div>
        <span className={`status-badge ${getDisplayStatus(school.status)}`}>
          {statusLabels[school.status] || "Pending"}
        </span>
      </div>
      
      {/* Show all assigned accounts on hover */}
      <div className={`accounts-list ${isHovered ? 'expanded' : ''}`}>
        {school.accounts.map((account) => (
          <div key={account.id} className="account-item">
            <span className="account-name">
              Assigned to:{" "}
              <strong 
                className={`account-name-text ${account.status === "Completed" ? "clickable-account" : "non-clickable-account"}`}
                onClick={() => onAccountClick(school, account)}
                title={account.status === "Completed" ? "View attachments" : "No attachments available"}
              >
                {account.assignedTo}
              </strong>
            </span>
            <span className={`account-status-badge small ${getDisplayStatus(account.status)}`}>
              {statusLabels[account.status] || "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolStats;