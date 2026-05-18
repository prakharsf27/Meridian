import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { RoleSwitcher } from "./RoleSwitcher";

export function MainLayout() {
  return (
    <div className="flex h-screen bg-[#f5f6f8] text-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-5 pb-20">
          <Outlet />
        </main>
      </div>
      <RoleSwitcher />
    </div>
  );
}
