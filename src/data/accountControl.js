// src/controllers/accountControl.js

// Mock data
export const initialMockAccounts = {
  verification: [
    {
      id: 1,
      name: "Maria Sofia Dela Cruz",
      type: "School",
      school: "Biñan City Science & Technology High School",
      email: "example@deped.edu.ph",
      phone: "+63 9123456789",
      address: "Silmer Village San Francisco, Biñan City, Laguna, 4024",
    },
    {
      id: 2,
      name: "Juan Miguel Fernandez",
      type: "Focal",
      email: "maria@deped.edu.ph",
      phone: "+63 9234567890",
      address: "San Antonio HS",
    },
    {
      id: 3,
      name: "Ana Patricia Garcia",
      type: "School",
      school: "Biñan City Senior High School-San Antonio Campus",
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
    { id: 5, name: "Carlos Andres Reyes", school: "Biñan City Senior High School-Sto.Tomas Campus", type: "School" },
    { id: 6, name: "Isabel Joy Bautista", school: "San Antonio HS", type: "School" },
    { id: 7, name: "Isidra L. Galman", school: "San Antonio HS", type: "Focal" },
    { id: 8, name: "Edward R. Manuel", school: "San Antonio HS", type: "Focal" },
    { id: 9, name: "Charles M. Patio", school: "San Antonio HS", type: "Focal" },
    { id: 10, name: "Artnafe N. Ode", school: "San Antonio HS", type: "Focal"},
    { id: 11, name: "Arletta P. Alora",school: "San Antonio HS", type: "Focal" },
    { id: 12, name: "Mary Joy L. Cabiles", school: "San Antonio HS", type: "Focal" },
    { id: 13, name: "Donna Jane M. Alfonso", school: "San Antonio HS", type: "Focal" },
    { id: 14, name: "Eva Joyce V. Cabantog", school: "San Antonio HS", type: "Focal" },
    { id: 15, name: "Precious Joy A. Coronado", school: "San Antonio HS", type: "Focal" },
  ],
  designation: [
    { id: 16, name: "Isidra L. Galman", section: "School Management & Evaluation Section" },
    { id: 17, name: "Edward R. Manuel", section: "Planning & Research Section" },
    { id: 18, name: "Charles M. Patio", section: "Planning & Research Section" },
    { id: 19, name: "Artnafe N. Ode", section: "Planning & Research Section" },
    { id: 20, name: "Arletta P. Alora", section: "Human Resource Development Section" },
    { id: 21, name: "Mary Joy L. Cabiles", section: "Human Resource Development Section" },
    { id: 22, name: "Donna Jane M. Alfonso", section: "Social Mobilization and Networking Section" },
    { id: 23, name: "Eva Joyce V. Cabantog", section: "Social Mobilization and Networking Section" },
    { id: 24, name: "Precious Joy A. Coronado", section: "Education Facilities Section" },
  ],
};

// Mock sections for dropdown
export const sections = [
  "School Management & Evaluation Section",
  "Planning & Research Section",
  "Human Resource Development Section",
  "Social Mobilization and Networking Section",
  "Education Facilities Section",
  "Disaster Risk Reduction and Management",
  "School Health",
  "Youth Formation",
];

// Filter accounts based on active tab and filter
export const getFilteredAccounts = (accountsData, activeTab, sortFilter) => {
  let accounts = accountsData[activeTab] || [];
  
  if (activeTab === "verification" || activeTab === "termination") {
    if (sortFilter !== "All") {
      accounts = accounts.filter((acc) => acc.type === sortFilter);
    }
  }
  
  return accounts;
};