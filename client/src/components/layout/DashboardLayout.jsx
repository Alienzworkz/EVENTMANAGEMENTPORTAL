import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen pt-16 bg-[hsl(var(--background))]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="transition-all duration-200 ease-in-out"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        <div className="p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
