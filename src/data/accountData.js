
export const AdminAccountData = {
  user_id: "SCHOOL-0001",
  first_name: "Bayani",
  middle_name: "M.",
  last_name: "Enriquez",
  email: "example@deped.edu.ph",
  contact_number: "+63 9123456789",
  password: "admin",
  registration_date: "2025-08-28T08:24:58.083191",
  active: true,
  avatar: "",
  school_name: "Binan Integrated National High School",
  school_address: "Nong Sto. Domingo, Biñan City, Laguna, 4024",
}

// Add fullName property
AdminAccountData.fullName = `${AdminAccountData.first_name} ${AdminAccountData.middle_name} ${AdminAccountData.last_name}`.trim();

// 📚 Export lookup map by email
export const loginAccounts = {
  [AdminAccountData.email]: AdminAccountData,
  // Add other accounts here as needed
};

// ✅ Now define userAvatars — all values are initialized
export const userAvatars = {
  // Full name (lowercase)
  [AdminAccountData.fullName.toLowerCase()]: AdminAccountData.avatar,

  // Email
  [AdminAccountData.email]: AdminAccountData.avatar,

  // First + Last
  [`${AdminAccountData.first_name} ${AdminAccountData.last_name}`.toLowerCase()]: AdminAccountData.avatar,
};