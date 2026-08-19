import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { resetPasswordRequest } from "../api/authApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPasswordRequest(token, newPassword);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reset your password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid link">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This reset link is missing or invalid.{" "}
          <Link to="/forgot-password" className="text-brand-500">
            Request a new one
          </Link>
          .
        </p>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password reset">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your password has been updated.{" "}
          <Link to="/login" className="text-brand-500">
            Sign in
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="password"
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}