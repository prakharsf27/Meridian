import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, CornerUpLeft, Share2, ArrowLeft } from "lucide-react";
import { SEED_EMPLOYEES } from "@/lib/seedData";
import { computeUomScore, UOM_SHORT } from "@/lib/uom";
import { useApp } from "@/context/AppContext";

function UomBadge({ type }: { type: string }) {
  return (
    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded">
      {UOM_SHORT[type as keyof typeof UOM_SHORT] ?? type.toUpperCase()}
    </span>
  );
}

// Pending-only list shown when no empId param
function PendingList() {
  const navigate = useNavigate();
  const pending = SEED_EMPLOYEES.filter(e => e.sheetStatus === "submitted");
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-500 text-sm mt-0.5">{pending.length} goal sheet{pending.length !== 1 ? "s" : ""} awaiting your review</p>
      </div>
      {pending.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center text-gray-400 text-sm">
          All goal sheets have been reviewed. Nothing pending. 🎉
        </div>
      )}
      <div className="space-y-3">
        {pending.map(emp => {
          const scores = emp.goals.map(g => computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }));
          const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          return (
            <div
              key={emp.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/manager/approvals/${emp.id}`)}
              onKeyDown={e => e.key === "Enter" && navigate(`/manager/approvals/${emp.id}`)}
              className="bg-white rounded-xl border border-gray-200 hover:border-[#2d5a3d] hover:bg-[#e8f0ea]/20 transition-all p-5 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${emp.avatarColor} text-white font-bold flex items-center justify-center text-sm flex-shrink-0`}>
                  {emp.initials}
                </div>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-[#2d5a3d] transition-colors">{emp.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{emp.role} · {emp.employeeCode} · Submitted 2 Jun 2026</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Goals</div>
                  <div className="font-bold text-gray-800">{emp.goals.length}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Avg Score</div>
                  <div className="font-bold text-[#2d5a3d]">{avg}%</div>
                </div>
                <span className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                  Review →
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* All employees (non-pending) */}
      <div>
        <h2 className="font-bold text-gray-700 text-sm mb-3">All team members</h2>
        <div className="space-y-2">
          {SEED_EMPLOYEES.filter(e => e.sheetStatus !== "submitted").map(emp => (
            <div
              key={emp.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/manager/approvals/${emp.id}`)}
              onKeyDown={e => e.key === "Enter" && navigate(`/manager/approvals/${emp.id}`)}
              className="bg-white rounded-xl border border-gray-100 hover:border-[#2d5a3d]/30 transition-all px-5 py-3.5 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${emp.avatarColor} text-white font-bold flex items-center justify-center text-xs flex-shrink-0`}>
                  {emp.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-[13px] group-hover:text-[#2d5a3d]">{emp.name}</div>
                  <div className="text-[11px] text-gray-400">{emp.role}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${
                emp.sheetStatus === "approved" ? "bg-[#e8f0ea] text-[#2d5a3d] border-[#2d5a3d]/30" : "bg-gray-100 text-gray-500 border-gray-200"
              }`}>{emp.sheetStatus === "approved" ? "Approved" : "Draft"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Per-employee review page
function EmployeeReview({ empId }: { empId: string }) {
  const { addNotification } = useApp();
  const emp = SEED_EMPLOYEES.find(e => e.id === empId);

  if (!emp) return (
    <div className="max-w-5xl mx-auto p-10 text-center">
      <p className="text-gray-500">Employee not found.</p>
      <Link to="/manager/approvals"><Button variant="outline" className="mt-4">← Back to approvals</Button></Link>
    </div>
  );

  const [approved, setApproved] = useState(emp.sheetStatus === "approved");
  const [comment, setComment] = useState("Looking good overall. Let's discuss targets next 1:1.");
  const [goalActions, setGoalActions] = useState<Record<string, "approved" | "pending">>(
    Object.fromEntries(emp.goals.map(g => [g.id, emp.sheetStatus === "approved" ? "approved" : "pending"]))
  );

  const handleApproveAll = () => {
    setGoalActions(Object.fromEntries(emp.goals.map(g => [g.id, "approved"])));
    setApproved(true);
    addNotification({ type: "success", title: "Goal Sheet Approved", message: `You approved ${emp.name}'s goal sheet for FY 2025-26.` });
  };

  const toggleGoal = (id: string) => {
    if (approved) return;
    setGoalActions(prev => ({ ...prev, [id]: prev[id] === "approved" ? "pending" : "approved" }));
  };

  const totalWeightage = emp.goals.reduce((s, g) => s + g.weightage, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <Link to="/manager/approvals" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Goal Sheet Review</h1>
      </div>

      {approved && (
        <div className="bg-[#e8f0ea] border border-[#2d5a3d]/30 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-[#2d5a3d]" />
          <span className="text-[#2d5a3d] font-semibold">Goal sheet approved. Employee has been notified.</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Employee header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start bg-gray-50">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${emp.avatarColor} text-white font-bold flex items-center justify-center text-sm`}>
              {emp.initials}
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">{emp.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{emp.role} · {emp.employeeCode} · Submitted 2 Jun 2026</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/manager/approvals">
              <Button variant="outline" className="h-9 text-[13px]">
                <CornerUpLeft className="w-3.5 h-3.5 mr-1.5" /> Back
              </Button>
            </Link>
            <Button
              onClick={handleApproveAll}
              disabled={approved}
              className="bg-[#2d5a3d] hover:bg-[#4a8560] text-white h-9 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" /> Approve All
            </Button>
          </div>
        </div>

        {/* Summary bar */}
        <div className="bg-[#2d5a3d] text-white px-6 py-2.5 flex gap-8 text-[13px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4a8560]" />
            <span>Goals: <strong>{emp.goals.length} / 8</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4a8560]" />
            <span>Weightage: <strong className={totalWeightage === 100 ? "text-green-300" : "text-red-300"}>{totalWeightage}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4a8560]" />
            <span>Approved: <strong>{Object.values(goalActions).filter(v => v === "approved").length} / {emp.goals.length}</strong></span>
          </div>
        </div>

        {/* Goals table */}
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Goal</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">UOM</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Target</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="text-left px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Weightage</th>
              <th className="text-right px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {emp.goals.map(g => {
              const score = computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual });
              const isApproved = goalActions[g.id] === "approved";
              return (
                <tr key={g.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {g.isShared && <Share2 className="w-3.5 h-3.5 text-[#1e3a5f] flex-shrink-0" />}
                      <div>
                        <div className="font-semibold text-gray-900">{g.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{g.thrustArea}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4"><UomBadge type={g.uomType} /></td>
                  <td className="px-3 py-4">
                    <div className="border border-gray-200 rounded-md px-3 py-1.5 text-[13px] font-medium text-gray-800 bg-white inline-block min-w-[70px]">
                      {g.target.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${score < 50 ? "bg-amber-400" : "bg-[#4a8560]"}`} style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{score}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 font-medium text-gray-700">{g.weightage}%</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleGoal(g.id)}
                      disabled={approved}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-md border transition-colors disabled:opacity-60 ${
                        isApproved
                          ? "bg-[#e8f0ea] border-[#2d5a3d]/30 text-[#2d5a3d]"
                          : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                      }`}
                    >
                      {isApproved ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Approved</span> : "Pending"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Comment box */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Approval comment</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            disabled={approved}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20 focus:border-[#2d5a3d] disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

export function ManagerApprovals() {
  const { empId } = useParams<{ empId: string }>();
  return empId ? <EmployeeReview empId={empId} /> : <PendingList />;
}
