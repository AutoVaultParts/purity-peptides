"use client";

import { useEffect } from "react";

export default function DisableImageActions() {
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    const blockDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDragStart);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDragStart);
    };
  }, []);

  return null;
}