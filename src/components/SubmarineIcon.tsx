import React from 'react';

interface SubmarineIconProps {
  color?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
  size?: number | string;
}

export const SubmarineIcon: React.FC<SubmarineIconProps> = ({
  color = '#eab308',
  secondaryColor = '#ca8a04',
  accentColor = '#38bdf8',
  className = 'w-10 h-10',
}) => {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Hull Gradient */}
        <linearGradient id={`hull-grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>

        {/* Metallic Highlight Gradient */}
        <linearGradient id="metal-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        {/* Porthole Glass Glow */}
        <radialGradient id="porthole-glow" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor={accentColor} />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
      </defs>

      {/* 1. Tail Propeller Shaft & Blades */}
      <g id="propeller">
        {/* Propeller Hub */}
        <path d="M 8 30 L 14 26 L 14 34 Z" fill="#94a3b8" />
        {/* Brass Blades */}
        <path d="M 6 20 C 4 24, 10 28, 8 30 C 6 32, 4 36, 6 40 C 8 36, 8 24, 6 20 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
      </g>

      {/* 2. Rear Tail Rudder & Vertical Stabilizer Fins */}
      <path d="M 14 18 L 22 24 L 14 28 Z" fill={secondaryColor} stroke="#ffffff" strokeWidth="0.8" />
      <path d="M 14 42 L 22 36 L 14 32 Z" fill={secondaryColor} stroke="#ffffff" strokeWidth="0.8" />

      {/* 3. Conning Tower / Sail / Bridge (Top Feature) */}
      {/* Sail Structure */}
      <path d="M 42 22 L 46 12 C 47 10, 57 10, 59 12 L 62 22 Z" fill={`url(#hull-grad-${color.replace('#', '')})`} stroke="#ffffff" strokeWidth="1" />
      {/* Sail Trim Top Ledge */}
      <rect x="45" y="10" width="15" height="2.5" rx="1" fill={secondaryColor} />
      
      {/* Dual Periscope Masts */}
      {/* Main Periscope */}
      <path d="M 52 10 L 52 2 L 56 2" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="56" cy="2" r="1.5" fill={accentColor} />
      {/* Antenna / Radar */}
      <path d="M 48 10 L 48 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Blinking Red Beacon Light */}
      <circle cx="48" cy="3" r="1.2" fill="#ef4444" />

      {/* 4. Main Submarine Hull Body (Teardrop / Cigar Shape) */}
      {/* Smooth Curved Hull */}
      <path
        d="M 14 30 C 14 21, 30 18, 55 18 C 78 18, 92 24, 94 30 C 92 36, 78 42, 55 42 C 30 42, 14 39, 14 30 Z"
        fill={`url(#hull-grad-${color.replace('#', '')})`}
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      {/* Hull Metallic Top Shine Strip */}
      <path
        d="M 22 23 C 35 20, 65 20, 82 23 C 70 21, 38 21, 22 23 Z"
        fill="url(#metal-shine)"
      />

      {/* Hull Center Horizontal Seam / Molded Trim Line */}
      <path d="M 18 30 L 88 30" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="6 2" />

      {/* 5. Bow Front Diving Plane (Wing Fin) */}
      <path d="M 72 31 L 82 32 L 80 34 L 70 33 Z" fill={secondaryColor} stroke="#ffffff" strokeWidth="0.8" />

      {/* 6. Three Glass Illuminated Porthole Windows */}
      {/* Porthole 1 */}
      <circle cx="36" cy="30" r="4.5" fill="url(#porthole-glow)" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="34.5" cy="28.5" r="1" fill="#ffffff" />

      {/* Porthole 2 */}
      <circle cx="50" cy="30" r="4.5" fill="url(#porthole-glow)" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="48.5" cy="28.5" r="1" fill="#ffffff" />

      {/* Porthole 3 */}
      <circle cx="64" cy="30" r="4.5" fill="url(#porthole-glow)" stroke="#ffffff" strokeWidth="1.2" />
      <circle cx="62.5" cy="28.5" r="1" fill="#ffffff" />

      {/* 7. Nose Spotlight / Headlight Lens Assembly */}
      <path d="M 90 27 C 93 28, 94 30, 94 30 C 94 30, 93 32, 90 33 Z" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
      <circle cx="92" cy="30" r="2" fill="#ffffff" />

      {/* Forward Light Rays */}
      <polygon points="94,29 100,24 100,36 94,31" fill="#fef08a" opacity="0.35" />
    </svg>
  );
};
