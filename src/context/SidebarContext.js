import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = (expand) => {
    setIsExpanded((prev) => (typeof expand === "boolean" ? expand : !prev));
  };

  return (
    <SidebarContext.Provider
      value={{ isExpanded, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);