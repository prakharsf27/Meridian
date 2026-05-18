import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SEED_EMPLOYEES } from "@/lib/seedData";
import { computeUomScore, computeWeightedScore } from "@/lib/uom";

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div className={`w-9 h-9 rounded-full ${color} text-white font-bold flex items-center justify-center text-[12px] flex-shrink-0`}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-[#e8f0ea] text-[#2d5a3d] border-[#2d5a3d]/30",
    submitted: "bg-amber-50 text-amber-800 border-amber-200",
    draft: "bg-gray-100 text-gray-600 border-gray-200",
    locked: "bg-[#e8f0ea] text-[#2d5a3d] border-[#2d5a3d]/30",
  };
  const labels: Record<string, string> = { approved: "Approved", submitted: "Pending", draft: "Draft", locked: "Approved" };
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${styles[status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function CheckInBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Submitted": "bg-amber-50 text-amber-800 border-amber-200",
    "Reviewed": "bg-[#e8f0ea] text-[#2d5a3d] border-[#2d5a3d]/30",
    "Not due": "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${styles[status] ?? "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
}

function MetricCard({ label, value, sub, subColor = "text-[#4a8560]", warn }: any) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${warn ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
      <div className="text-[13px] font-medium text-gray-500 mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className={`text-xs font-medium mt-1 ${warn ? "text-amber-700" : subColor}`}>{sub}</div>
    </div>
  );
}

const CHECKIN_STATUS = ["Submitted", "Not due", "Not due", "Reviewed"];

export function ManagerDashboard() {
  const navigate = useNavigate();
  const employees = SEED_EMPLOYEES;
  const pendingCount = employees.filter(e => e.sheetStatus === "submitted").length;

  const employeesWithScore = employees.map(emp => {
    const scores = emp.goals.map(g => ({
      score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
      weightage: g.weightage,
    }));
    return { ...emp, weightedScore: computeWeightedScore(scores) };
  });

  const avgCompletion = Math.round(
    employeesWithScore.reduce((s, e) => s + e.weightedScore, 0) / employeesWithScore.length
  );

  const approvedCount = employees.flatMap(e => e.goals.filter(g => g.locked)).length;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">Engineering Team · {employees.length} direct reports · Q2 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Pending approvals" value={pendingCount} sub="Requires action" warn />
        <MetricCard label="Check-ins pending" value={2} sub="Review needed" subColor="text-[#4a8560]" />
        <MetricCard label="Team completion" value={<>{avgCompletion}<span className="text-lg text-gray-400">%</span></>} sub="Avg across team" />
        <MetricCard label="Goals approved" value={approvedCount} sub="This cycle" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Team members</h2>
          <Link to="/manager/approvals">
            <Button variant="outline" className="h-8 text-xs bg-gray-50">
              View pending <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Goals</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-40">Q2 Progress</th>
              <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Check-in</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employeesWithScore.map((emp, i) => (
              <tr
                key={emp.id}
                onClick={() => navigate(`/manager/approvals/${emp.id}`)}
                className="hover:bg-[#e8f0ea]/40 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={emp.name} color={emp.avatarColor} />
                    <div>
                      <div className="font-semibold text-gray-900 text-[13px] group-hover:text-[#2d5a3d] transition-colors">{emp.name}</div>
                      <div className="text-[11px] text-gray-400">{emp.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 font-medium text-gray-700">{emp.goals.length}</td>
                <td className="px-3 py-3.5"><StatusBadge status={emp.sheetStatus} /></td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-24">
                      <div className="h-full bg-[#4a8560] rounded-full" style={{ width: `${emp.weightedScore}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-8">{emp.weightedScore}%</span>
                  </div>
                </td>
                <td className="px-3 py-3.5"><CheckInBadge status={CHECKIN_STATUS[i] ?? "Not due"} /></td>
                <td className="px-3 py-3.5 text-gray-300 group-hover:text-[#4a8560]">
                  <ChevronRight className="w-4 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
