import { useState } from "react";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEED_EMPLOYEES } from "@/lib/seedData";
import { computeUomScore, computeWeightedScore } from "@/lib/uom";
import { useApp } from "@/context/AppContext";

const PAST_CHECKINS = [
  { empId: "emp1", quarter: "Q1", date: "12 Apr 2026", selfComment: "Closed 3 new accounts. API response time still above target.", managerComment: "" },
  { empId: "emp4", quarter: "Q1", date: "10 Apr 2026", selfComment: "All test cases passed. Zero P0 bugs shipped in Q1.", managerComment: "Excellent quarter. Maintain this standard." },
];

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export function ManagerReviews() {
  const { addNotification } = useApp();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [responded, setResponded] = useState<Record<string, boolean>>({});

  const handleRespond = (empId: string, quarter: string) => {
    const key = `${empId}-${quarter}`;
    if (!comments[key]?.trim()) return;
    setResponded(prev => ({ ...prev, [key]: true }));
    const emp = SEED_EMPLOYEES.find(e => e.id === empId);
    addNotification({ type: "success", title: "Check-in Reviewed", message: `Your response to ${emp?.name}'s ${quarter} check-in has been saved.` });
  };

  const pendingReviews = PAST_CHECKINS.filter(ci => !ci.managerComment);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Check-in Reviews</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Review quarterly self-assessments from your team · {pendingReviews.length} pending response{pendingReviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Team performance summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Q2 Progress Snapshot</h2>
          <p className="text-xs text-gray-500 mt-0.5">Weighted achievement across your team</p>
        </div>
        <div className="divide-y divide-gray-50">
          {SEED_EMPLOYEES.map(emp => {
            const scores = emp.goals.map(g => ({
              score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
              weightage: g.weightage,
            }));
            const ws = computeWeightedScore(scores);
            return (
              <div key={emp.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full ${emp.avatarColor} text-white font-bold flex items-center justify-center text-xs flex-shrink-0`}>
                  {emp.initials}
                </div>
                <div className="w-32 flex-shrink-0">
                  <div className="font-semibold text-gray-900 text-[13px]">{emp.name}</div>
                  <div className="text-[11px] text-gray-400">{emp.role}</div>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4a8560] rounded-full" style={{ width: `${ws}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-700 w-10 text-right">{ws}%</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${ws >= 80 ? "bg-[#e8f0ea] text-[#2d5a3d] border-[#2d5a3d]/30" : ws >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                  {ws >= 80 ? "On Track" : ws >= 60 ? "At Risk" : "Lagging"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-in review cards */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3">Submitted Check-ins</h2>
        <div className="space-y-4">
          {PAST_CHECKINS.map(ci => {
            const emp = SEED_EMPLOYEES.find(e => e.id === ci.empId);
            if (!emp) return null;
            const key = `${ci.empId}-${ci.quarter}`;
            const isResponded = responded[key] || !!ci.managerComment;

            return (
              <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className={`px-5 py-3.5 border-b border-gray-100 flex items-center justify-between ${isResponded ? "bg-[#e8f0ea]/30" : "bg-amber-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${emp.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                      {emp.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-[13px]">{emp.name}</div>
                      <div className="text-[11px] text-gray-400">{ci.date}</div>
                    </div>
                    <span className="text-[11px] font-bold bg-[#2d5a3d] text-white px-2 py-0.5 rounded ml-2">{ci.quarter}</span>
                  </div>
                  {isResponded
                    ? <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2d5a3d]"><CheckCircle2 className="w-4 h-4" /> Reviewed</span>
                    : <span className="text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">Awaiting response</span>
                  }
                </div>
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Employee's self-assessment</p>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-[13px] text-gray-700 italic">
                      "{ci.selfComment}"
                    </div>
                  </div>
                  {!isResponded ? (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Your response</p>
                      <textarea
                        value={comments[key] ?? ""}
                        onChange={e => setComments(prev => ({ ...prev, [key]: e.target.value }))}
                        rows={3}
                        placeholder={`Add your feedback for ${emp.name}'s ${ci.quarter} performance...`}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20 focus:border-[#2d5a3d] placeholder:text-gray-400"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={() => handleRespond(ci.empId, ci.quarter)}
                          disabled={!comments[key]?.trim()}
                          className="bg-[#2d5a3d] hover:bg-[#4a8560] text-white h-9 disabled:opacity-40"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Submit Response
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] font-bold text-[#2d5a3d] uppercase tracking-wider mb-1.5">Your response</p>
                      <div className="bg-[#e8f0ea]/50 rounded-lg px-4 py-3 text-[13px] text-gray-700 italic">
                        "{comments[key] || ci.managerComment}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quarter timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Check-in Calendar</h2>
        <div className="grid grid-cols-4 gap-3">
          {QUARTERS.map((q, i) => {
            const statuses = ["complete", "pending", "upcoming", "upcoming"];
            const s = statuses[i];
            return (
              <div key={q} className={`rounded-xl p-4 border text-center ${
                s === "complete" ? "bg-[#e8f0ea] border-[#2d5a3d]/30" :
                s === "pending" ? "bg-amber-50 border-amber-200" :
                "bg-gray-50 border-gray-200"
              }`}>
                <div className={`font-bold text-lg ${s === "complete" ? "text-[#2d5a3d]" : s === "pending" ? "text-amber-800" : "text-gray-400"}`}>{q}</div>
                <div className={`text-[11px] font-semibold mt-1 ${s === "complete" ? "text-[#4a8560]" : s === "pending" ? "text-amber-700" : "text-gray-400"}`}>
                  {s === "complete" ? "Reviewed" : s === "pending" ? "In Progress" : "Upcoming"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
