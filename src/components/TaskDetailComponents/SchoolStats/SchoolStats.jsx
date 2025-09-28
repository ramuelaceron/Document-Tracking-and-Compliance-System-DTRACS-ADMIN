import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolStats.css";
import { IoMdCheckmark } from "react-icons/io";


// Import mock data (for fallback if backend fails)
import { taskData } from "../../../data/taskData";
import { schoolAccounts } from "../../../data/schoolAccounts";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const getAccountStatusLabel = (status, deadline) => {
  const now = new Date();
  const dueDate = formatDate(deadline); // Reuse your existing formatDate helper

  if (status === "COMPLETE") {
    return {
      label: (
        <span>
          <IoMdCheckmark size={14} /> Submitted
        </span>
      ),
      className: "status-submitted"
    };
  }

  if (dueDate && now > dueDate) {
    return {
      label: "Incomplete",
      className: "status-incomplete"
    };
  }

  return {
    label: "Pending",
    className: "status-pending"
  };
};


// Status mapping
const statusLabels = {
  COMPLETE: (
    <span>
      <IoMdCheckmark size={14} /> Completed
    </span>
  ),
  ONGOING: "Pending",
  INCOMPLETE: "Incomplete",
};


const getDisplayStatus = (status) => {
  switch (status) {
    case "COMPLETE":
      return "submitted";
    case "INCOMPLETE":
      return "past_due";
    case "ONGOING":
    default:
      return "not_submitted";
  }
};


const SchoolStats = ({ task: propTask, taskId: propTaskId, sectionId: propSectionId }) => {
  const [activeTab, setActiveTab] = useState("assigned");
  const navigate = useNavigate();


  // ✅ LOG PROPS HERE — right after hooks, before any logic
  console.log("Props received from backend:", { propTask, propTaskId, propSectionId });


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
    return school ? school.logo : "https://via.placeholder.com/40?text=No+Logo"; // Default placeholder
  };


  // ✅ Generate a mock attachment URL (for testing when backend doesn't provide 'link')
  const generateMockAttachmentLink = (taskId, accountName, schoolName) => {
    const safeAccount = encodeURIComponent(accountName);
    const safeSchool = encodeURIComponent(schoolName);
    const randomExt = ["pdf", "docx", "xlsx"][Math.floor(Math.random() * 3)];
    return ``;
  };


  // Handle account click - navigate to attachments page (only for completed status)
  const handleAccountClick = (school, account) => {
    console.log("🔍 account.attachments =", account.attachments); // ← ADD THIS
    if (account.status !== "COMPLETE") {
      console.log("Account not complete:", account.assignedTo, "Status:", account.status);
      return;
    }


    // ✅ Extract ALL valid URLs from attachments
    const attachmentUrls = account.attachments
      ?.filter(att => att?.url && typeof att.url === 'string' && att.url.trim())
      .map(att => att.url);


    if (!attachmentUrls || attachmentUrls.length === 0) {
      console.warn("No valid attachment URLs available for:", account.assignedTo);
      return;
    }


     // ✅ ADD THIS LOG
    console.log("🚀 Sending to AttachmentsPage — attachmentUrls:", attachmentUrls);
    console.log("Full state:", {
      schoolName: school.name,
      accountName: account.assignedTo,
      attachmentUrls,
      taskTitle: task?.title
    });


    const taskSlug = task?.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');


    navigate(`/task/${propSectionId}/${taskSlug}/attachments`, {
      state: {
        schoolName: school.name,
        accountName: account.assignedTo,
        // ✅ Send the full array under `attachmentUrls`
        attachmentUrls: attachmentUrls,
        taskTitle: task?.title,
        taskId: propTaskId
      }
    });
  };


  // ✅ Generate school groups from `schools_required` if `accounts_required` is not usable
  const generateSchoolGroupsFromSchoolsRequired = () => {
    if (!task || !Array.isArray(task.schools_required)) return [];
   
    const schoolGroups = {};
   
    // Use schools_required array as the source of truth
    task.schools_required.forEach(schoolName => {
      if (!schoolName) return;
     
      if (!schoolGroups[schoolName]) {
        schoolGroups[schoolName] = {
          id: `${task.task_id}-${schoolName}`,
          taskId: task.task_id,
          taskTitle: task.title,
          schoolId: schoolName,
          name: schoolName,
          logo: getSchoolLogo(schoolName),
          accounts: []
        };
      }
     
      // Create dummy account entry with default values + mock link
      const account = {
        id: `${task.task_id}-${schoolName}-dummy`,
        accountId: schoolName,
        assignedTo: "Account Holder", // Placeholder
        status: "ONGOING",
        remarks: "",
        attachments: [
          {
            url: generateMockAttachmentLink(task.task_id, "Account Holder", schoolName),
            name: "Sample Submission.pdf",
            type: "application/pdf"
          }
        ]
      };


      schoolGroups[schoolName].accounts.push(account);
    });
   
    // Convert to array and determine overall school + account status
    return Object.values(schoolGroups).map(school => {
      const isSubmitted = Array.isArray(task.schools_submitted) &&
                         task.schools_submitted.includes(school.name);


      // ✅ CRITICAL FIX: Update ALL accounts' status based on school submission
      school.accounts.forEach(acc => {
        acc.status = isSubmitted ? "COMPLETE" : "ONGOING";
       
        // Ensure each account has an attachment URL (mock if missing)
        if (!acc.attachments || acc.attachments.length === 0) {
          acc.attachments = [
            {
              url: generateMockAttachmentLink(task.task_id, acc.assignedTo, school.name),
              name: "Submission File",
              type: "application/octet-stream"
            }
          ];
        }
      });


      // Determine school status based on its accounts
      const accountStatuses = school.accounts.map(acc => acc.status);
      if (accountStatuses.every(status => status === "COMPLETE")) {
        school.status = "COMPLETE";
      } else if (accountStatuses.some(status => status === "INCOMPLETE")) {
        school.status = "INCOMPLETE";
      } else {
        school.status = "ONGOING";
      }


      return school;
    });
  };


  // ✅ Group accounts by school
  const schools = useMemo(() => {
    if (!task) return [];


    // First, try to use accounts_required if it contains valid objects
    if (Array.isArray(task.accounts_required) && task.accounts_required.length > 0) {
      const firstItem = task.accounts_required[0];
      if (firstItem && typeof firstItem === 'object' &&
          'school_name' in firstItem && 'account_name' in firstItem) {
       
        const schoolGroups = {};
        task.accounts_required.forEach((account) => {
          if (!account.school_name || !account.account_name) return;
         
          if (!schoolGroups[account.school_name]) {
            schoolGroups[account.school_name] = {
              id: `${task.task_id}-${account.school_id || account.school_name}`,
              taskId: task.task_id,
              taskTitle: task.title,
              schoolId: account.school_id || account.school_name,
              name: account.school_name,
              logo: getSchoolLogo(account.school_name),
              accounts: []
            };
          }


          // Use the first link from the links array, or fallback to mock
          const attachments = [];
          // If `links` exists and is an array, use all valid URLs
          if (Array.isArray(account.links)) {
            account.links.forEach(link => {
              if (link && typeof link === 'string' && link.trim()) {
                attachments.push({
                  url: link.trim(),
                  name: "Submission File",
                  type: "application/octet-stream"
                });
              }
            });
          }


          // If no valid links, add a mock one
          if (attachments.length === 0) {
            attachments.push({
              url: generateMockAttachmentLink(task.task_id, account.account_name, account.school_name),
              name: "Submission File",
              type: "application/octet-stream"
            });
          }


          // Add account with proper attachments
          schoolGroups[account.school_name].accounts.push({
            id: `${task.task_id}-${account.school_id || account.school_name}-${account.account_id || account.account_name}`,
            accountId: account.account_id || account.account_name,
            assignedTo: account.account_name,
            status: account.status || "ONGOING",
            remarks: account.remarks || "",
            attachments: attachments
          });
        });
       
        // Convert to array and determine overall school status
        return Object.values(schoolGroups).map(school => {
          const accountStatuses = school.accounts.map(acc => acc.status);
          if (accountStatuses.every(status => status === "COMPLETE")) {
            school.status = "COMPLETE";
          } else if (accountStatuses.some(status => status === "INCOMPLETE")) {
            school.status = "INCOMPLETE";
          } else {
            school.status = "ONGOING";
          }
          return school;
        });
      }
    }
   
    // Fallback: Use schools_required to generate a basic group if accounts_required isn't usable
    return generateSchoolGroupsFromSchoolsRequired();
  }, [task]);


  // Calculate counts
  const counts = useMemo(() => {
    const assigned = schools.length;
    const submitted = schools.filter((s) => s.status === "COMPLETE").length;
    const notSubmitted = schools.filter(
      (s) => s.status === "ONGOING" || s.status === "INCOMPLETE"
    ).length;
    return { assigned, submitted, notSubmitted };
  }, [schools]);


  // Filter schools by tab
  const filteredSchools = useMemo(() => {
    if (activeTab === "assigned") return schools;
    if (activeTab === "submitted") return schools.filter((s) => s.status === "COMPLETE");
    if (activeTab === "not_submitted")
      return schools.filter((s) => s.status === "ONGOING" || s.status === "INCOMPLETE");
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
              taskDeadline={task.deadline} // 👈 Pass deadline
              getAccountStatusLabel={getAccountStatusLabel} // 👈 New function
              onAccountClick={handleAccountClick}
            />
          ))
        ) : (
          <div className="no-schools">No schools available.</div>
        )}
      </div>
    </div>
  );
};


