import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, CornerUpLeft, Lock, Share2 } from "lucide-react";
import { SEED_EMPLOYEES } from "@/lib/seedData";
import { computeUomScore, UOM_SHORT } from "@/lib/uom";
import { useApp } from "@/context/AppContext";

const emp = SEED_EMPLOYEES[1]; // Ananya Nair — submitted

export function ManagerApprovals() {
  const { addNotification } = useApp();
  const [approved, setApproved] = useState(false);
  const [comment, setComment] = useState("API response target adjusted from 150ms → 200ms to be realistic. All other goals look good.");
  const [goalActions, setGoalActions] = useState<Record<string, "approved" | "pending">>(
    Object.fromEntries(emp.goals.map((g, i) => [g.id, i === 0 ? "approved" : "pending"]))
  );

  const allApproved = Object.values(goalActions).every(v => v === "approved");

  const handleApproveAll = () => {
    setGoalActions(Object.fromEntries(emp.goals.map(g => [g.id, "approved"])));
    setApproved(true);
    addNotification({ type: "success", title: "Goal Sheet Approved", message: `You approved ${emp.name}'s goal sheet for FY 2025-26.` });
  };

  const toggleGoal = (id: string) => {
    setGoalActions(prev => ({ ...prev, [id]: prev[id] === "approved" ? "pending" : "approved" }));
  };

  const totalWeightage = emp.goals.reduce((s, g) => s + g.weightage, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Goal Approvals</h1>
        <p className="text-gray-500 text-sm">Review, edit, and approve submitted goal sheets</p>
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
            <Link to="/manager/dashboard">
              <Button variant="outline" className="text-[#8b2e2e] border-[#8b2e2e]/40 hover:bg-[#fdf0f0] h-9">
                <CornerUpLeft className="w-3.5 h-3.5 mr-1.5" /> Return
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
                      {g.isShared && <Share2 className="w-3.5 h-3.5 text-[#1e3a5f]" />}
                      <div>
                        <div className="font-semibold text-gray-900">{g.title}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{g.thrustArea}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded">
                      {UOM_SHORT[g.uomType]}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="border border-gray-200 rounded-md px-3 py-1.5 text-[13px] font-medium text-gray-800 bg-white inline-block min-w-[80px]">
                      {g.target}
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
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="border border-gray-200 rounded-md px-3 py-1.5 text-[13px] font-medium text-gray-800 w-14 text-center">
                        {g.weightage}
                      </div>
                      <span className="text-gray-400 text-sm">%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleGoal(g.id)}
                      disabled={approved}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-md border transition-colors disabled:opacity-50 ${
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

        {/* Approval comment */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Approval comments</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            disabled={approved}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20 focus:border-[#2d5a3d] disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
