import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DEPT_PERFORMANCE, SEED_EMPLOYEES, THRUST_DISTRIBUTION } from "@/lib/seedData";
import { computeUomScore, computeWeightedScore } from "@/lib/uom";

const COLORS = ["#2d5a3d", "#4a8560", "#7eb89a", "#1e3a5f", "#3a6491", "#b8860b"];

const QUARTER_DATA = DEPT_PERFORMANCE.map(d => ({
  dept: d.dept,
  "Q1": d.q1,
  "Q2": d.q2,
}));

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold text-gray-900">{title}</h2>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

const handleExport = () => {
  const rows = [
    ["Employee", "Department", "Role", "Weighted Score", "Goals", "Sheet Status"],
    ...SEED_EMPLOYEES.map(emp => {
      const scores = emp.goals.map(g => ({
        score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
        weightage: g.weightage,
      }));
      const ws = computeWeightedScore(scores);
      return [emp.name, emp.department, emp.role, `${ws}%`, emp.goals.length, emp.sheetStatus];
    }),
  ];
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meridian_achievement_report.csv";
  a.click();
  URL.revokeObjectURL(url);
};

function HeatmapGrid() {
  const quarters = ["Q1", "Q2"];
  const getColor = (pct: number) => {
    if (pct >= 80) return "bg-[#2d5a3d] text-white";
    if (pct >= 60) return "bg-[#4a8560] text-white";
    if (pct >= 40) return "bg-[#7eb89a] text-white";
    return "bg-amber-200 text-amber-900";
  };

  const heatData = DEPT_PERFORMANCE.map(d => ({
    dept: d.dept,
    q1: d.q1,
    q2: d.q2,
    employees: d.employees,
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Employees</th>
            {quarters.map(q => (
              <th key={q} className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">{q} Score</th>
            ))}
            <th className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">QoQ Delta</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {heatData.map(row => {
            const delta = row.q2 - row.q1;
            return (
              <tr key={row.dept} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{row.dept}</td>
                <td className="px-4 py-3 text-center text-gray-600">{row.employees}</td>
                <td className="px-4 py-3">
                  <div className={`text-center rounded-md py-1.5 text-[12px] font-bold mx-auto max-w-[70px] ${getColor(row.q1)}`}>{row.q1}%</div>
                </td>
                <td className="px-4 py-3">
                  <div className={`text-center rounded-md py-1.5 text-[12px] font-bold mx-auto max-w-[70px] ${getColor(row.q2)}`}>{row.q2}%</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-[12px] font-bold ${delta > 0 ? "text-[#4a8560]" : "text-[#8b2e2e]"}`}>
                    {delta > 0 ? "+" : ""}{delta}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AdminReports() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">FY 2025–26 · All departments · Q2 Active</p>
        </div>
        <Button onClick={handleExport} className="bg-[#2d5a3d] hover:bg-[#4a8560] text-white">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* QoQ bar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <SectionTitle title="Quarter-on-Quarter Completion" sub="Q1 vs Q2 by department" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={QUARTER_DATA} barGap={4} barSize={28}>
            <XAxis dataKey="dept" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
              formatter={(val) => [typeof val === "number" ? `${val}%` : val]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Q1" fill="#7eb89a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Q2" fill="#2d5a3d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie + heatmap row */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <SectionTitle title="Goal Distribution by Thrust Area" sub="% of total goals" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={THRUST_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {THRUST_DISTRIBUTION.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }} formatter={(v) => [typeof v === "number" ? `${v}%` : v]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <SectionTitle title="Manager Effectiveness" sub="Check-in completion rate by L1" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              layout="vertical"
              data={[
                { name: "Priya Mehta", rate: 88 },
                { name: "Arjun Varma", rate: 72 },
                { name: "Leena Das", rate: 95 },
                { name: "Ravi Pillai", rate: 61 },
              ]}
              barSize={18}
            >
              <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }} formatter={(v) => [typeof v === "number" ? `${v}%` : v]} />
              <Bar dataKey="rate" fill="#4a8560" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Department Completion Heatmap</h2>
          <p className="text-xs text-gray-500 mt-0.5">Color-coded by achievement score</p>
        </div>
        <HeatmapGrid />
      </div>
    </div>
  );
}
