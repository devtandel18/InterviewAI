import { useEffect, useState } from "react";
import DashboardShell from "../components/layout/DashboardShell";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import SkillsInput from "../components/profile/SkillsInput";
import { useAuth } from "../context/AuthContext";
import { getProfileRequest, updateProfileRequest } from "../api/profileApi";
import { TARGET_ROLES } from "../utils/constants";
import { useRef } from "react";
import { uploadProfilePictureRequest } from "../api/profileApi";

const EXPERIENCE_LEVELS = ["Student", "Entry Level", "Mid Level", "Senior", "Staff+"];

export default function Profile() {
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
const [uploading, setUploading] = useState(false);

const handleFileSelect = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  setError("");
  try {
    const updated = await uploadProfilePictureRequest(file);
    setForm(updated);
    setUser(updated);
    localStorage.setItem("interviewai_user", JSON.stringify(updated));
  } catch (err) {
    setError(err.response?.data?.message || "Couldn't upload image.");
  } finally {
    setUploading(false);
  }
};

// Replace the old "Profile picture URL" <Input> block with:
<div>
  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
    Profile picture
  </label>
  <div className="mt-2 flex items-center gap-4">
    <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-[#1f242e]">
      {form.profilePicture ? (
        <img
          src={`http://localhost:5000${form.profilePicture}`}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-400">
          {form.name?.[0]?.toUpperCase()}
        </div>
      )}
    </div>
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        Change photo
      </Button>
      <p className="mt-1 text-xs text-slate-400">JPEG, PNG, or WebP. Max 5MB.</p>
    </div>
  </div>
</div>

  useEffect(() => {
    getProfileRequest().then(setForm);
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const updated = await updateProfileRequest(form);
      setForm(updated);
      setUser(updated);
      localStorage.setItem("interviewai_user", JSON.stringify(updated));
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <DashboardShell>
        <div className="flex justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep this up to date so your interviews stay relevant.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <Input id="name" name="name" label="Name" value={form.name} onChange={handleChange} />
          <Input
            id="profilePicture"
            name="profilePicture"
            label="Profile picture URL"
            placeholder="https://..."
            value={form.profilePicture}
            onChange={handleChange}
          />
          <Select
            id="targetRole"
            name="targetRole"
            label="Target role"
            value={form.targetRole}
            onChange={handleChange}
          >
            {TARGET_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
          <Select
            id="experienceLevel"
            name="experienceLevel"
            label="Experience level"
            value={form.experienceLevel}
            onChange={handleChange}
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills</label>
            <SkillsInput
              skills={form.skills || []}
              onChange={(skills) => setForm((f) => ({ ...f, skills }))}
            />
          </div>

          <Input
            id="githubUrl"
            name="githubUrl"
            label="GitHub URL"
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={handleChange}
          />
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/..."
            value={form.linkedinUrl}
            onChange={handleChange}
          />

          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>}
          {message && (
            <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{message}</p>
          )}

          <Button type="submit" loading={saving} className="self-start">
            Save changes
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
}