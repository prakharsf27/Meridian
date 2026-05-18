import { useApp } from "@/context/AppContext";
import { NotificationCenter } from "./NotificationCenter";

const ROLE_INFO = {
  employee: { name: "Rahul Sharma", subtitle: "Employee", initials: "RS", avatarBg: "bg-emerald-100 text-emerald-800", context: "My Performance · FY 2025–26" },
  manager:  { name: "Priya Mehta",  subtitle: "Manager",  initials: "PM", avatarBg: "bg-blue-100 text-blue-800",    context: "Team Management · Engineering" },
  admin:    { name: "Kavitha Rao",  subtitle: "Admin / HR", initials: "KR", avatarBg: "bg-purple-100 text-purple-800", context: "Organisation Admin · FY 2025–26" },
};

export function Topbar() {
  const { role } = useApp();
  const info = ROLE_INFO[role];

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#2d5a3d] rounded-[4px] font-bold italic flex items-center justify-center text-white text-sm">M</div>
        <span className="font-semibold text-gray-900 text-[15px] tracking-tight mr-3">Meridian</span>
        <span className="text-gray-300 text-sm">|</span>
        <span className="text-sm text-gray-500 font-medium ml-3">{info.context}</span>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-[11px] ${info.avatarBg}`}>
            {info.initials}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-gray-900 leading-tight">{info.name}</div>
            <div className="text-[10px] text-gray-500 leading-tight">{info.subtitle}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
