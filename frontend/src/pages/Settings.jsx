import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/layout/DashboardShell";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { updatePasswordRequest, updateSettingsRequest, deleteAccountRequest } from "../api/settingsApi";
import { applyTheme } from "../utils/applyTheme";

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [theme, setTheme] = useState(user?.theme || "system");
  const [notifications, setNotifications] = useState(
    user?.notificationPreferences || { email: true, interviewReminders: true }
  );
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    setSavingPassword(true);
    try {
      await updatePasswordRequest(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setPasswordMessage("Password updated.");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Couldn't update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleThemeChange = async (e) => {
    const value = e.target.value;
    setTheme(value);
    applyTheme(value);
    setSavingSettings(true);
    try {
      const updated = await updateSettingsRequest({ theme: value });
      setUser(updated);
      localStorage.setItem("interviewai_user", JSON.stringify(updated));
    } finally {
      setSavingSettings(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setSettingsMessage("");
    setSavingSettings(true);
    try {
      const updated = await updateSettingsRequest({ notificationPreferences: notifications });
      setUser(updated);
      localStorage.setItem("interviewai_user", JSON.stringify(updated));
      setSettingsMessage("Notification preferences saved.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== user?.email) {
      setDeleteError("Type your email exactly to confirm.");
      return;
    }
    setDeleting(true);
    try {
      await deleteAccountRequest();
      logout();
      navigate("/", { replace: true });
    } catch {
      setDeleteError("Couldn't delete your account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-xl flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your account, security, and preferences.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Account</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Email</span>
            <span className="text-slate-900 dark:text-white">{user?.email}</span>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="mt-4 flex flex-col gap-4">
            <Input
              type="password"
              label="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
              }
              required
            />
            <Input
              type="password"
              label="New password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              minLength={8}
              required
            />
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            {passwordMessage && <p className="text-sm text-success">{passwordMessage}</p>}
            <Button type="submit" loading={savingPassword} className="self-start">
              Update password
            </Button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Theme</h2>
          <div className="mt-4">
            <Select value={theme} onChange={handleThemeChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </Select>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-[#1f242e] bg-white dark:bg-[#12151c] p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h2>
          <form onSubmit={handleNotificationsSubmit} className="mt-4 flex flex-col gap-3">
            <label className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Email notifications</span>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications((n) => ({ ...n, email: e.target.checked }))
                }
                className="h-4 w-4 rounded accent-brand-500"
              />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Interview reminders</span>
              <input
                type="checkbox"
                checked={notifications.interviewReminders}
                onChange={(e) =>
                  setNotifications((n) => ({ ...n, interviewReminders: e.target.checked }))
                }
                className="h-4 w-4 rounded accent-brand-500"
              />
            </label>
            {settingsMessage && <p className="text-sm text-success">{settingsMessage}</p>}
            <Button type="submit" loading={savingSettings} className="self-start">
              Save preferences
            </Button>
          </form>
        </section>

        <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="text-sm font-semibold text-red-500">Delete account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This permanently deletes your account and all interview history. This can't be undone.
          </p>
          <Input
            className="mt-4"
            placeholder={`Type "${user?.email}" to confirm`}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          {deleteError && <p className="mt-2 text-sm text-red-500">{deleteError}</p>}
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="mt-4">
            Delete my account
          </Button>
        </section>
      </div>
    </DashboardShell>
  );
}