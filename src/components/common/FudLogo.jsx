import React from 'react';

/**
 * Official Federal University Dutse (FUD) Emblem Logo Component
 * High-definition vector SVG representation of the FUD academic crest.
 */
export default function FudLogo({ className = "w-12 h-12", variant = "full" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Federal University Dutse Official Logo"
    >
      <defs>
        {/* Outer Ring Gradient */}
        <radialGradient id="fudGreenGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a3d24" />
          <stop offset="100%" stopColor="#042314" />
        </radialGradient>

        {/* Golden Sun & Accents */}
        <linearGradient id="fudGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Inner Shield Gradient */}
        <linearGradient id="fudShieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </linearGradient>

        {/* Circular text path for university name */}
        <path
          id="fudTopTextPath"
          d="M 28,100 A 72,72 0 1,1 172,100"
          fill="none"
        />
        <path
          id="fudBottomTextPath"
          d="M 172,100 A 72,72 0 0,1 28,100"
          fill="none"
        />
      </defs>

      {/* Outer Decorative Gold Bezel */}
      <circle cx="100" cy="100" r="96" fill="url(#fudGoldGrad)" stroke="#B45309" strokeWidth="2" />
      <circle cx="100" cy="100" r="91" fill="url(#fudGreenGrad)" stroke="#FDE68A" strokeWidth="1.5" />

      {/* Outer Ring Circular Typography */}
      <text fill="#FDE68A" fontSize="12.5" fontWeight="800" letterSpacing="2.5px" fontFamily="system-ui, sans-serif">
        <textPath href="#fudTopTextPath" startOffset="50%" textAnchor="middle">
          FEDERAL UNIVERSITY DUTSE
        </textPath>
      </text>

      <text fill="#FDE68A" fontSize="9.5" fontWeight="700" letterSpacing="2px" fontFamily="system-ui, sans-serif">
        <textPath href="#fudBottomTextPath" startOffset="50%" textAnchor="middle">
          ★ JIGAWA STATE • NIGERIA ★
        </textPath>
      </text>

      {/* Inner Gold Separator Ring */}
      <circle cx="100" cy="100" r="66" fill="#064E3B" stroke="#FDE68A" strokeWidth="2" />
      <circle cx="100" cy="100" r="61" fill="#FFFFFF" />

      {/* Sunburst Rays Behind Central Shield */}
      <g stroke="url(#fudGoldGrad)" strokeWidth="1.5" opacity="0.6">
        <line x1="100" y1="46" x2="100" y2="58" />
        <line x1="72" y1="58" x2="80" y2="67" />
        <line x1="128" y1="58" x2="120" y2="67" />
        <line x1="56" y1="82" x2="68" y2="86" />
        <line x1="144" y1="82" x2="132" y2="86" />
      </g>

      {/* Central University Academic Shield */}
      <path
        d="M 72,66 L 128,66 C 128,66 130,96 100,118 C 70,96 72,66 72,66 Z"
        fill="#042F2E"
        stroke="#D97706"
        strokeWidth="2.5"
      />

      {/* Upper Shield: Graduation Cap (Mortarboard) */}
      <g transform="translate(100, 78)">
        {/* Cap Diamond */}
        <polygon points="0,-10 16,-3 0,4 -16,-3" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
        {/* Skull cap */}
        <path d="M -9,-1 C -9,4 9,4 9,-1" fill="#D97706" />
        {/* Tassel */}
        <path d="M 0,-3 L 13,3 L 14,9" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="9.5" r="1.5" fill="#F59E0B" />
      </g>

      {/* Lower Shield: Open Book of Knowledge */}
      <g transform="translate(100, 100)">
        {/* Left Page */}
        <path
          d="M 0,4 C -6,-1 -14,-1 -20,2 L -20,-10 C -14,-13 -6,-13 0,-8 Z"
          fill="#FFFFFF"
          stroke="#D97706"
          strokeWidth="1.2"
        />
        {/* Right Page */}
        <path
          d="M 0,4 C 6,-1 14,-1 20,2 L 20,-10 C 14,-13 6,-13 0,-8 Z"
          fill="#FFFFFF"
          stroke="#D97706"
          strokeWidth="1.2"
        />
        {/* Book spine & text lines */}
        <line x1="0" y1="-8" x2="0" y2="5" stroke="#92400E" strokeWidth="1.5" />
        <line x1="-16" y1="-6" x2="-4" y2="-4" stroke="#042F2E" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="-16" y1="-2" x2="-4" y2="0" stroke="#042F2E" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="4" y1="-4" x2="16" y2="-6" stroke="#042F2E" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="4" y1="0" x2="16" y2="-2" stroke="#042F2E" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* Laurel Wreath Flanking Base */}
      <g fill="#16A34A" stroke="#14532D" strokeWidth="0.5">
        {/* Left Laurel Leaves */}
        <ellipse cx="58" cy="116" rx="4" ry="2" transform="rotate(-30 58 116)" />
        <ellipse cx="64" cy="126" rx="4" ry="2" transform="rotate(-15 64 126)" />
        <ellipse cx="73" cy="134" rx="4" ry="2" transform="rotate(10 73 134)" />
        {/* Right Laurel Leaves */}
        <ellipse cx="142" cy="116" rx="4" ry="2" transform="rotate(30 142 116)" />
        <ellipse cx="136" cy="126" rx="4" ry="2" transform="rotate(15 136 126)" />
        <ellipse cx="127" cy="134" rx="4" ry="2" transform="rotate(-10 127 134)" />
      </g>

      {/* University Motto Ribbon at Bottom */}
      <g transform="translate(100, 142)">
        {/* Ribbon Banner Body */}
        <path
          d="M -54,0 L -58,-6 L -46,-4 L -44,0 Z M 54,0 L 58,-6 L 46,-4 L 44,0 Z"
          fill="#B45309"
        />
        <path
          d="M -48,-5 C -24,-1 24,-1 48,-5 L 44,5 C 22,9 -22,9 -44,5 Z"
          fill="url(#fudGoldGrad)"
          stroke="#78350F"
          strokeWidth="1"
        />
        {/* Motto Text */}
        <text
          x="0"
          y="2.5"
          textAnchor="middle"
          fill="#1E293B"
          fontSize="4.8"
          fontWeight="900"
          letterSpacing="0.8px"
          fontFamily="system-ui, sans-serif"
        >
          KNOWLEDGE • EXCELLENCE • SERVICE
        </text>
      </g>
    </svg>
  );
}
