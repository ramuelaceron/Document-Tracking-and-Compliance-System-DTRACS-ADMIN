// src/pages/AccountControl/VerificationPage.jsx
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import VerificationModal from "../../components/AccountControlComponents/AccountModals/VerifyAccount/VerificationModal";
import { getInitials, stringToColor } from "../../utils/iconGenerator";
import { toast } from "react-toastify";

const API_BASE_URL = "https://infrastructure-albums-elegant-hughes.trycloudflare.com";

const VerificationPage = () => {
  const { sortFilter } = useOutletContext();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      if (sortFilter === "All") {
        const [schoolResult, focalResult] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/admin/school/account/request`),
          fetch(`${API_BASE_URL}/admin/focal/account/request`),
        ]);

        let schoolAccounts = [];
        let focalAccounts = [];

        // Process School Accounts
        if (schoolResult.status === "fulfilled" && schoolResult.value.ok) {
          const data = await schoolResult.value.json();
          schoolAccounts = (data || []).map((acc) => ({
            ...acc,
            type: "School",
            id: acc.user_id, // ✅ Use user_id for React key and actions
          }));
        }

        // Process Focal Accounts
        if (focalResult.status === "fulfilled" && focalResult.value.ok) {
          const data = await focalResult.value.json();
          focalAccounts = (data || []).map((acc) => ({
            ...acc,
            type: "Focal",
            id: acc.user_id, // ✅ Use user_id for React key and actions
          }));
        }

        setAccounts([...schoolAccounts, ...focalAccounts]);
      } else {
        let url;
        if (sortFilter === "School") {
          url = `${API_BASE_URL}/admin/school/account/request`;
        } else if (sortFilter === "Focal") {
          url = `${API_BASE_URL}/admin/focal/account/request`;
        } else {
          setAccounts([]);
          setLoading(false);
          return;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const data = await res.json(); // → Raw array, NOT { data: [...] }
        const transformed = (data || []).map((acc) => ({
          ...acc,
          type: sortFilter,
          id: acc.user_id, // ✅ Critical
        }));

        setAccounts(transformed);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      toast.error("❌ Failed to load account requests. Check connection or backend logs.");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [sortFilter]);

  const handleInspect = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDeny = async () => {
  if (!selectedAccount?.user_id) {
    toast.error("❌ No valid account selected.");
    return;
  }

  const userId = selectedAccount.user_id;
  const isSchool = selectedAccount.type === "School";
  const endpoint = isSchool
    ? "/admin/school/request/delete/id/"
    : "/admin/focal/request/delete/id/";

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}?user_id=${encodeURIComponent(userId)}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    let data = {};
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: Failed to deny account`);
    }

    toast.warn(`🗑️ ${getDisplayName(selectedAccount)} has been denied.`, { autoClose: 2000 });
    setAccounts((prev) => prev.filter((acc) => acc.user_id !== userId));
    setTimeout(handleCloseModal, 100);
  } catch (err) {
    console.error("Deny failed:", err);
    toast.error(`❌ Deny failed: ${err.message}`);
  }
};

  const handleVerify = async () => {
  if (!selectedAccount?.user_id) {
    toast.error("❌ No valid account selected.");
    return;
  }

  const userId = selectedAccount.user_id;

  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/account/verification?user_id=${encodeURIComponent(userId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // No body needed
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Verification failed");
    }

    toast.success(`✅ Verified: ${getDisplayName(selectedAccount)}`);
    setAccounts((prev) => prev.filter((acc) => acc.user_id !== userId));
    setTimeout(handleCloseModal, 100);
  } catch (err) {
    console.error("Verification failed:", err);
    toast.error(`❌ ${err.message}`);
  }
};

  const getDisplayName = (acc) => {
    if (!acc) return "Unknown User";
    if (acc.name) return acc.name;
    const { first_name, middle_name, last_name, email } = acc;
    const fullName = [first_name, middle_name, last_name].filter(Boolean).join(" ").trim();
    return fullName || email || "Unknown User";
  };

  return (
    <>
      <div className="account-list">
        {loading ? (
          <p className="loading"></p>
        ) : accounts.length === 0 ? (
          <p className="no-accounts">
            {sortFilter === "All"
              ? "No pending school or focal accounts found."
              : `No pending ${sortFilter.toLowerCase()} accounts found.`}
          </p>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="account-item verification">
              <div className="account-info">
                <div
                  className="account-avatar"
                  style={{ backgroundColor: stringToColor(getDisplayName(acc)) }}
                >
                  {getInitials(getDisplayName(acc))}
                </div>
                <div className="account-content">
                  <div className="account-name">{getDisplayName(acc)}</div>
                  <div className="account-meta">
                    {acc.type === "School"
                      ? acc.school_name || acc.school || "Unnamed School"
                      : acc.office || acc.department || "Focal Person"}
                  </div>
                </div>
              </div>
              <div className="account-action">
                <button className="inspect-btn" onClick={() => handleInspect(acc)}>
                  Inspect
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Registered Information"
        onDeny={handleDeny}
        onVerify={handleVerify}
      >
        {selectedAccount && (
          <div className="modal-details">
            <p><strong>Registered as:</strong> {selectedAccount.type || "Unknown"}</p>
            <p><strong>Name:</strong> {getDisplayName(selectedAccount)}</p>
            <p><strong>Email:</strong> {selectedAccount.email || "N/A"}</p>
            <p><strong>Contact Number:</strong> {selectedAccount.phone || selectedAccount.contact_number || "N/A"}</p>

            {selectedAccount.type === "School" ? (
              <>
                <p><strong>School Name:</strong> {selectedAccount.school_name || selectedAccount.school || "N/A"}</p>
                <p><strong>School Address:</strong> {selectedAccount.school_address || "N/A"}</p>
              </>
            ) : selectedAccount.type === "Focal" ? (
              <>
                <p><strong>Office:</strong> {selectedAccount.office || selectedAccount.department || "N/A"}</p>
                {selectedAccount.office_address && (
                  <p><strong>Office Address:</strong> {selectedAccount.office_address || "N/A"}</p>
                )}
              </>
            ) : null}
          </div>
        )}
      </VerificationModal>
    </>
  );
};

export default VerificationPage;