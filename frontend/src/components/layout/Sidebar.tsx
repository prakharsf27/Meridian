import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Target, CheckSquare, FileText,
  Settings, Users, BarChart3, LogOut, ShieldCheck, Bell
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
}

const EMPLOYEE_NAV: NavItem[] = [
  { to: "/employee/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/employee/goals", icon: Target, label: "My Goals" },
  { to: "/employee/checkin", icon: CheckSquare, label: "Check-in", badge: "Q2" },
];

const MANAGER_NAV: NavItem[] = [
  { to: "/manager/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/manager/approvals", icon: CheckSquare, label: "Approvals", badge: 3 },
  { to: "/manager/reviews", icon: FileText, label: "Reviews" },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin/audit", icon: ShieldCheck, label: "Audit Logs" },
  { to: "/admin/escalations", icon: Bell, label: "Escalations", badge: 4 },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

function NavItemRow({ item }: { item: NavItem }) {
  const location = useLocation();
  const active = location.pathname === item.to;
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className={`flex items-center justify-between px-3 py-2 my-0.5 rounded-md text-[13px] font-medium transition-all ${
        active
          ? "bg-[#e8f0ea] text-[#2d5a3d] border border-[#2d5a3d]/30"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-[15px] h-[15px] flex-shrink-0" />
        <span>{item.label}</span>
      </div>
      {item.badge !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
          active ? "bg-[#2d5a3d] text-white" : "bg-[#2d5a3d] text-white"
        }`}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const { role } = useApp();
  const nav = role === "employee" ? EMPLOYEE_NAV : role === "manager" ? MANAGER_NAV : ADMIN_NAV;
  const sectionLabel = role === "employee" ? "My Work" : role === "manager" ? "Team" : "Administration";

  return (
    <aside className="w-[180px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-12 px-4 flex items-center gap-2.5 border-b border-gray-200">
        <div className="w-6 h-6 bg-[#2d5a3d] rounded-[4px] font-bold italic flex items-center justify-center text-white text-sm">M</div>
        <span className="font-semibold text-gray-900 text-[15px] tracking-tight">Meridian</span>
      </div>

      {/* Nav section label */}
      <div className="px-3 pt-5 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {sectionLabel}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2">
        {nav.map(item => <NavItemRow key={item.to} item={item} />)}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-gray-200">
        <Link
          to="/login"
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-[15px] h-[15px]" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
