import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, type Role } from "@/context/AppContext";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "employee" as Role, name: "Rahul Sharma",  email: "rahul.sharma@meridian.co",  password: "demo1234", label: "Employee", color: "bg-emerald-50/50 border-emerald-200 text-emerald-800", hover: "hover:bg-emerald-100 hover:border-emerald-300" },
  { role: "manager"  as Role, name: "Priya Mehta",   email: "priya.mehta@meridian.co",   password: "demo1234", label: "Manager",  color: "bg-blue-50/50 border-blue-200 text-blue-800", hover: "hover:bg-blue-100 hover:border-blue-300" },
  { role: "admin"    as Role, name: "Kavitha Rao",   email: "kavitha.rao@meridian.co",   password: "demo1234", label: "Admin",    color: "bg-purple-50/50 border-purple-200 text-purple-800", hover: "hover:bg-purple-100 hover:border-purple-300" },
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
    setPassword(acc.password);
    setSelectedRole(acc.role);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    navigate(`/${selectedRole}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#2d5a3d]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[960px] bg-white rounded-[24px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[600px]">
        
        {/* Left Side - Branding / Welcome */}
        <div className="hidden md:flex flex-col justify-between w-[45%] bg-[#1a3825] text-white p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c12] via-transparent to-transparent opacity-80"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-[8px] font-bold italic flex items-center justify-center text-[#1a3825] text-xl leading-none shadow-sm">M</div>
              <span className="text-2xl font-semibold tracking-tight text-white">Meridian</span>
            </div>

            <div className="space-y-6 mt-12">
              <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight">
                Performance,<br />simplified.
              </h1>
              <p className="text-[#a7c9b4] text-lg max-w-[280px] leading-relaxed font-medium">
                The modern platform for goal setting, check-ins, and team growth.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4 pt-12">
            <div className="flex items-center gap-3 text-[15px] font-medium text-[#c8dfd2]">
              <CheckCircle2 className="w-5 h-5 text-[#4a8560]" /> Objective Tracking
            </div>
            <div className="flex items-center gap-3 text-[15px] font-medium text-[#c8dfd2]">
              <CheckCircle2 className="w-5 h-5 text-[#4a8560]" /> Quarterly Reviews
            </div>
            <div className="flex items-center gap-3 text-[15px] font-medium text-[#c8dfd2]">
              <CheckCircle2 className="w-5 h-5 text-[#4a8560]" /> Audit-ready Workflows
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-[55%] flex flex-col bg-white">
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <div className="md:hidden flex items-center gap-3 mb-10">
              <div className="w-9 h-9 bg-[#2d5a3d] rounded-[8px] font-bold italic flex items-center justify-center text-white text-lg leading-none">M</div>
              <span className="text-2xl font-semibold text-gray-900 tracking-tight">Meridian</span>
            </div>

            <div className="mb-8">
              <h2 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">Welcome back</h2>
              <p className="text-gray-500 text-[15px]">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2 block">Work Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#2d5a3d] focus:ring-[#2d5a3d]/20 h-12 text-[15px] rounded-[10px]"
                    placeholder="you@meridian.co"
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2 block">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 focus:border-[#2d5a3d] focus:ring-[#2d5a3d]/20 h-12 text-[15px] rounded-[10px] pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2 block">Sign in as</Label>
                  <div className="grid grid-cols-3 gap-1.5 bg-gray-50 p-1.5 rounded-[10px] border border-gray-100">
                    {ROLE_TABS.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setSelectedRole(r.value)}
                        className={`py-2 px-2 rounded-md text-[13px] font-semibold transition-all ${
                          selectedRole === r.value
                            ? "bg-white text-[#2d5a3d] shadow-sm ring-1 ring-gray-200"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/80"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2d5a3d] hover:bg-[#1a3825] text-white h-12 rounded-[10px] font-bold text-[15px] transition-all shadow-lg shadow-[#2d5a3d]/20 mt-4"
              >
                Sign In
              </Button>
            </form>
          </div>

          {/* Demo credentials */}
          <div className="bg-[#f8fafc] border-t border-gray-100 px-8 py-6 sm:px-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Quick Demo Login</span>
              <span className="text-[11px] font-mono font-medium bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-500 shadow-sm">pw: demo1234</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => handleDemoLogin(acc)}
                  className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all ${acc.color} ${acc.hover}`}
                >
                  <span className="font-bold text-[13px] leading-tight mb-1">{acc.name.split(" ")[0]}</span>
                  <span className="font-semibold text-[10px] uppercase tracking-wider opacity-70">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="text-center text-[13px] text-gray-400 mt-8 font-medium tracking-wide">
        Meridian Performance Portal · FY 2025–26
      </div>
    </div>
  );
}
