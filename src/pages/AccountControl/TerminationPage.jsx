// src/pages/AccountControl/TerminationPage.jsx
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmDelete from "../../components/AccountControlComponents/AccountModals/TerminateAccount/ConfirmDelete";
import { getInitials, stringToColor } from "../../utils/iconGenerator";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../api/api";

const TerminationPage = () => {
  const { sortFilter } = useOutletContext();
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
        const [schoolResult, focalResult] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/admin/school/verified/accounts`),
          fetch(`${API_BASE_URL}/admin/focal/verified/accounts`),
        ]);

        // Process School Accounts
        if (schoolResult.status === "fulfilled" && schoolResult.value.ok) {
          const data = await schoolResult.value.json();
          schoolAccounts = (data || []).map((acc) => ({
            ...acc,
            type: "School",
            id: acc.user_id, // ✅ Use user_id for React key and deletion
          }));
        }

        // Process Focal Accounts
        if (focalResult.status === "fulfilled" && focalResult.value.ok) {
          const data = await focalResult.value.json();
          focalAccounts = (data || []).map((acc) => ({
            ...acc,
            type: "Focal",
            id: acc.user_id, // ✅ Use user_id for React key and deletion
          }));
        } else {
        }
        
      } else if (sortFilter === "School") {
        const schoolRes = await fetch(`${API_BASE_URL}/admin/school/verified/accounts`);
        if (!schoolRes.ok) throw new Error(`Failed to fetch verified schools: ${schoolRes.status}`);
        const data = await schoolRes.json();
        schoolAccounts = (data || []).map((acc) => ({
          ...acc,
          type: "School",
          id: acc.user_id,
        }));
      } else if (sortFilter === "Focal") {
        const focalRes = await fetch(`${API_BASE_URL}/admin/focal/verified/accounts`);
        if (!focalRes.ok) throw new Error(`Failed to fetch verified focals: ${focalRes.status}`);
        const data = await focalRes.json();
        focalAccounts = (data || []).map((acc) => ({
          ...acc,
          type: "Focal",
          id: acc.user_id,
        }));
      }

      setAccounts([...schoolAccounts, ...focalAccounts]);
    } catch (err) {
      console.error("Error fetching verified accounts:", err);
      toast.error("❌ Failed to load verified accounts for termination.");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [sortFilter]);

  const handleTerminateAccount = async (adminPassword) => {
  if (!accountToDelete?.user_id) {
    toast.error("❌ No valid account selected.");
    return;
  }

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser?.user_id || !adminPassword) {
    toast.error("❌ Admin credentials missing.");
    return;
  }

  const userIdToDelete = accountToDelete.user_id;
  const isSchool = accountToDelete.type === "School";
  const endpoint = isSchool
    ? "/admin/school/verified/account/delete/id/"
    : "/admin/focal/verified/account/delete/id/";

  try {
    const url = `${API_BASE_URL}${endpoint}?user_id=${encodeURIComponent(userIdToDelete)}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user_id: currentUser.user_id,
        password: adminPassword,
      }),
    });

    let data = {};
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      // ❗ Keep modal open and show error in modal
      throw new Error(data.message || `HTTP ${response.status}: ${data.detail || 'Failed to terminate account'}`);
    }

    toast.success(`${getDisplayName(accountToDelete)} has been deleted.`, {
      autoClose: 3000,
    });

    setAccounts((prev) => prev.filter((acc) => acc.user_id !== userIdToDelete));
    setIsDeleteModalOpen(false);
    setAccountToDelete(null);
  } catch (err) {
    console.error("Termination failed:", err);
    // ❗ Show error in modal instead of toast
    // You’ll need to pass setError back to ConfirmDelete — optional
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
              ? "No verified school or focal accounts found."
              : `No verified ${sortFilter.toLowerCase()} accounts found.`}
          </p>
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
                    {acc.type === "School"
                      ? acc.school_name || acc.school || "Unnamed School"
                      : acc.office || acc.department || "Focal Person"}
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