import type { SyntheticEvent } from 'react';

// Inline SVG placeholder (emerald gradient + leaf motif) used when a remote
// image fails to load. Kept as a local data URI so the fallback itself can
// never fail to render, even when external CDNs are unreachable or throttled.
export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#064e3b"/>
          <stop offset="1" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)"/>
      <g fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="14" stroke-linecap="round">
        <path d="M400 430 C400 330 330 270 250 250 C300 360 360 400 400 430 Z" fill="#ffffff" fill-opacity="0.18" stroke-opacity="0.25"/>
        <path d="M400 430 C400 320 470 260 555 245 C505 360 445 400 400 430 Z" fill="#ffffff" fill-opacity="0.18" stroke-opacity="0.25"/>
        <path d="M400 460 L400 250"/>
      </g>
      <text x="400" y="540" font-family="Georgia, serif" font-size="34" fill="#ffffff" fill-opacity="0.85" text-anchor="middle">Maxim Vet</text>
    </svg>`
  );

// onError handler: swap to the local fallback once, and detach the handler so a
// failed fallback can never trigger an infinite error loop.
export function handleImageError(e: SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = 'true';
  img.src = FALLBACK_IMAGE;
}
