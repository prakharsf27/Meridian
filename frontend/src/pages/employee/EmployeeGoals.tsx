import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Lock, Share2 } from "lucide-react";
import { computeUomScore, computeWeightedScore, UOM_SHORT, UOM_LABELS } from "@/lib/uom";
import { useApp } from "@/context/AppContext";



function UomBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    min:      "bg-[#eef3f9] text-[#1e3a5f] border-[#c7d9ef]",
    max:      "bg-purple-50 text-purple-700 border-purple-200",
    timeline: "bg-amber-50 text-amber-700 border-amber-200",
    zero:     "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border tracking-wide ${colors[type] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
      {UOM_SHORT[type as keyof typeof UOM_SHORT] ?? type.toUpperCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    on_track:    "bg-green-100 text-green-800 border-green-200",
    completed:   "bg-blue-100 text-blue-800 border-blue-200",
    lagging:     "bg-amber-100 text-amber-800 border-amber-200",
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

export function EmployeeGoals() {
  const { myGoals, sheetStatus } = useApp();

  const goalsWithScore = myGoals.map(g => ({
    ...g,
    score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
  }));

  const weightedScore = computeWeightedScore(
    goalsWithScore.map(g => ({ score: g.score, weightage: g.weightage }))
  );

  const totalWeight = myGoals.reduce((s, g) => s + g.weightage, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
          <p className="text-gray-500 text-sm mt-0.5">FY 2025–26 · Sheet status: <span className="text-[#2d5a3d] font-semibold capitalize">{sheetStatus}</span></p>
        </div>
        <Link to="/employee/goals/create">
          <Button className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm font-semibold">
            <Plus className="w-4 h-4 mr-1.5" />
            New Goal Sheet
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {myGoals.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <div className="text-gray-400 text-sm mb-4">No goals yet for this cycle.</div>
          <Link to="/employee/goals/create">
            <Button className="bg-[#2d5a3d] hover:bg-[#4a8560] text-white">
              <Plus className="w-4 h-4 mr-1.5" /> Create Goal Sheet
            </Button>
          </Link>
        </div>
      )}

      {/* Sheet header bar */}
      {myGoals.length > 0 && (
      <div className="bg-[#2d5a3d] text-white rounded-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-green-300 font-bold mb-0.5">Goals</div>
            <div className="font-bold text-lg">{myGoals.length} <span className="text-green-300 font-normal text-sm">/ 8</span></div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-green-300 font-bold mb-0.5">Total Weightage</div>
            <div className={`font-bold text-lg ${totalWeight === 100 ? "text-green-300" : "text-red-300"}`}>{totalWeight}%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-green-300 font-bold mb-0.5">Weighted Score</div>
            <div className="font-bold text-lg">{weightedScore}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-sm font-semibold capitalize">{sheetStatus}</span>
        </div>
      </div>
      )}

      {/* Goals table */}
      {myGoals.length > 0 && <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">#</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Goal</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Thrust Area</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">UOM</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Target</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actual</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">WTG</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-32">Score</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {goalsWithScore.map((g, i) => (
              <tr key={g.id} className={`hover:bg-gray-50/50 transition-colors ${g.locked ? "opacity-90" : ""}`}>
                <td className="px-5 py-4 text-gray-400 font-mono text-xs">{i + 1}</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-1.5">
                    {g.locked && <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                    {g.isShared && (
                      <Share2 className="w-3 h-3 text-[#1e3a5f] flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-[13px]">{g.title}</div>
                      {g.isShared && (
                        <span className="text-[9px] font-bold bg-[#eef3f9] text-[#1e3a5f] border border-[#c7d9ef] px-1 py-0.5 rounded">SHARED</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-[12px] text-gray-500">{g.thrustArea}</td>
                <td className="px-3 py-4">
                  <div className="group relative inline-block">
                    <UomBadge type={g.uomType} />
                    <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {UOM_LABELS[g.uomType as keyof typeof UOM_LABELS]}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 font-medium text-gray-700 text-[13px]">{g.target.toLocaleString()}</td>
                <td className="px-3 py-4 font-medium text-gray-700 text-[13px]">{g.actual.toLocaleString()}</td>
                <td className="px-3 py-4 font-medium text-gray-700">{g.weightage}%</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-16">
                      <div
                        className={`h-full rounded-full ${g.score < 50 ? "bg-amber-400" : "bg-[#4a8560]"}`}
                        style={{ width: `${g.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-7">{g.score}%</span>
                  </div>
                </td>
                <td className="px-3 py-4"><StatusBadge status={g.status} /></td>
              </tr>
            ))}
          </tbody>
          {/* Footer with totals */}
          <tfoot className="border-t-2 border-gray-200 bg-gray-50">
            <tr>
              <td colSpan={6} className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Totals</td>
              <td className="px-3 py-3 font-bold text-gray-900">{totalWeight}%</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden w-16">
                    <div className="h-full bg-[#2d5a3d] rounded-full" style={{ width: `${weightedScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#2d5a3d] w-7">{weightedScore}%</span>
                </div>
              </td>
              <td className="px-3 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>}

      {/* UoM legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">UoM Formula Legend</p>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(UOM_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-start gap-2">
              <UomBadge type={key} />
              <span className="text-[11px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
