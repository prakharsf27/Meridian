import { Bell, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

const TYPE_STYLES = {
  success: { dot: "bg-green-500", bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
  warning: { dot: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
  error: { dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
  info: { dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
};

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

export function NotificationCenter() {
  const { notifications, markAllRead, unreadCount } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative text-gray-500 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <span className="font-semibold text-sm text-gray-900">Notifications</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400">No notifications</div>
              ) : notifications.map(n => {
                const s = TYPE_STYLES[n.type];
                return (
                  <div key={n.id} className={`p-3 flex gap-3 ${n.read ? "" : `${s.bg} border-l-2 ${s.border}`}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-gray-900">{n.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-snug">{n.message}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{timeAgo(n.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2 border-t bg-gray-50 text-[10px] text-gray-400 text-center">
              In production, these trigger Teams adaptive cards & emails.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
