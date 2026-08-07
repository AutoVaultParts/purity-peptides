"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
  coaAvailable,
}: {
  images: string[];
  alt: string;
  coaAvailable: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasPhotos = images.length > 0;

  return (
    <div>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-card border border-gray-200 bg-gradient-to-br from-sky-bg to-white">
        {coaAvailable && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
            COA verified
          </span>
        )}

        {hasPhotos ? (
          <img
            src={images[activeIndex]}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#4A90D9" strokeWidth="1.3">
              <path d="M9 2h6M10 2v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-3.5L14 8V2" />
            </svg>
            <p className="absolute bottom-4 text-xs text-gray-400">
              Product photography pending, white background pack
            </p>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                i === activeIndex ? "border-sky" : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}