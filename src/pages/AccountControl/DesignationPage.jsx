// src/pages/AccountControl/DesignationPage.jsx
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getInitials, stringToColor } from "../../utils/iconGenerator";

import {API_BASE_URL} from "../../api/api"

const SECTIONS = [
  "School Management & Evaluation Section",
  "Planning",
  "Research",
  "Human Resource Development Section",
  "Social Mobilization and Networking Section",
  "Education Facilities Section",
  "Disaster Risk Reduction and Management",
  "School Health",
  "Dental",
  "Medical",
  "School-Based Feeding Program",
  "Gulayan sa Paaralan Program",
  "Water Sanitation, and Hygiene in Schools",
  "National Drug Education Program",
  "Reproductive Health",
  "Youth Formation",
];

const DesignationPage = () => {
  const { sortFilter } = useOutletContext(); // Not used, but for consistency
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedSection, setEditedSection] = useState({});

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/focal/verified/accounts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Failed to fetch focal accounts: ${res.status}`);

      const data = await res.json();
      const focalAccounts = (data?.data || []).map((acc) => ({
        ...acc,
        type: "Focal",
        id: acc.user_id || acc.email,
        section: acc.section || "",
      }));

      setAccounts(focalAccounts);
    } catch (err) {
      console.error("Error fetching focal accounts:", err);
      toast.error("Failed to load Focal accounts for designation.");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSaveClick = async (id) => {
    const newSection = editedSection[id];
    if (!newSection) {
      toast.error("Please select a section");
      return;
    }

    // Optional: Save to backend here if API exists
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, section: newSection } : acc))
    );
    toast.success("Section updated!");
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSectionChange = (id, value) => {
    setEditedSection((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getDisplayName = (acc) => {
    if (!acc) return "Unknown User";
    if (acc.name) return acc.name;
    const { first_name, middle_name, last_name, email } = acc;
    const fullName = [first_name, middle_name, last_name].filter(Boolean).join(" ").trim();
    return fullName || email || "Unknown User";
  };

  return (
    <div className="account-list">
      {loading ? (
        <p className="loading"></p>
      ) : accounts.length === 0 ? (
        <p className="no-accounts">No accounts found.</p>
      ) : (
        accounts.map((acc) => (
          <div key={acc.id} className="account-item designation">
            <div className="account-info">
              <div
                className="account-avatar"
                style={{ backgroundColor: stringToColor(getDisplayName(acc)) }}
              >
                {getInitials(getDisplayName(acc))}
              </div>
              <div className="account-content">
                <div className="account-name">{getDisplayName(acc)}</div>
              </div>
            </div>

            <div className="account-section">
              {editingId === acc.id ? (
                <select
                  value={editedSection[acc.id] || ""}
                  onChange={(e) => handleSectionChange(acc.id, e.target.value)}
                  className="edit-select"
                >
                  <option value="">Select a section</option>
                  {SECTIONS.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{acc.section || <em>Not assigned</em>}</span>
              )}
            </div>

            <div className="account-action">
              {editingId === acc.id ? (
                <div className="edit-actions">
                  <button
                    className="save-btn"
                    onClick={() => handleSaveClick(acc.id)}
                    disabled={!editedSection[acc.id]}
                  >
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingId(acc.id);
                    setEditedSection((prev) => ({
                      ...prev,
                      [acc.id]: acc.section || "",
                    }));
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DesignationPage;