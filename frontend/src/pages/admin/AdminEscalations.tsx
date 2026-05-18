import { SEED_ESCALATIONS } from "@/lib/seedData";

const SEVERITY_STYLES = {
  high:   { bg: "bg-[#fdf0f0]", border: "border-[#8b2e2e]/30", text: "text-[#8b2e2e]", badge: "bg-[#8b2e2e] text-white", dot: "bg-[#8b2e2e]" },
  medium: { bg: "bg-[#fdf6e3]", border: "border-[#b8860b]/30", text: "text-[#b8860b]", badge: "bg-[#b8860b] text-white", dot: "bg-[#b8860b]" },
  low:    { bg: "bg-gray-50",   border: "border-gray-200",      text: "text-gray-600",  badge: "bg-gray-400 text-white",   dot: "bg-gray-400" },
};

const RULE_LABELS: Record<string, string> = {
  "Manager approval overdue":   "Rule #2: Manager hasn't approved 3+ days after submission.",
  "Q2 check-in not submitted":  "Rule #3: Check-in window open, no check-in logged.",
  "Goal sheet not submitted":   "Rule #1: Employee hasn't submitted 5+ days into cycle.",
};

function timeString(date: Date) {
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function AdminEscalations() {
  const highCount = SEED_ESCALATIONS.filter(e => e.severity === "high").length;
  const medCount = SEED_ESCALATIONS.filter(e => e.severity === "medium").length;

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Escalation Log</h1>
        <p className="text-gray-500 text-sm mt-0.5">Rule-based automation · Updated daily at midnight · {SEED_ESCALATIONS.length} active escalations</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#fdf0f0] border border-[#8b2e2e]/30 rounded-xl p-4">
          <div className="text-[12px] font-bold text-[#8b2e2e] uppercase tracking-wider mb-1">High Priority</div>
          <div className="text-3xl font-bold text-[#8b2e2e]">{highCount}</div>
          <div className="text-[11px] text-[#8b2e2e] mt-1">Requires immediate action</div>
        </div>
        <div className="bg-[#fdf6e3] border border-[#b8860b]/30 rounded-xl p-4">
          <div className="text-[12px] font-bold text-[#b8860b] uppercase tracking-wider mb-1">Medium Priority</div>
          <div className="text-3xl font-bold text-[#b8860b]">{medCount}</div>
          <div className="text-[11px] text-[#b8860b] mt-1">Action needed this week</div>
        </div>
        <div className="bg-[#e8f0ea] border border-[#2d5a3d]/30 rounded-xl p-4">
          <div className="text-[12px] font-bold text-[#2d5a3d] uppercase tracking-wider mb-1">Rules Active</div>
          <div className="text-3xl font-bold text-[#2d5a3d]">3</div>
          <div className="text-[11px] text-[#2d5a3d] mt-1">Running daily via cron</div>
        </div>
      </div>

      {/* Rules legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Active Rules</div>
        <div className="space-y-2">
          {[
            { rule: "Rule #1", label: "Goal sheet not submitted", detail: "Employee hasn't submitted 5+ days into cycle → send reminder" },
            { rule: "Rule #2", label: "Manager approval overdue", detail: "Manager hasn't approved 3+ days after submission → escalate to HR" },
            { rule: "Rule #3", label: "Check-in not logged", detail: "Check-in window open, no entry logged → remind employee + manager" },
          ].map(r => (
            <div key={r.rule} className="flex items-start gap-3 text-[13px]">
              <span className="font-bold text-[#2d5a3d] bg-[#e8f0ea] border border-[#2d5a3d]/20 px-2 py-0.5 rounded text-[11px] flex-shrink-0">{r.rule}</span>
              <div>
                <span className="font-semibold text-gray-900">{r.label}</span>
                <span className="text-gray-500 ml-2">— {r.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
          In production, these trigger actual email notifications and Teams adaptive cards. Escalation state is persisted to the AuditLog collection.
        </div>
      </div>

      {/* Escalation list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">{SEED_ESCALATIONS.length} active escalations</span>
        </div>
        <div className="divide-y divide-gray-50">
          {SEED_ESCALATIONS.map(esc => {
            const s = SEVERITY_STYLES[esc.severity as keyof typeof SEVERITY_STYLES];
            return (
              <div key={esc.id} className={`px-5 py-4 ${s.bg} border-l-4 ${s.border}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${s.badge}`}>
                          {esc.severity}
                        </span>
                        <span className="font-bold text-gray-900 text-[13px]">{esc.employee}</span>
                        <span className="text-[11px] text-gray-400 font-mono">{esc.employeeCode}</span>
                      </div>
                      <div className={`text-[12px] font-semibold ${s.text}`}>{esc.rule}</div>
                      <div className="text-[12px] text-gray-600 mt-0.5">{esc.detail}</div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {RULE_LABELS[esc.rule]} · Triggered {timeString(esc.triggeredAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
