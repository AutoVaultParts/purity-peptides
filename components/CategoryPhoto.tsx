"use client";

import { useEffect, useRef, useState } from "react";

export default function CategoryPhoto({
  photos,
  alt,
  className = "",
}: {
  photos: string[];
  alt: string;
  className?: string;
}) {
  const [slotPhotos, setSlotPhotos] = useState<[string, string]>(() => [
    photos[0],
    photos[1 % photos.length],
  ]);
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const nextPhotoIndexRef = useRef(2 % photos.length);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Preload only the photo that's coming up next, not the entire set at once
  useEffect(() => {
    const upcoming = photos[nextPhotoIndexRef.current];
    if (upcoming && !preloadedRef.current.has(upcoming)) {
      const img = new Image();
      img.src = upcoming;
      preloadedRef.current.add(upcoming);
    }
  }, [photos, activeSlot]);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlot((prev) => (prev === 0 ? 1 : 0));
    }, 10000);
    return () => clearInterval(interval);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timeout = setTimeout(() => {
      const hiddenSlot = activeSlot === 0 ? 1 : 0;
      setSlotPhotos((prev) => {
        const updated: [string, string] = [...prev];
        updated[hiddenSlot] = photos[nextPhotoIndexRef.current];
        return updated;
      });
      nextPhotoIndexRef.current = (nextPhotoIndexRef.current + 1) % photos.length;
    }, 2000);
    return () => clearTimeout(timeout);
  }, [activeSlot, photos]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={slotPhotos[0]}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ opacity: activeSlot === 0 ? 1 : 0 }}
      />
      <img
        src={slotPhotos[1]}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ opacity: activeSlot === 1 ? 1 : 0 }}
      />
    </div>
  );
}