import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import RegisteredSchools from "./pages/RegisteredSchools/RegisteredSchools";
import AccountControl from "./pages/AccountControl/AccountControl";
import Dashboard from "./pages/Dashboard/Dashboard";
import SchoolAccDisplay from "./pages/RegisteredSchools/SchoolAccDisplay/SchoolAccDisplay";
import SectionPage from "./pages/Sections/SectionPage";
import TaskPage from "./pages/Task/TaskPage/TaskPage";
import TaskDetailPage from "./pages/TaskDetailPage/TaskDetailPage"
import TaskOngoing from "./pages/Task/TaskOngoing/TaskOngoing";
import TaskIncomplete from "./pages/Task/TaskIncomplete/TaskIncomplete";
import TaskHistory from "./pages/Task/TaskHistory/TaskHistory";
import VerificationPage from "./pages/AccountControl/VerificationPage";
import TerminationPage from "./pages/AccountControl/TerminationPage";
import DesignationPage from "./pages/AccountControl/DesignationPage";
import AttachmentsPage from "./pages/AttachmentsPage/AttachmentsPage";


function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Home />}>
        <Route path="/sections" element={<Dashboard />} />
        <Route path="/sections/:sectionId" element={<SectionPage />} >
          <Route path="/sections/:sectionId/task/" element={<TaskPage />} >
            <Route path="ongoing" element={<TaskOngoing />} />
            <Route path="incomplete" element={<TaskIncomplete />} />  
            <Route path="history" element={<TaskHistory />} /> 
          </Route>
        </Route>

        <Route path="/task/:sectionId/:taskSlug" element={<TaskDetailPage />} />
        <Route path="/task/:sectionId/:taskSlug/attachments" element={<AttachmentsPage />} />

        <Route path="/registered-schools" element={<RegisteredSchools />} />
        <Route path="/schools/:schoolSlug" element={<SchoolAccDisplay />} />
        <Route path="/account-control" element={<AccountControl />}>
          <Route index element={<Navigate to="verification" replace />} />
          <Route path="verification" element={<VerificationPage />} />
          <Route path="terminate" element={<TerminationPage />} />
          <Route path="designation" element={<DesignationPage />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;