import React from 'react';

/**
 * Official Federal University Dutse (FUD) Emblem Logo Component
 * Renders the authentic university crest emblem (/fud-logo.png) across all screens & printouts.
 */
export default function FudLogo({ className = "w-12 h-12", alt = "Federal University Dutse Emblem" }) {
  return (
    <img
      src="/fud-logo.png"
      alt={alt}
      className={`object-contain inline-block ${className}`}
      loading="eager"
      onError={(e) => {
        // Fallback if needed
        e.currentTarget.src = '/fud-logo.svg';
      }}
    />
  );
}
