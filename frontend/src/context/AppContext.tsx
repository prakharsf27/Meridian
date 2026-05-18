import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Role = "employee" | "manager" | "admin";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAllRead: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "success", title: "Goal Sheet Approved", message: "Priya Mehta approved your FY 2025-26 goal sheet.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false },
  { id: "n2", type: "warning", title: "Q2 Check-in Due", message: "Your Q2 check-in is due by 15 Jul 2026. 3 goals need updates.", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), read: false },
  { id: "n3", type: "info", title: "New Shared Goal", message: "Admin pushed a shared Org KPI: 'Improve NPS > 70'. Adjust weightage.", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), read: true },
  { id: "n4", type: "warning", title: "Pending Approval (Manager)", message: "Ananya Nair submitted her goal sheet 3 days ago. Review required.", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), read: true },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("employee");
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications(prev => [
      { ...n, id: `n${Date.now()}`, timestamp: new Date(), read: false },
      ...prev
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{ role, setRole, notifications, addNotification, markAllRead, unreadCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
