import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { SidebarContext } from "./SidebarContext";

export default function DashboardLayout({ children, title }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarValue = {
    isCollapsed,
    toggle: () => setIsCollapsed(!isCollapsed),
  };

  return (
    <SidebarContext.Provider value={sidebarValue}>
      <div className="min-h-screen bg-[var(--color-background)]" dir="rtl">
        <Sidebar />

        <div
          className="transition-all duration-300"
          style={{
            marginRight: isCollapsed ? "4rem" : "15rem",
          }}
        >
          <Header title={title} />

          <main className="pt-24 p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
