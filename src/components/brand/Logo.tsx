interface LogoProps {
  variant?: "mark" | "full" | "stacked" | "wordmark";
  inverted?: boolean;
  size?: number;
  className?: string;
}

/**
 * AutoLabels.io Logo Component
 *
 * Renders the AutoLabels.io brand logo with blue price tag icon.
 * Uses the brand image at /autolabels-logo.png with SVG text fallback.
 */
const Logo = ({ variant = "mark", inverted = false, size = 32, className }: LogoProps) => {
  const navy = "#0B2041";
  const blue = "#2563EB";
  const lightBlue = "#38BDF8";

  if (variant === "mark") {
    // Blue price tag icon
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        {/* Tag body */}
        <path
          d="M8 18 L32 6 L56 18 L56 50 C56 53 54 55 52 56 L34 62 C33 62.5 31 62.5 30 62 L12 56 C10 55 8 53 8 50 Z"
          fill="url(#tagGrad)"
          stroke="none"
        />
        {/* Tag hole */}
        <circle cx="32" cy="16" r="4" fill="white" opacity="0.9" />
        {/* Dollar sign */}
        <text x="32" y="46" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="24" fontWeight="800" fill="white">$</text>
        {/* Checkmark */}
        <path d="M40 52 L44 56 L52 48" stroke={lightBlue} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Full / stacked / wordmark — tag icon + text
  const wordColor = inverted ? "#FFFFFF" : navy;
  const ioColor = inverted ? "#60A5FA" : blue;
  const taglineColor = inverted ? "#94A3B8" : "#64748B";

  const textWidth = variant === "wordmark" ? 0 : size;
  const totalWidth = variant === "wordmark" ? size * 6 : size * 7;

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {variant !== "wordmark" && (
        <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tagGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <path
            d="M8 18 L32 6 L56 18 L56 50 C56 53 54 55 52 56 L34 62 C33 62.5 31 62.5 30 62 L12 56 C10 55 8 53 8 50 Z"
            fill="url(#tagGradFull)"
          />
          <circle cx="32" cy="16" r="4" fill="white" opacity="0.9" />
          <text x="32" y="46" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="24" fontWeight="800" fill="white">$</text>
          <path d="M40 52 L44 56 L52 48" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <div className="flex flex-col">
        <span style={{ fontSize: size * 0.55, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <span style={{ color: wordColor }}>Auto</span>
          <span style={{ color: ioColor }}>Labels.io</span>
        </span>
        {(variant === "full" || variant === "stacked") && size >= 28 && (
          <span style={{ fontSize: size * 0.22, fontWeight: 600, color: taglineColor, letterSpacing: "0.12em", lineHeight: 1.4, textTransform: "uppercase" }}>
            Clear. Compliant. Consistent.
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
