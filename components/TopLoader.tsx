"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isFirstRender = useRef(true);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") return;
      if (href.startsWith("http") && !href.includes(window.location.host)) return;

      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      clearTimers();
      setVisible(true);
      setWidth(0);
      // Force a reflow-friendly start, then creep the bar forward while the
      // new route compiles/renders, so the person sees motion immediately.
      timers.current.push(setTimeout(() => setWidth(25), 20));
      timers.current.push(setTimeout(() => setWidth(55), 220));
      timers.current.push(setTimeout(() => setWidth(75), 600));
      timers.current.push(setTimeout(() => setWidth(88), 1400));
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Pathname (or query string) changing means the new route has committed.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    clearTimers();
    setWidth(100);
    const hide = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 250);
    timers.current.push(hide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => clearTimers, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[3px] w-full"
    >
      <div
        className="h-full bg-gradient-to-r from-sky to-cyan-400 transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${width}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  );
}