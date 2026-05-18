import { useApp, type Role } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

const ROLES: { value: Role; label: string; color: string }[] = [
  { value: "employee", label: "Employee", color: "bg-emerald-600" },
  { value: "manager", label: "Manager", color: "bg-blue-600" },
  { value: "admin", label: "Admin / HR", color: "bg-purple-600" },
];

export function RoleSwitcher() {
  const { role, setRole } = useApp();
  const navigate = useNavigate();

  const handleSwitch = (r: Role) => {
    setRole(r);
    navigate(`/${r}/dashboard`, { replace: true });
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Demo</span>
      {ROLES.map(r => (
        <button
          key={r.value}
          onClick={() => handleSwitch(r.value)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            role === r.value
              ? `${r.color} text-white shadow-sm`
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
