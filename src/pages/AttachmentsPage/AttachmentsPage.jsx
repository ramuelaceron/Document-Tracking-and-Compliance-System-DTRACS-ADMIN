// src/pages/AttachmentsPage/AttachmentsPage.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import AttachmentList from "./AttachmentList/AttachmentList";
import "./AttachmentsPage.css";

const AttachmentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { attachmentUrl, attachmentUrls, schoolName, accountName, taskTitle } = location.state || {};

  // Normalize to array
  const attachments = React.useMemo(() => {
    if (Array.isArray(attachmentUrls)) return attachmentUrls;
    if (attachmentUrl) return [attachmentUrl];
    return [];
  }, [attachmentUrl, attachmentUrls]);

  return (
    <div className="attachments-page">
      <button className="attachments-back-btn" onClick={() => navigate(-1)}>
        <IoChevronBackOutline /> Back
      </button>

      <div className="attachments-header">
        <h1>{taskTitle || "Task Attachments"}</h1>
        <p className="subtitle">
          <strong>School:</strong> {schoolName} | <strong>Account:</strong> {accountName}
        </p>
        {attachments.length > 1 && (
          <p className="attachments-count">
            {attachments.length} attachment{attachments.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      <AttachmentList attachments={attachments} />
    </div>
  );
};

export default AttachmentsPage;