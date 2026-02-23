import React from "react";

/**
 * CircularProgress
 * A simple SVG ring that fills based on value/max.
 *
 * Props:
 *  - value       : current number (e.g. 47)
 *  - max         : maximum number (e.g. 100)
 *  - size        : pixel size of the circle (default 80)
 *  - stroke      : ring thickness in px (default 7)
 *  - color       : ring fill color (default var(--brand))
 *  - trackColor  : background ring color (default var(--progressTrack))
 *  - label       : text shown below the circle (e.g. "Cases")
 *  - sublabel    : smaller text below label (e.g. "Solved")
 */
export default function CircularProgress({
  value      = 0,
  max        = 100,
  size       = 80,
  stroke     = 7,
  color      = "var(--brand)",
  trackColor = "var(--progressTrack)",
  label,
  sublabel,
}) {
  const radius     = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillOffset = circumference * (1 - Math.min(value / max, 1));

  return (
    <div className="flex flex-col items-center gap-1">

      {/* SVG ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={trackColor} strokeWidth={stroke}
          />
          {/* Filled arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={fillOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>

        {/* Centre number */}
        <div
          className="absolute inset-0 flex items-center justify-center font-extrabold text-sm"
          style={{ color: "var(--text)" }}
        >
          {value}
        </div>
      </div>

      {/* Labels */}
      {label && (
        <div className="text-center">
          <div className="text-xs font-bold"  style={{ color: "var(--text)"  }}>{label}</div>
          {sublabel && <div className="text-xs" style={{ color: "var(--muted)" }}>{sublabel}</div>}
        </div>
      )}

    </div>
  );
}