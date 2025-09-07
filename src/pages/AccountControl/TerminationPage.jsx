// src/pages/AccountControl/TerminationPage.jsx
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmDelete from "../../components/AccountControlComponents/AccountModals/TerminateAccount/ConfirmDelete";
import { getInitials, stringToColor } from "../../utils/iconGenerator";
import { toast } from "react-toastify";

const API_BASE_URL = "http://192.168.1.62:8000";

const TerminationPage = () => {
  const { sortFilter } = useOutletContext(); // We don't use it here, but kept for consistency
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAccounts = async () => {
  setLoading(true);
  try {
    let schoolAccounts = [];
    let focalAccounts = [];

    if (sortFilter === "All") {
      const [schoolRes, focalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/school/verified/accounts`),
        fetch(`${API_BASE_URL}/admin/focal/verified/accounts`),
      ]);

      if (!schoolRes.ok) throw new Error(`Failed to fetch verified schools: ${schoolRes.status}`);
      if (!focalRes.ok) throw new Error(`Failed to fetch verified focals: ${focalRes.status}`);

      const schoolData = await schoolRes.json();
      const focalData = await focalRes.json();

      schoolAccounts = (schoolData?.data || []).map((acc) => ({
        ...acc,
        type: "School",
        id: acc.user_id || acc.email,
      }));

      focalAccounts = (focalData?.data || []).map((acc) => ({
        ...acc,
        type: "Focal",
        id: acc.user_id || acc.email,
      }));
    } else if (sortFilter === "School") {
      const schoolRes = await fetch(`${API_BASE_URL}/admin/school/verified/accounts`);
      if (!schoolRes.ok) throw new Error(`Failed to fetch verified schools: ${schoolRes.status}`);
      const schoolData = await schoolRes.json();
      schoolAccounts = (schoolData?.data || []).map((acc) => ({
        ...acc,
        type: "School",
        id: acc.user_id || acc.email,
      }));
    } else if (sortFilter === "Focal") {
      const focalRes = await fetch(`${API_BASE_URL}/admin/focal/verified/accounts`);
      if (!focalRes.ok) throw new Error(`Failed to fetch verified focals: ${focalRes.status}`);
      const focalData = await focalRes.json();
      focalAccounts = (focalData?.data || []).map((acc) => ({
        ...acc,
        type: "Focal",
        id: acc.user_id || acc.email,
      }));
    }

    setAccounts([...schoolAccounts, ...focalAccounts]);
  } catch (err) {
    console.error("Error fetching verified accounts:", err);
    toast.error("Failed to load verified accounts for termination.");
    setAccounts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAccounts();
  }, [sortFilter]); // ✅ Now it re-fetches when filter changes

  const handleTerminateAccount = async () => {
    if (!accountToDelete) return;

    const userId = accountToDelete.user_id;
    if (!userId) {
      toast.error("Account has no user_id.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/account/verified-delete/user/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to terminate account");
      }

      toast.error(`${getDisplayName(accountToDelete)} has been terminated.`);
      setAccounts((prev) => prev.filter((acc) => acc.user_id !== userId));
    } catch (err) {
      console.error("Termination failed:", err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setIsDeleteModalOpen(false);
      setAccountToDelete(null);
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
            <div key={acc.id} className="account-item termination">
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
                <button
                  className="delete-btn"
                  onClick={() => {
                    setAccountToDelete(acc);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAccountToDelete(null);
        }}
        onConfirm={handleTerminateAccount}
        accountName={getDisplayName(accountToDelete)}
      />
    </>
  );
};

export default TerminationPage;