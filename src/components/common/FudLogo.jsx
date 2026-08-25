import React from 'react';

/**
 * Official Federal University Dutse (FUD) Emblem Logo Component
 * Renders the authentic university SVG emblem from /fud-logo.svg across all screens & printouts.
 */
export default function FudLogo({ className = "w-12 h-12", alt = "Federal University Dutse Emblem" }) {
  return (
    <img
      src="/fud-logo.svg"
      alt={alt}
      className={`object-contain inline-block ${className}`}
      loading="eager"
    />
  );
}
