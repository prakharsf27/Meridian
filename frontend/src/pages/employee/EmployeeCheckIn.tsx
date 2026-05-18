import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, Lock, TrendingUp } from "lucide-react";
import { SEED_EMPLOYEES } from "@/lib/seedData";
import { computeUomScore } from "@/lib/uom";
import { useApp } from "@/context/AppContext";

const employee = SEED_EMPLOYEES[0];

const PAST_CHECKINS = [
  {
    quarter: "Q1",
    date: "14 Apr 2026",
    selfComment: "Good progress on sales and bug reduction. API cert is mid-way through.",
    managerComment: "Solid Q1 performance. Push harder on certifications next quarter.",
    status: "reviewed",
  },
];

export function EmployeeCheckIn() {
  const { addNotification } = useApp();
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const goalsWithScore = employee.goals.map(g => ({
    ...g,
    score: computeUomScore({ uomType: g.uomType, target: g.target, actual: g.actual }),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitted(true);
    addNotification({
      type: "success",
      title: "Q2 Check-in Submitted",
      message: "Your Q2 self-assessment has been submitted. Your manager will review shortly.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quarterly Check-in</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Q2 window is open · Deadline: <span className="font-semibold text-[#8b2e2e]">15 Jul 2026</span>
        </p>
      </div>

      {/* Status strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#fdf6e3] border border-[#b8860b]/30 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#b8860b]" />
          <div>
            <div className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider">Q2 Due</div>
            <div className="font-bold text-gray-900">15 Jul 2026</div>
          </div>
        </div>
        <div className="bg-[#e8f0ea] border border-[#2d5a3d]/20 rounded-xl p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#2d5a3d]" />
          <div>
            <div className="text-[11px] font-bold text-[#2d5a3d] uppercase tracking-wider">Q1</div>
            <div className="font-bold text-gray-900">Reviewed</div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Q3 / Q4</div>
            <div className="font-bold text-gray-500">Not started</div>
          </div>
        </div>
      </div>

      {/* Q2 self-assessment form */}
      {!submitted ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-amber-50 border-l-4 border-l-[#b8860b]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#b8860b]" />
              <span className="font-semibold text-[#b8860b] text-sm">Q2 Self-Assessment Due</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Rate your progress on each goal and add a self-comment before 15 Jul 2026.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Goal-level actuals */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Update Actuals for Q2</h3>
              <div className="space-y-3">
                {goalsWithScore.map(g => (
                  <div key={g.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {g.locked && <Lock className="w-3 h-3 text-gray-400" />}
                        <span className="font-semibold text-gray-900 text-[13px]">{g.title}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Target: {g.target.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Current</div>
                        <div className="font-bold text-gray-900 text-sm">{g.actual.toLocaleString()}</div>
                      </div>
                      <div className={`text-center px-2.5 py-1.5 rounded-md text-xs font-bold min-w-[52px] ${g.score >= 80 ? "bg-[#e8f0ea] text-[#2d5a3d]" : g.score >= 50 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                        {g.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-comment */}
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-2">
                Self-Assessment Comment *
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={5}
                placeholder="Summarise your Q2 progress. What went well? Where did you face challenges? What do you need from your manager?"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20 focus:border-[#2d5a3d] placeholder:text-gray-400"
              />
              <p className="text-[11px] text-gray-400 mt-1">{comment.length} characters</p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="text-gray-600 border-gray-200"
                onClick={() => setComment("")}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={!comment.trim()}
                className="bg-[#2d5a3d] hover:bg-[#4a8560] text-white disabled:opacity-40"
              >
                Submit Q2 Check-in
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-[#e8f0ea] border border-[#2d5a3d]/30 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-[#2d5a3d] mx-auto mb-3" />
          <h3 className="font-bold text-[#2d5a3d] text-lg">Q2 Check-in Submitted</h3>
          <p className="text-[#4a8560] text-sm mt-1">Your manager Priya Mehta will review and respond.</p>
        </div>
      )}

      {/* Past check-ins */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Previous Check-ins</h3>
        <div className="space-y-3">
          {PAST_CHECKINS.map(ci => (
            <div key={ci.quarter} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold bg-[#2d5a3d] text-white px-2 py-0.5 rounded">{ci.quarter}</span>
                  <span className="text-[12px] text-gray-500">{ci.date}</span>
                </div>
                <span className="text-[11px] font-semibold bg-[#e8f0ea] text-[#2d5a3d] border border-[#2d5a3d]/20 px-2 py-0.5 rounded capitalize">
                  {ci.status}
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your Comment</p>
                  <p className="text-[13px] text-gray-700 italic">"{ci.selfComment}"</p>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-bold text-[#1e3a5f] uppercase tracking-wider mb-1">Manager Response</p>
                  <p className="text-[13px] text-gray-700 italic">"{ci.managerComment}"</p>
                  <p className="text-[11px] text-gray-400 mt-1">— Priya Mehta</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
