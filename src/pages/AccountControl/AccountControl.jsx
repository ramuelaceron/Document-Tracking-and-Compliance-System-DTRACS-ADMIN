// src/pages/AccountControl/AccountControl.jsx
import React, { useState } from "react";
import "./AccountControl.css";

// Components
import AccountTabs from "../../components/AccountControlComponents/AccountTabs/AccountTabs";
import VerificationModal from "../../components/AccountControlComponents/AccountModals/VerifyAccount/VerificationModal";
import ConfirmDelete from "../../components/AccountControlComponents/AccountModals/TerminateAccount/ConfirmDelete";

// Utils - Import the icon generator functions
import { getInitials, stringToColor } from "../../utils/iconGenerator";

// Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock data - moved outside component to avoid re-initialization
const initialMockAccounts = {
  verification: [
    {
      id: 1,
      name: "Juan Dela Cruz",
      type: "School",
      school: "Binan Integrated HS",
      email: "example@deped.edu.ph",
      phone: "+63 9123456789",
      address: "Purok 3 Brgy. Sto. Tomas, Biñan City, Laguna, 4024",
    },
    {
      id: 2,
      name: "Maria Santos",
      type: "Focal",
      email: "maria@deped.edu.ph",
      phone: "+63 9234567890",
      address: "San Antonio HS",
    },
    {
      id: 3,
      name: "Pedro Ramos",
      type: "School",
      school: "San Antonio HS",
      email: "pedro@deped.edu.ph",
      phone: "+63 9345678901",
      address: "San Antonio HS",
    },
    {
      id: 4,
      name: "Ana Cruz",
      type: "Focal",
      email: "ana@deped.edu.ph",
      phone: "+63 9456789012",
      address: "Focal Office",
    },
  ],
  termination: [
    { id: 5, name: "Tedro Reyes", school: "Binan Integrated HS", type: "School" },
    { id: 6, name: "Ana Cruz", school: "San Antonio HS", type: "Focal" },
  ],
  designation: [
    { id: 7, name: "Isidra L. Galman", section: "School Management & Evaluation Section" },
    { id: 8, name: "Edward R. Manuel", section: "Planning & Research Section" },
    { id: 9, name: "Charles M. Patio", section: "Planning & Research Section" },
    { id: 10, name: "Artnafe N. Ode", section: "Planning & Research Section" },
    { id: 11, name: "Arletta P. Alora", section: "Human Resource Development Section" },
    { id: 12, name: "Mary Joy L. Cabiles", section: "Human Resource Development Section" },
    { id: 13, name: "Donna Jane M. Alfonso", section: "Social Mobilization and Networking Section" },
    { id: 14, name: "Eva Joyce V. Cabantog", section: "Social Mobilization and Networking Section" },
    { id: 15, name: "Precious Joy A. Coronado", section: "Education Facilities Section" },
  ],
};

// Mock sections for dropdown
const sections = [
  "School Management & Evaluation Section",
  "Planning & Research Section",
  "Human Resource Development Section",
  "Social Mobilization and Networking Section",
  "Education Facilities Section",
  "Disaster Risk Reduction and Management",
  "School Health",
  "Youth Formation",
];

