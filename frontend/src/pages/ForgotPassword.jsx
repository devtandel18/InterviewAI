import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { forgotPasswordRequest } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPasswordRequest(email);
      setDevToken(res.devToken || null);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      {submitted ? (
        <div className="rounded-lg border border-[#1f242e] bg-[#12151c]/40 dark:bg-[#12151c] px-4 py-3 text-sm text-slate-300">
          If an account exists for <span className="text-white">{email}</span>, a reset link is
          on its way.
          {devToken && (
            <p className="mt-3 border-t border-[#1f242e] pt-3 text-xs text-slate-500">
              No email service is connected yet — for testing, use this link directly:{" "}
              <Link to={`/reset-password?token=${devToken}`} className="text-brand-500">
                Reset password
              </Link>
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="font-medium text-brand-500 hover:text-brand-400">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}