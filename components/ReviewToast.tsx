"use client";

import { useEffect, useState } from "react";

export default function ReviewToast({ show, onDone }: { show: boolean; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeIn = setTimeout(() => setVisible(true), 20);
    const fadeOutStart = setTimeout(() => setVisible(false), 4300);
    const remove = setTimeout(() => onDone(), 5000);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOutStart);
      clearTimeout(remove);
    };
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-success/10">
          <img src="/icon-success.png" alt="" className="h-4 w-4 object-contain" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Thank you for your review</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Our team reviews every submission before it goes live.
          </p>
        </div>
      </div>
    </div>
  );
}