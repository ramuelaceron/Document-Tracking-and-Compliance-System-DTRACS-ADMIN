import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
//import Footer from "../../components/Footer/Footer";
import "./Home.css";
import { useSidebar } from "../../context/SidebarContext";

const Home = () => {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />

      <div className="app-body">
        <Sidebar isExpanded={isExpanded} />
        <main className="app-content">  
          <Outlet context={{ isExpanded }} /> 
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;
