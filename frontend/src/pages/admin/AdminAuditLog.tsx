import { SEED_AUDIT_LOGS } from "@/lib/seedData";

const ACTION_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  APPROVED:  { bg: "bg-[#e8f0ea]", text: "text-[#2d5a3d]", dot: "bg-[#2d5a3d]" },
  SUBMITTED: { bg: "bg-[#eef3f9]", text: "text-[#1e3a5f]", dot: "bg-[#1e3a5f]" },
  EDITED:    { bg: "bg-gray-100",  text: "text-gray-700",   dot: "bg-gray-500" },
  UPDATED:   { bg: "bg-gray-100",  text: "text-gray-700",   dot: "bg-gray-500" },
  UNLOCKED:  { bg: "bg-[#fdf6e3]", text: "text-[#b8860b]",  dot: "bg-[#b8860b]" },
  LOCKED:    { bg: "bg-[#eef3f9]", text: "text-[#1e3a5f]",  dot: "bg-[#1e3a5f]" },
  CREATED:   { bg: "bg-green-50",  text: "text-green-800",  dot: "bg-green-600" },
};

function timeString(date: Date) {
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function DiffView({ before, after }: { before: any; after: any }) {
  if (!before && !after) return null;
  const keys = Array.from(new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]));
  return (
    <div className="mt-2 rounded-md overflow-hidden border border-gray-200 text-[11px] font-mono">
      {keys.map(k => {
        const changed = before?.[k] !== after?.[k];
        return (
          <div key={k}>
            {before?.[k] !== undefined && (
              <div className="bg-[#fdf0f0] text-[#8b2e2e] px-3 py-1">
                − <span className="font-semibold">{k}</span>: {JSON.stringify(before[k])}
              </div>
            )}
            {after?.[k] !== undefined && (
              <div className={`px-3 py-1 ${changed ? "bg-[#e8f0ea] text-[#2d5a3d]" : "bg-gray-50 text-gray-600"}`}>
                + <span className="font-semibold">{k}</span>: {JSON.stringify(after[k])}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AdminAuditLog() {
  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-500 text-sm mt-0.5">Forensic log of all sensitive changes, approvals, and unlocks · FY 2025–26</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
            {SEED_AUDIT_LOGS.length} entries
          </span>
          <span className="text-[11px] text-gray-400">Showing latest {SEED_AUDIT_LOGS.length} events</span>
        </div>

        <div className="divide-y divide-gray-50">
          {SEED_AUDIT_LOGS.map(log => {
            const style = ACTION_STYLES[log.action] ?? { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" };
            return (
              <div key={log.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${style.bg} ${style.text}`}>
                          {log.action}
                        </span>
                        <span className="text-[13px] font-semibold text-gray-900">{log.entityType}</span>
                        <span className="text-[12px] text-gray-400 font-mono">{log.entityId}</span>
                      </div>
                      <div className="text-[12px] text-gray-500 mt-1">
                        by <span className="font-semibold text-gray-700">{log.changedBy}</span>
                        <span className="ml-2 text-gray-400">·</span>
                        <span className="ml-2">{timeString(log.changedAt)}</span>
                      </div>
                      <DiffView before={log.before} after={log.after} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-400">
        Audit logs are immutable. All entries are cryptographically signed in production.
      </p>
    </div>
  );
}
