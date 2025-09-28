// src/components/AttachmentList/AttachmentList.jsx
import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import "./AttachmentList.css";

// --- Utility functions (moved from AttachmentsPage) ---
const getAttachmentType = (url) => {
  if (!url) return "unknown";
  const lowerUrl = url.toLowerCase();

  if (
    lowerUrl.includes("youtube.com/watch") ||
    lowerUrl.includes("youtube.com/shorts") ||
    lowerUrl.includes("youtu.be/")
  ) return "youtube";

  if (lowerUrl.includes("drive.google.com")) return "drive";
  if (lowerUrl.includes("docs.google.com")) return "docs";
  if (lowerUrl.includes("sheets.google.com")) return "sheets";
  if (lowerUrl.includes("slides.google.com")) return "slides";
  if (lowerUrl.endsWith(".pdf")) return "pdf";
  if (lowerUrl.includes("tinkercad.com")) return "tinkercad";
  if (
    lowerUrl.endsWith(".jpg") ||
    lowerUrl.endsWith(".jpeg") ||
    lowerUrl.endsWith(".png") ||
    lowerUrl.endsWith(".gif")
  ) return "image";

  return "link";
};

const getYouTubeVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }
    if (parsedUrl.searchParams.has("v")) {
      return parsedUrl.searchParams.get("v");
    }
    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/")[2];
    }
    return null;
  } catch {
    return null;
  }
};

const getPreviewThumbnail = (url) => {
  const type = getAttachmentType(url);

  switch (type) {
    case "pdf":
      return (
        <div className="thumbnail-preview pdf-preview">
          <span>PDF</span>
        </div>
      );

    case "image":
      return (
        <img
          src={url}
          alt="Preview"
          className="thumbnail-preview image-preview"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "thumbnail-preview link-preview";
            fallback.innerHTML = "<span>IMG</span>";
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      );

    case "youtube": {
      const videoId = getYouTubeVideoId(url);
      if (videoId) {
        return (
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube Video Thumbnail"
            className="thumbnail-preview youtube-preview"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className = "thumbnail-preview youtube-preview fallback";
              fallback.innerHTML = "<span>YT</span>";
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        );
      }
      return (
        <div className="thumbnail-preview youtube-preview fallback">
          <span>YT</span>
        </div>
      );
    }

    case "docs":
      return (
        <img
          src="https://img.icons8.com/color/48/google-docs.png"
          alt="Google Docs"
          className="thumbnail-preview icon-preview"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "thumbnail-preview docs-preview fallback";
            fallback.innerHTML = "<span>DOC</span>";
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      );

    case "sheets":
      return (
        <img
          src="https://img.icons8.com/color/48/google-sheets.png"
          alt="Google Sheets"
          className="thumbnail-preview icon-preview"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "thumbnail-preview sheets-preview fallback";
            fallback.innerHTML = "<span>SHT</span>";
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      );

    case "slides":
      return (
        <img
          src="https://img.icons8.com/color/48/google-slides.png"
          alt="Google Slides"
          className="thumbnail-preview icon-preview"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "thumbnail-preview slides-preview fallback";
            fallback.innerHTML = "<span>PPT</span>";
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      );

    case "drive":
      return (
        <img
          src="https://img.icons8.com/color/48/google-drive.png"
          alt="Google Drive File"
          className="thumbnail-preview icon-preview"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "thumbnail-preview drive-preview fallback";
            fallback.innerHTML = "<span>DRV</span>";
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      );

    default:
      return (
        <div className="thumbnail-preview link-preview">
          <span>LINK</span>
        </div>
      );
  }
};

const getDisplayName = (url, index, total) => {
  try {
    if (url.startsWith("http")) {
      const domain = new URL(url).hostname.replace("www.", "");
      if (domain.includes("youtube.com") || domain.includes("youtu.be")) {
        return `YouTube Video ${total > 1 ? index + 1 : ""}`;
      }
      const domainName = domain.charAt(0).toUpperCase() + domain.slice(1);
      return total > 1 ? `${domainName} ${index + 1}` : domainName;
    }
    return total > 1 ? `Attachment ${index + 1}` : "Attachment";
  } catch {
    return total > 1 ? `Attachment ${index + 1}` : "Attachment";
  }
};

const AttachmentList = ({ attachments = [], onOpen }) => {
  if (!Array.isArray(attachments) || attachments.length === 0) {
    return (
      <div className="no-attachments">
        <p>⚠️ No attachments found.</p>
        <small>This submission may not have any valid URLs.</small>
      </div>
    );
  }

  return (
    <div className="attachment-list-container">
      <div className="attachments-list">
        {attachments.map((url, index) => (
          <div key={index} className="attachment-row">
            <div className="attachment-thumbnail">
              {getPreviewThumbnail(url)}
            </div>
            <div className="attachment-info">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment-title"
              >
                {getDisplayName(url, index, attachments.length)}
              </a>
              <p className="attachment-url">{url}</p>
            </div>
            <div className="attachment-actions">
              <button
                className="open-button"
                onClick={() => (onOpen ? onOpen(url) : window.open(url, "_blank"))}
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentList;