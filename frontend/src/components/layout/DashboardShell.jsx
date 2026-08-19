import Sidebar from "./Sidebar";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export default function DashboardShell({ children }) {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0b0e14]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-slate-200 dark:border-[#1f242e] px-6">
          <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}