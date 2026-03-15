"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  User,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
  Download,
  LogOut,
  Trash2,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { getMoodEmoji } from "@/lib/utils";

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const item = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editTimezone, setEditTimezone] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d);
        setEditName(d.name ?? "");
        setEditBio(d.bio ?? "");
        setEditTimezone(d.timezone ?? "Asia/Tokyo");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim() || null,
          bio: editBio.trim() || null,
          timezone: editTimezone,
        }),
      });
      const data = await res.json();
      setProfile((prev: any) => ({ ...prev, ...data }));
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `axune-data-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (deleteConfirm !== "DELETE") return;
    try {
      await fetch("/api/profile", { method: "DELETE" });
      signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
    }
  };

  const firstName =
    profile?.name?.split(" ")[0] ?? session?.user?.name?.split(" ")[0] ?? "?";
  const initials = firstName[0]?.toUpperCase() ?? "?";

  return (
    <motion.div
      variants={container}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-5"
    >
      <PageHeader title="Profile" subtitle="Your account and settings" />

      {/* Profile card */}
      <motion.div variants={item}>
        <Card>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#7c9a6e]/15 border-2 border-[#7c9a6e]/25 flex items-center justify-center shrink-0">
              {profile?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.image}
                  alt={firstName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="font-serif text-2xl text-[#7c9a6e]">
                  {initials}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <Skeleton lines={2} />
              ) : editing ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                    className="text-base font-medium text-[#3d3a35] bg-[#faf8f5] border border-[#ede9e2] rounded-lg px-3 py-1.5 outline-none focus:border-[#7c9a6e] w-full"
                  />
                  <input
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="A short bio..."
                    className="text-sm text-[#5a5549] bg-[#faf8f5] border border-[#ede9e2] rounded-lg px-3 py-1.5 outline-none focus:border-[#7c9a6e] w-full"
                  />
                </div>
              ) : (
                <>
                  <p className="font-medium text-[#3d3a35]">
                    {profile?.name ?? "Unnamed"}
                  </p>
                  <p className="text-sm text-[#8a8578] truncate">
                    {profile?.email}
                  </p>
                  {profile?.bio && (
                    <p className="text-xs text-[#8a8578] mt-1 italic">
                      {profile.bio}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Edit/Save button */}
            <div className="flex gap-1.5 shrink-0">
              {editing ? (
                <>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    loading={saving}
                  >
                    <Save size={13} />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(false)}
                  >
                    <X size={13} />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditing(true)}
                >
                  <Edit3 size={13} />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {/* Member since */}
          {profile?.joinedAt && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#f6f3ee]">
              <Calendar size={14} className="text-[#b5ad9e]" />
              <p className="text-xs text-[#8a8578]">
                Member since{" "}
                {format(parseISO(profile.joinedAt), "MMMM d, yyyy")}
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <motion.div variants={item}>
          <Card>
            <Skeleton className="h-5 w-24 mb-4" />
            <Skeleton lines={3} />
          </Card>
        </motion.div>
      ) : profile?.stats ? (
        <motion.div variants={item}>
          <Card>
            <h2 className="font-serif text-xl text-[#3d3a35] mb-4">
              Your journey
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Days tracked",
                  value: profile.stats.totalDays ?? 0,
                  icon: Calendar,
                  color: "#d4a954",
                },
                {
                  label: "Habits created",
                  value: profile.stats.totalHabits ?? 0,
                  icon: CheckCircle,
                  color: "#7c9a6e",
                },
                {
                  label: "Journal entries",
                  value: profile.stats.totalJournalEntries ?? 0,
                  icon: BookOpen,
                  color: "#8b7bb5",
                },
                {
                  label: "Focus minutes",
                  value: `${profile.stats.totalFocusMinutes ?? 0}m`,
                  icon: Clock,
                  color: "#6b9bc3",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-[#faf8f5] rounded-xl p-3.5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} style={{ color: stat.color }} />
                      <span className="text-xs text-[#8a8578]">
                        {stat.label}
                      </span>
                    </div>
                    <p className="font-serif text-xl text-[#3d3a35]">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {/* Settings */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-serif text-xl text-[#3d3a35] mb-4">Settings</h2>

          <div className="flex flex-col gap-3">
            {/* Timezone */}
            {editing && (
              <div>
                <label className="text-sm font-medium text-[#3d3a35] block mb-1.5">
                  Timezone
                </label>
                <select
                  value={editTimezone}
                  onChange={(e) => setEditTimezone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl text-sm text-[#3d3a35] outline-none focus:border-[#7c9a6e]"
                >
                  {[
                    "Asia/Tokyo",
                    "Asia/Seoul",
                    "Asia/Shanghai",
                    "Asia/Singapore",
                    "America/New_York",
                    "America/Los_Angeles",
                    "America/Chicago",
                    "Europe/London",
                    "Europe/Paris",
                    "Europe/Berlin",
                    "Australia/Sydney",
                  ].map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Export data */}
            <button
              onClick={handleExport}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-[#faf8f5] hover:bg-[#f0ede7] transition-colors text-left"
            >
              <Download size={16} className="text-[#7c9a6e]" />
              <div>
                <p className="text-sm font-medium text-[#3d3a35]">
                  Export your data
                </p>
                <p className="text-xs text-[#8a8578]">
                  Download all your data as JSON
                </p>
              </div>
            </button>

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-[#faf8f5] hover:bg-[#f0ede7] transition-colors text-left"
            >
              <LogOut size={16} className="text-[#8a8578]" />
              <div>
                <p className="text-sm font-medium text-[#3d3a35]">Sign out</p>
                <p className="text-xs text-[#8a8578]">
                  Return to the landing page
                </p>
              </div>
            </button>

            {/* Delete account */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-[#9e6b5e]/8 hover:bg-[#9e6b5e]/12 transition-colors text-left border border-[#9e6b5e]/15"
            >
              <Trash2 size={16} className="text-[#9e6b5e]" />
              <div>
                <p className="text-sm font-medium text-[#9e6b5e]">
                  Delete account
                </p>
                <p className="text-xs text-[#9e6b5e]/70">
                  Permanently delete all your data
                </p>
              </div>
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Links */}
      <motion.div variants={item}>
        <div className="flex gap-4 justify-center text-xs text-[#b5ad9e]">
          <a href="/privacy" className="hover:text-[#8a8578] transition-colors">
            Privacy
          </a>
          <a href="/terms" className="hover:text-[#8a8578] transition-colors">
            Terms
          </a>
          <a
            href="/disclaimer"
            className="hover:text-[#8a8578] transition-colors"
          >
            Disclaimer
          </a>
          <a href="/about" className="hover:text-[#8a8578] transition-colors">
            About
          </a>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirm("");
        }}
        title="Delete account"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#5a5549] leading-relaxed">
            This will permanently delete your account and all associated data
            — habits, journal entries, mood logs, and everything else. This
            action cannot be undone.
          </p>
          <div>
            <label className="text-sm font-medium text-[#3d3a35] block mb-1.5">
              Type DELETE to confirm
            </label>
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl text-sm outline-none focus:border-[#9e6b5e]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirm("");
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteConfirm !== "DELETE"}
              fullWidth
            >
              Delete everything
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
