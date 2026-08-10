"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseAuth as supabase } from "@/lib/supabase-browser-ssr";

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "unread" | "read";
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) showToast(`Failed to load messages: ${error.message}`, "error");
    setMessages(data || []);
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function markAsRead(id: string) {
    const { error } = await supabase.from("contact_requests").update({ status: "read" }).eq("id", id);
    if (error) {
      showToast(`Failed to update: ${error.message}`, "error");
    } else {
      fetchMessages();
    }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm("Delete this message permanently?")) return;
    const { error } = await supabase.from("contact_requests").delete().eq("id", id);
    if (error) {
      showToast(`Failed to delete: ${error.message}`, "error");
    } else {
      showToast("Message deleted.", "success");
      fetchMessages();
    }
  }

  return (
    <div className="p-6 font-body">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[999] rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="mb-6 font-heading text-xl font-bold text-ink">{messages.length} Messages</h1>

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-400">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-400">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-white p-5 ${
                msg.status === "unread" ? "border-sky" : "border-gray-200"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-ink">{msg.name}</span>
                    <span className="text-xs text-gray-400">{msg.email}</span>
                    {msg.phone && <span className="text-xs text-gray-400">{msg.phone}</span>}
                    {msg.status === "unread" && (
                      <span className="rounded bg-sky px-2 py-0.5 text-xs font-medium text-white">New</span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{msg.message}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  {msg.status === "unread" && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="text-xs font-medium text-sky hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-xs font-medium text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}