// Separate SchoolCard component for individual hover state
const SchoolCard = ({ school, taskDeadline, getAccountStatusLabel, onAccountClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  }

  // ✅ Get school-level status label and class
  const schoolStatus = getAccountStatusLabel(school.status, taskDeadline);

  return (
    <div
      className="school-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* School Header */}
      <div className="school-header">
        <div className="school-left">
          <img
            src={school.logo}
            alt={`${school.name} logo`}
            onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=No+Logo"; }}
          />
          <h4 className="school-name">{school.name}</h4>
        </div>
        {/* ✅ Apply className to school badge */}
        <span className={`status-badge ${schoolStatus.className}`}>
          {schoolStatus.label}
        </span>
      </div>

      {/* Accounts List (on hover) */}
      <div className={`accounts-list ${isHovered ? 'expanded' : ''}`}>
        {school.accounts.map((account) => {
          // ✅ Get account-level status label and class
          const accountStatus = getAccountStatusLabel(account.status, taskDeadline);

          const isClickable = 
            account.status === "COMPLETE" && 
            account.attachments?.some(att => att?.url);

          return (
            <div key={account.id} className="account-item">
              <span className="account-name">
                Assigned to:{" "}
                <strong
                  className={`account-name-text ${
                    isClickable ? "clickable-account" : "non-clickable-account"
                  }`}
                  onClick={() => isClickable && onAccountClick(school, account)}
                  title={
                    account.status === "COMPLETE"
                      ? (isClickable ? "View attachments" : "No attachments available")
                      : "Not submitted"
                  }
                >
                  {account.assignedTo}
                </strong>
              </span>
              {/* ✅ Apply className to account badge */}
              <span className="account-status-badge small">
                {accountStatus.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SchoolStats;