const AccountControl = () => {
  const [activeTab, setActiveTab] = useState("verification");
  const [sortFilter, setSortFilter] = useState("All");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedSection, setEditedSection] = useState({});
  const [accountsData, setAccountsData] = useState(initialMockAccounts); // Use state for accounts data

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSortFilter("All");
    setEditingId(null); // Reset editing when switching tabs
  };

  const handleSortChange = (e) => {
    setSortFilter(e.target.value);
  };

  const handleInspect = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDeny = () => {
    toast.warn(`${selectedAccount?.name} has been denied.`, { autoClose: 2000 });
    setTimeout(handleCloseModal, 100);
  };

  const handleVerify = () => {
    toast.success("Account verified!", { autoClose: 1000 });
    setTimeout(handleCloseModal, 100);
  };

  const handleEditClick = (id) => {
    setEditingId(id);
    // Set the current section as the initial value for editing
    const currentAccount = accountsData.designation.find(acc => acc.id === id);
    setEditedSection((prev) => ({
      ...prev,
      [id]: currentAccount?.section || "",
    }));
  };

  const handleSaveClick = (id) => {
    const newSection = editedSection[id];
    
    if (newSection) {
      // Update the accounts data with the new section
      setAccountsData(prev => ({
        ...prev,
        designation: prev.designation.map(acc =>
          acc.id === id ? { ...acc, section: newSection } : acc
        )
      }));
      
      toast.success("Section updated!");
    } else {
      toast.error("Please select a section");
    }
    
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

  // Pick account based on tab - use the state data
  let accounts = accountsData[activeTab] || [];

  // Apply filter for verification & termination
  if (activeTab === "verification" || activeTab === "termination") {
    if (sortFilter !== "All") {
      accounts = accounts.filter((acc) => acc.type === sortFilter);
    }
  }

  return (
    <div className="account-control">
      {/* Tabs */}
      <AccountTabs onTabChange={handleTabChange} />

      {/* Filter only for verification & termination */}
      {(activeTab === "verification" || activeTab === "termination") && (
        <div className="account-filter">
          <select value={sortFilter} onChange={handleSortChange}>
            <option value="All">All Accounts</option>
            <option value="School">School</option>
            <option value="Focal">Focals</option>
          </select>
        </div>
      )}

      {/* Account list */}
      <div className="account-list">
        {accounts.map((acc) => (
          <div key={acc.id} className={`account-item ${activeTab}`}>
            {/* Left column: avatar + name (+ meta for non-designation) */}
            <div className="account-info">
              <div 
                className="account-avatar" 
                style={{ backgroundColor: stringToColor(acc.name) }}
              >
                {getInitials(acc.name)}
              </div>
              <div className="account-content">
                <div className="account-name">{acc.name}</div>

                {/* Only show meta under the name for verification/termination */}
                {(activeTab === "verification" || activeTab === "termination") && (
                  <div className="account-meta">
                    {acc.type === "School" ? acc.school : "Focal"}
                  </div>
                )}
              </div>
            </div>

            {/* Middle column: section (designation only) */}
            {activeTab === "designation" && (
              <div className="account-section">
                {editingId === acc.id ? (
                  <select
                    value={editedSection[acc.id] || ""}
                    onChange={(e) => handleSectionChange(acc.id, e.target.value)}
                    className="edit-select"
                  >
                    <option value="">Select a section</option>
                    {sections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  acc.section // This will now show the updated section
                )}
              </div>
            )}

            {/* Right column: action button */}
            <div className="account-action">
              {activeTab === "verification" && (
                <button className="inspect-btn" onClick={() => handleInspect(acc)}>
                  Inspect
                </button>
              )}
              {activeTab === "termination" && (
                <button
                  className="delete-btn"
                  onClick={() => {
                    setAccountToDelete(acc);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete Account
                </button>
              )}
              {activeTab === "designation" && (
                <>
                  {editingId === acc.id ? (
                    <div className="edit-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleSaveClick(acc.id)}
                        disabled={!editedSection[acc.id]} // Disable if no section selected
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(acc.id)}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Register Information Modal */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Registered Information"
        onDeny={handleDeny}
        onVerify={handleVerify}
      >
        <div className="modal-details">
          <p><strong>Registered as:</strong> {selectedAccount?.type}</p>
          <p><strong>Name:</strong> {selectedAccount?.name}</p>
          <p><strong>Email:</strong> {selectedAccount?.email}</p>
          <p><strong>Contact Number:</strong> {selectedAccount?.phone}</p>
          <p><strong>School:</strong> {selectedAccount?.school || selectedAccount?.section}</p>
          <p><strong>School Address:</strong> {selectedAccount?.address}</p>
        </div>
      </VerificationModal>

      {/* Password-Protected Delete Confirmation */}
      <ConfirmDelete
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAccountToDelete(null);
        }}
        onConfirm={() => {
          toast.error(`${accountToDelete?.name} has been deleted.`);
          setIsDeleteModalOpen(false);
          setAccountToDelete(null);
        }}
        accountName={accountToDelete?.name}
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
};

export default AccountControl;