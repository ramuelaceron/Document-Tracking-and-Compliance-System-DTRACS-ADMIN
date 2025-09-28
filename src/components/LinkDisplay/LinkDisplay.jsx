// src/components/LinkDisplay/LinkDisplay.jsx
import React from "react";
import "./LinkDisplay.css";

// --- Same utility functions as AttachmentList ---
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
      return <div className="link-thumbnail pdf-thumb"><span>PDF</span></div>;

    case "image":
      return (
        <img
          src={url}
          alt="Preview"
          className="link-thumbnail image-thumb"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "link-thumbnail link-thumb";
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
            alt="YouTube Thumbnail"
            className="link-thumbnail youtube-thumb"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className = "link-thumbnail youtube-thumb fallback";
              fallback.innerHTML = "<span>YT</span>";
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        );
      }
      return <div className="link-thumbnail youtube-thumb fallback"><span>YT</span></div>;
    }

    case "docs":
      return (
        <img
          src="https://img.icons8.com/color/48/google-docs.png"
          alt="Google Docs"
          className="link-thumbnail icon-thumb"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "link-thumbnail docs-thumb fallback";
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
          className="link-thumbnail icon-thumb"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "link-thumbnail sheets-thumb fallback";
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
          className="link-thumbnail icon-thumb"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "link-thumbnail slides-thumb fallback";
            fallback.innerHTML = "<span>PPT</span>";
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      );

    case "drive":
      return (
        <img
          src="https://img.icons8.com/color/48/google-drive.png"
          alt="Google Drive"
          className="link-thumbnail icon-thumb"
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = document.createElement("div");
            fallback.className = "link-thumbnail drive-thumb fallback";
            fallback.innerHTML = "<span>DRV</span>";
            e.target.parentElement?.appendChild(fallback);
          }}
        />
      );

    default:
      return <div className="link-thumbnail link-thumb"><span>LINK</span></div>;
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
    return total > 1 ? `Attachment ${index + 1}` : "Link";
  } catch {
    return "Link";
  }
};

const LinkDisplay = ({ url, index = 0, total = 1, onOpen }) => {
  return (
    <div className="link-display-row">
      <div className="link-display-thumbnail">
        {getPreviewThumbnail(url)}
      </div>
      <div className="link-display-info">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-display-title"
        >
          {getDisplayName(url, index, total)}
        </a>
        <p className="link-display-url">{url}</p>
      </div>
      <div className="link-display-actions">
        <button
          className="link-open-button"
          onClick={() => (onOpen ? onOpen(url) : window.open(url, "_blank"))}
        >
          Open
        </button>
      </div>
    </div>
  );
};

export default LinkDisplay;