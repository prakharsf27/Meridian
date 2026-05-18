import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, type Role } from "@/context/AppContext";
import { Eye, EyeOff } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "employee" as Role, name: "Rahul Sharma",  email: "rahul.sharma@meridian.co",  password: "demo1234", label: "Employee", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { role: "manager"  as Role, name: "Priya Mehta",   email: "priya.mehta@meridian.co",   password: "demo1234", label: "Manager",  color: "bg-blue-50 border-blue-200 text-blue-800" },
  { role: "admin"    as Role, name: "Kavitha Rao",   email: "kavitha.rao@meridian.co",   password: "demo1234", label: "Admin/HR", color: "bg-purple-50 border-purple-200 text-purple-800" },
];

const ROLE_TABS: { value: Role; label: string }[] = [
  { value: "employee", label: "Employee" },
  { value: "manager",  label: "Manager" },
  { value: "admin",    label: "Admin / HR" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("rahul.sharma@meridian.co");
  const [password, setPassword] = useState("demo1234");

  const handleDemoLogin = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(acc.email);
    setSelectedRole(acc.role);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    navigate(`/${selectedRole}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        {/* Card */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-[#2e2e2e] shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#2d5a3d] rounded-[6px] font-bold italic flex items-center justify-center text-white text-lg leading-none">M</div>
              <span className="text-xl font-semibold text-white tracking-tight">Meridian</span>
            </div>

            <div className="mb-7">
              <p className="text-[#9ca3af] text-[15px] italic font-medium">Performance, simplified.</p>
              <p className="text-[#6b7280] text-[13px] mt-1">Sign in to manage goals, reviews & growth.</p>
            </div>

            <div className="h-px bg-[#2e2e2e] mb-7" />

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label className="text-[10px] font-bold text-[#6b7280] tracking-widest uppercase mb-2 block">Work Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-[#141414] border-[#2e2e2e] text-white placeholder:text-[#4b5563] focus:border-[#2d5a3d] focus:ring-0 h-10"
                  placeholder="you@company.co"
                />
              </div>

              <div>
                <Label className="text-[10px] font-bold text-[#6b7280] tracking-widest uppercase mb-2 block">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-[#141414] border-[#2e2e2e] text-white focus:border-[#2d5a3d] focus:ring-0 h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-bold text-[#6b7280] tracking-widest uppercase mb-2 block">Sign in as</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ROLE_TABS.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setSelectedRole(r.value)}
                      className={`py-2 px-2 rounded-md text-[12px] font-medium border transition-all ${
                        selectedRole === r.value
                          ? "bg-[#e8f0ea] border-[#2d5a3d] text-[#2d5a3d]"
                          : "bg-transparent border-[#2e2e2e] text-[#6b7280] hover:border-[#4a4a4a] hover:text-[#9ca3af]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2d5a3d] hover:bg-[#4a8560] text-white h-11 font-semibold text-[14px] transition-all"
              >
                Sign in
              </Button>
            </form>
          </div>

          {/* Demo credentials */}
          <div className="border-t border-[#2e2e2e] bg-[#191919] px-8 py-5">
            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-3">Demo Credentials</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => handleDemoLogin(acc)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left text-[12px] transition-all hover:opacity-90 ${acc.color}`}
                >
                  <div>
                    <span className="font-semibold">{acc.name}</span>
                    <span className="ml-2 opacity-70">·</span>
                    <span className="ml-2 opacity-70">{acc.email}</span>
                  </div>
                  <span className="font-bold text-[10px] px-2 py-0.5 bg-white/50 rounded border border-current/20">{acc.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#374151] mt-3 text-center">All accounts · password: <code className="font-mono bg-[#2e2e2e] text-[#9ca3af] px-1 rounded">demo1234</code></p>
          </div>

          <div className="px-8 py-3 text-center text-[11px] text-[#374151] border-t border-[#2e2e2e]">
            FY 2025–26 · Q2 Active
          </div>
        </div>
      </div>
    </div>
  );
}
