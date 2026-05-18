import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Lock, TrendingUp, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { SEED_EMPLOYEES } from "@/lib/seedData";
import { computeUomScore, computeWeightedScore, UOM_SHORT } from "@/lib/uom";

const employee = SEED_EMPLOYEES[0];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    on_track: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    lagging:   "bg-amber-100 text-amber-800 border-amber-200",
    not_started: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const labels: Record<string, string> = {
    on_track: "On Track", completed: "Completed", lagging: "Lagging", not_started: "Not Started",
  };
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function UomBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    min: "bg-[#eef3f9] text-[#1e3a5f] border-[#c7d9ef]",
    max: "bg-purple-50 text-purple-700 border-purple-200",
    timeline: "bg-amber-50 text-amber-700 border-amber-200",
    zero: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border tracking-wide ${colors[type] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {UOM_SHORT[type as keyof typeof UOM_SHORT] ?? type.toUpperCase()}
    </span>
  );
}

function ProgressBar({ value, color = "bg-[#4a8560]" }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-8 text-right">{value}%</span>
    </div>
  );
}

function MetricCard({ label, value, sub, subColor = "text-[#4a8560]", icon: Icon, warnBg }: any) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${warnBg ?? "border-gray-200"}`}>
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-gray-500">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="text-3xl font-bold text-gray-900 mt-2">{value}</div>
      <div className={`text-xs font-medium mt-1 ${subColor}`}>{sub}</div>
    </div>
  );
}

export function EmployeeDashboard() {
  const goalsWithScore = employee.goals.map(g => ({
    ...g,
    score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
  }));

  const weightedScore = computeWeightedScore(goalsWithScore.map(g => ({ score: g.score, weightage: g.weightage })));
  const approvedCount = employee.goals.filter(g => g.locked).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {employee.name.split(" ")[0]}.</h1>
          <p className="text-gray-500 text-sm mt-0.5">Q2 check-in window is open · Deadline: <span className="font-medium text-gray-700">15 Jul 2026</span></p>
        </div>
        <Link to="/employee/goals/create">
          <Button className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm font-semibold">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Goal Sheet
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total goals" value={employee.goals.length} sub="FY 2025–26" icon={TrendingUp} />
        <MetricCard
          label="Approved"
          value={approvedCount}
          sub={<span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Goals locked</span>}
          icon={CheckCircle2}
        />
        <MetricCard
          label="Overall progress"
          value={<>{weightedScore}<span className="text-lg text-gray-400">%</span></>}
          sub="+12% from Q1"
        />
        <MetricCard
          label="Check-in due"
          value="1"
          sub="Q2 due soon"
          subColor="text-[#b8860b]"
          warnBg="border-[#b8860b]/30 bg-[#fdf6e3]"
          icon={Clock}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Goal progress table */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Goal progress</h2>
            <Link to="/employee/checkin">
              <Button variant="outline" className="h-8 text-xs bg-gray-50">
                Update Q2 →
              </Button>
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Goal</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">UOM</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">WTG</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-40">Score</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {goalsWithScore.map(g => (
                <tr key={g.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {g.locked && <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                      {g.isShared && (
                        <span className="text-[9px] font-bold bg-[#eef3f9] text-[#1e3a5f] border border-[#c7d9ef] px-1 py-0.5 rounded">SHARED</span>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 text-[13px]">{g.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">Target: {g.target.toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><UomBadge type={g.uomType} /></td>
                  <td className="px-3 py-3 font-medium text-gray-700">{g.weightage}%</td>
                  <td className="px-3 py-3 w-40">
                    <ProgressBar value={g.score} color={g.score < 50 ? "bg-amber-400" : "bg-[#4a8560]"} />
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={g.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="col-span-1 space-y-4">
          {/* Weighted score */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Weighted Score</p>
            <div className="text-5xl font-bold text-[#2d5a3d] leading-none">
              {weightedScore}<span className="text-2xl text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 mb-5">Progress × weightages</p>
            <div className="space-y-3">
              {goalsWithScore.map(g => (
                <div key={g.id} className="flex items-center gap-2 text-xs">
                  <span className="w-14 truncate text-gray-600 font-medium text-[11px]">{g.title.split(" ")[0]}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${g.score < 50 ? "bg-amber-400" : "bg-[#4a8560]"}`}
                      style={{ width: `${g.score}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-semibold text-gray-700">{g.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manager note */}
          <div className="bg-[#fdf6e3] border border-[#b8860b]/30 border-l-4 border-l-[#b8860b] rounded-xl p-4">
            <p className="text-[10px] font-bold text-[#b8860b] uppercase tracking-widest mb-2">Manager Note</p>
            <p className="text-[13px] text-gray-800 italic leading-relaxed">
              "Good Q1. Focus on sales conversion for Q2 — close the gap to ₹10L."
            </p>
            <p className="text-[11px] text-gray-500 mt-2">— Priya Mehta · Q1 Review</p>
          </div>

          {/* Shared goal notice */}
          <div className="bg-[#eef3f9] border border-[#c7d9ef] rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-[#1e3a5f] mb-1">Shared Goal Active</p>
                <p className="text-[12px] text-[#1e3a5f]/80">
                  "Customer Satisfaction · NPS 70" is a shared org KPI. Target is read-only. Adjust weightage only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
