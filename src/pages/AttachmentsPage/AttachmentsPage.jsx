import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import "./AttachmentsPage.css";

const AttachmentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract data from state (passed from SchoolStats)
  const { attachmentUrl, schoolName, accountName, taskTitle } = location.state || {};

  // Debug: Log received state (remove in production)
  console.log("AttachmentsPage received state:", location.state);

  // Guard: If no attachmentUrl, show error
  if (!attachmentUrl) {
    return (
      <div className="attachments-page">
        <div className="attachments-container">
          <button
            className="attachments-back-btn"
            onClick={() => navigate(-1)}
          >
            <IoChevronBackOutline /> Back
          </button>
          <div className="no-attachments">
            <p>⚠️ No attachment link found.</p>
            <small>This submission may not have a valid URL.</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="attachments-page">
      <div className="attachments-container">
        <button
          className="attachments-back-btn"
          onClick={() => navigate(-1)}
        >
          <IoChevronBackOutline /> Back
        </button>

        <div className="attachments-header">
          <h1>{taskTitle || "Task Attachment"}</h1>
          <p className="subtitle">
            <strong>School:</strong> {schoolName} |{" "}
            <strong>Account:</strong> {accountName}
          </p>
        </div>

        <div className="attachment-link-container">
          <p className="label">Click below to see attachment:</p>
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="attachment-link"
          >
            {attachmentUrl}
          </a>
        </div>

        {/* Optional: Add a secondary button for clarity */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            className="open-link-btn"
            onClick={() => window.open(attachmentUrl, "_blank")}
          >
            Open Link in New Tab
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentsPage;