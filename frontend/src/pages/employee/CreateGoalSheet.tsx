import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, AlertCircle, Info, Lock, Share2 } from "lucide-react";
import { validateGoalSheet, UOM_LABELS } from "@/lib/uom";
import { useApp } from "@/context/AppContext";

interface GoalRow {
  id: number;
  title: string;
  thrustArea: string;
  description: string;
  target: string;
  weightage: number;
  uomType: "min" | "max" | "timeline" | "zero";
  isShared: boolean;
}

const THRUST_AREAS = [
  "Revenue Growth", "Quality", "Customer", "Learning & Development",
  "Delivery", "People & Culture", "Process Improvement", "Innovation",
];

const UOM_TYPES = Object.entries(UOM_LABELS).map(([value, label]) => ({ value, label }));

const emptyGoal = (): GoalRow => ({
  id: Date.now() + Math.random(),
  title: "",
  thrustArea: "Quality",
  description: "",
  target: "",
  weightage: 0,
  uomType: "min",
  isShared: false,
});

export function CreateGoalSheet() {
  const { addGoals, addNotification } = useApp();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<GoalRow[]>([emptyGoal()]);

  const total = goals.reduce((s, g) => s + Number(g.weightage || 0), 0);
  const errors = validateGoalSheet(goals.map((g, i) => ({ title: g.title, weightage: g.weightage, index: i })));
  const canSubmit = errors.length === 0 && goals.every(g => g.title.trim() && g.target.trim());

  const addGoal = () => {
    if (goals.length >= 8) return;
    setGoals(prev => [...prev, emptyGoal()]);
  };

  const updateGoal = (id: number, field: keyof GoalRow, value: any) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const removeGoal = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Push goals into shared context so /employee/goals shows them
    addGoals(goals.map(g => ({
      id: g.id.toString(),
      title: g.title,
      thrustArea: g.thrustArea,
      target: g.target,
      weightage: g.weightage,
      uomType: g.uomType,
      isShared: false,
    })));
    addNotification({
      type: "success",
      title: "Goal Sheet Submitted",
      message: "Your goal sheet has been submitted for manager review.",
    });
    navigate("/employee/goals");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/employee/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create Goal Sheet</h1>
          <p className="text-gray-500 text-sm">FY 2025–26 · Draft · {goals.length}/8 goals</p>
        </div>
      </div>

      {/* Sticky validation bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm sticky top-2 z-10">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">Goals</span>
            <span className="font-bold text-gray-900">{goals.length} <span className="text-gray-400 font-normal">/ 8</span></span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">Total Weightage</span>
            <span className={`font-bold flex items-center gap-1.5 ${total === 100 ? "text-[#2d5a3d]" : total > 100 ? "text-[#8b2e2e]" : "text-gray-900"}`}>
              {total}%
              {total === 100 && <CheckCircle2 className="w-4 h-4" />}
              {total > 100 && <AlertCircle className="w-4 h-4" />}
            </span>
          </div>
        </div>
        <Button
          type="submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="bg-[#2d5a3d] hover:bg-[#4a8560] text-white disabled:opacity-40"
        >
          Submit Goal Sheet
        </Button>
      </div>

      {/* Validation errors */}
      {submitted === false && errors.length > 0 && goals.some(g => g.title || g.weightage) && (
        <div className="bg-[#fdf0f0] border border-[#8b2e2e]/30 rounded-xl p-4 space-y-1.5">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[#8b2e2e]">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Shared goals notice */}
      <div className="bg-[#eef3f9] border border-[#c7d9ef] rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1e3a5f] mt-0.5 flex-shrink-0" />
        <div className="text-[13px] text-[#1e3a5f]">
          <strong>Shared org KPI:</strong> "Improve NPS &gt; 70" has been pushed by Admin. It appears as a locked goal. You can only adjust its weightage.
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Shared / locked goal */}
        <div className="bg-white border-2 border-[#2d5a3d]/30 rounded-xl overflow-hidden opacity-80">
          <div className="bg-[#e8f0ea] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#2d5a3d]" />
              <span className="text-[12px] font-bold text-[#2d5a3d] uppercase tracking-wider">Shared Goal (Read-only)</span>
              <Share2 className="w-3.5 h-3.5 text-[#2d5a3d]" />
            </div>
          </div>
          <div className="px-5 py-4 grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Goal Title</Label>
              <Input value="Customer Satisfaction — Improve NPS > 70" disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="col-span-3">
              <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Target (Read-only)</Label>
              <Input value="NPS 70" disabled className="bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Weightage %</Label>
              <Input type="number" defaultValue={10} min={10} max={100} />
            </div>
          </div>
        </div>

        {/* Editable goals */}
        {goals.map((goal, index) => (
          <div key={goal.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Goal {index + 1}</span>
              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoal(goal.id)}
                  className="text-gray-300 hover:text-[#8b2e2e] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Goal Title *</Label>
                  <Input
                    placeholder="e.g. Increase Sales Revenue to ₹10L"
                    value={goal.title}
                    onChange={e => updateGoal(goal.id, "title", e.target.value)}
                    className={!goal.title && goals.length > 0 ? "" : ""}
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Thrust Area</Label>
                  <select
                    value={goal.thrustArea}
                    onChange={e => updateGoal(goal.id, "thrustArea", e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md text-[13px] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20 focus:border-[#2d5a3d]"
                  >
                    {THRUST_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">UoM Type</Label>
                  <select
                    value={goal.uomType}
                    onChange={e => updateGoal(goal.id, "uomType", e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md text-[13px] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/20 focus:border-[#2d5a3d]"
                  >
                    {UOM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Target *</Label>
                  <Input
                    placeholder="e.g. ₹10L, 20%, 5 certifications"
                    value={goal.target}
                    onChange={e => updateGoal(goal.id, "target", e.target.value)}
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Weightage % <span className="text-gray-400 normal-case font-normal">(min 10%)</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="20"
                    value={goal.weightage || ""}
                    onChange={e => updateGoal(goal.id, "weightage", parseInt(e.target.value) || 0)}
                    className={goal.weightage > 0 && goal.weightage < 10 ? "border-[#8b2e2e] focus:border-[#8b2e2e]" : ""}
                  />
                  {goal.weightage > 0 && goal.weightage < 10 && (
                    <p className="text-[11px] text-[#8b2e2e] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Minimum weightage is 10%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add goal */}
        {goals.length < 8 ? (
          <button
            type="button"
            onClick={addGoal}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 text-sm text-gray-400 hover:border-[#2d5a3d] hover:text-[#2d5a3d] hover:bg-[#e8f0ea]/30 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Another Goal
          </button>
        ) : (
          <div className="text-center py-4 text-sm text-[#8b2e2e] bg-[#fdf0f0] rounded-xl border border-[#8b2e2e]/20 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            You've reached the 8-goal limit. Remove a goal to add a new one.
          </div>
        )}
      </form>
    </div>
  );
}
