import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import './Home.css'; // Assuming you have a CSS file for Home component styles

const Home = () => {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div className="app">
      {/* Header with sidebar toggle */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="app-body">

        <Sidebar isExpanded={isExpanded} />

        {/* Content area where child routes will be injected */}
        <main className="app-content">  
          <Outlet />   {/* 👈 This is where Dashboard, Todo, Offices, etc. will show */}
        </main>
      </div>
    </div>
  );
};

export default Home;