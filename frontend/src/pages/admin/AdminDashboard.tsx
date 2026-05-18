import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Unlock } from "lucide-react";
import { DEPT_PERFORMANCE, SEED_EMPLOYEES } from "@/lib/seedData";
import { computeUomScore, computeWeightedScore } from "@/lib/uom";

function MetricCard({ label, value, sub, subColor = "text-[#4a8560]", warn }: any) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${warn ? "border-amber-200 bg-amber-50" : "border-gray-200"}`}>
      <div className="text-[13px] font-medium text-gray-500 mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className={`text-xs font-medium mt-1 ${warn ? "text-amber-700" : subColor}`}>{sub}</div>
    </div>
  );
}

const UNLOCK_REQUESTS = [
  { employee: "Vikram Kapoor", dept: "Engineering", goal: "Sales target", daysAgo: 2 },
  { employee: "Meena Roy", dept: "Marketing", goal: "Campaign reach", daysAgo: 1 },
  { employee: "Suresh Kumar", dept: "Operations", goal: "Cost reduction", daysAgo: 3 },
];

export function AdminDashboard() {
  const allScores = SEED_EMPLOYEES.flatMap(emp =>
    emp.goals.map(g => ({
      score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
      weightage: g.weightage,
    }))
  );
  const overallAvg = Math.round(
    SEED_EMPLOYEES.map(emp => {
      const scores = emp.goals.map(g => ({
        score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
        weightage: g.weightage,
      }));
      return computeWeightedScore(scores);
    }).reduce((a, b) => a + b, 0) / SEED_EMPLOYEES.length
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organisation Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">FY 2025–26 · All departments · Q2 Active</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total employees" value="142" sub="4 departments" />
        <MetricCard label="Goals approved" value="534" sub="94.3% rate" />
        <MetricCard label="Avg completion" value={<>{overallAvg}<span className="text-lg text-gray-400">%</span></>} sub="+6% vs Q1" />
        <MetricCard label="Unlock requests" value={UNLOCK_REQUESTS.length} sub="Pending action" warn />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Department performance */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Department performance</h2>
            <Link to="/admin/reports">
              <Button variant="outline" className="h-8 text-xs bg-gray-50">
                Full report <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="px-5 py-5 space-y-5">
            {DEPT_PERFORMANCE.map(dept => (
              <div key={dept.dept} className="flex items-center gap-3 text-sm">
                <div className="w-24 text-gray-600 font-medium flex-shrink-0">{dept.dept}</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4a8560] rounded-full transition-all" style={{ width: `${dept.q2}%` }} />
                </div>
                <div className="w-10 text-right font-bold text-gray-800 text-[13px]">{dept.q2}%</div>
                <div className={`text-[11px] font-medium w-12 ${dept.q2 > dept.q1 ? "text-[#4a8560]" : "text-[#8b2e2e]"}`}>
                  {dept.q2 > dept.q1 ? "+" : ""}{dept.q2 - dept.q1}% Q1
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlock requests */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Unlock requests</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {UNLOCK_REQUESTS.map((r, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-[13px]">{r.employee}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{r.dept} · {r.daysAgo}d ago</div>
                  <div className="text-[12px] text-gray-600 mt-1">Goal: <span className="font-medium">{r.goal}</span></div>
                </div>
                <Button className="h-8 text-xs bg-[#2d5a3d] hover:bg-[#4a8560] text-white">
                  <Unlock className="w-3 h-3 mr-1.5" /> Unlock
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/admin/reports" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#2d5a3d] hover:bg-[#e8f0ea]/30 transition-all group">
          <div className="font-bold text-gray-900 mb-1">Analytics & Reports</div>
          <div className="text-xs text-gray-500">QoQ trends, department heatmaps, export CSV</div>
          <div className="text-[#2d5a3d] text-xs font-semibold mt-3 group-hover:underline">Open reports →</div>
        </Link>
        <Link to="/admin/audit" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#2d5a3d] hover:bg-[#e8f0ea]/30 transition-all group">
          <div className="font-bold text-gray-900 mb-1">Audit Trail</div>
          <div className="text-xs text-gray-500">Forensic log of all changes, approvals, unlocks</div>
          <div className="text-[#2d5a3d] text-xs font-semibold mt-3 group-hover:underline">View audit logs →</div>
        </Link>
        <Link to="/admin/escalations" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-300 hover:bg-amber-50 transition-all group">
          <div className="font-bold text-gray-900 mb-1">Escalations <span className="ml-1 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">4 active</span></div>
          <div className="text-xs text-gray-500">Rule-based alerts for overdue actions</div>
          <div className="text-amber-700 text-xs font-semibold mt-3 group-hover:underline">View escalations →</div>
        </Link>
      </div>
    </div>
  );
}
