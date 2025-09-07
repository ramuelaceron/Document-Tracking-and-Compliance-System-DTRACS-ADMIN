// src/pages/AccountControl/VerificationPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import VerificationModal from "../../components/AccountControlComponents/AccountModals/VerifyAccount/VerificationModal";
import { getInitials, stringToColor } from "../../utils/iconGenerator";
import { toast } from "react-toastify";

const API_BASE_URL = "http://192.168.1.62:8000";

const VerificationPage = () => {
  const { sortFilter } = useOutletContext();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      let url;
      if (sortFilter === "School") {
        url = `${API_BASE_URL}/admin/school/account/request`;
      } else if (sortFilter === "Focal") {
        url = `${API_BASE_URL}/admin/focal/account/request`;
      }

      if (sortFilter === "All") {
        const [schoolRes, focalRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/school/account/request`),
          fetch(`${API_BASE_URL}/admin/focal/account/request`),
        ]);

        if (!schoolRes.ok) throw new Error(`School request failed: ${schoolRes.status}`);
        if (!focalRes.ok) throw new Error(`Focal request failed: ${focalRes.status}`);

        const schoolData = await schoolRes.json();
        const focalData = await focalRes.json();

        const schoolAccounts = (schoolData?.data || []).map((acc) => ({
          ...acc,
          type: "School",
          id: acc.id || acc.email,
        }));

        const focalAccounts = (focalData?.data || []).map((acc) => ({
          ...acc,
          type: "Focal",
          id: acc.id || acc.email,
        }));

        setAccounts([...schoolAccounts, ...focalAccounts]);
      } else {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        const transformed = (data?.data || []).map((acc) => ({
          ...acc,
          type: sortFilter,
          id: acc.id || acc.email,
        }));
        setAccounts(transformed);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      toast.error("Failed to load account requests. Check connection.");
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
    if (!selectedAccount) {
      toast.error("No account selected.");
      return;
    }

    const userId = selectedAccount.user_id;
    if (!userId) {
      toast.error("Account has no user_id.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/account/request-delete/user/${encodeURIComponent(userId)}`,
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

      toast.warn(`${getDisplayName(selectedAccount)} has been denied.`, { autoClose: 2000 });
      setAccounts((prev) => prev.filter((acc) => acc.user_id !== userId));
      setTimeout(handleCloseModal, 100);
    } catch (err) {
      console.error("Deny failed:", err);
      toast.error(`❌ Deny failed: ${err.message}`);
    }
  };

  const handleVerify = async () => {
    if (!selectedAccount) {
      toast.error("No account selected.");
      return;
    }

    const userId = selectedAccount.user_id;
    if (!userId) {
      toast.error("Account has no user_id.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/account/verification/user/${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
          <p className="no-accounts">No accounts found.</p>
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
                    {acc.type === "School" ? acc.school_name || acc.school : "Focal"}
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