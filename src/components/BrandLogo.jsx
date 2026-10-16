// VibezRoutes logo: the Palm & Sun mark and the Fraunces wordmark.
// The mark draws in currentColor (palm, shoreline, water) with the sun in
// --brand-sun, so the same SVG works on the forest header and on light cards.

export function BrandMark({ size = 40, className = "" }) {
  return (
    <svg
      className={`brand-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="var(--brand-sun, #8ba888)" d="M13 47a19 19 0 0 1 38 0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        d="M29 47c0-10 3-18 9-25"
      />
      <path fill="currentColor" d="M38 22c-6-6-14-5-19 0 6-2 12-1 19 0z" />
      <path fill="currentColor" d="M38 22c2-8 9-11 15-9-6 2-11 5-15 9z" />
      <path fill="currentColor" d="M38 22c7-2 14 2 16 8-5-4-10-6-16-8z" />
      <path fill="currentColor" d="M38 22c-4-2-8-9-6-14 3 5 5 9 6 14z" />
      <rect x="9" y="47" width="46" height="3.2" rx="1.6" fill="currentColor" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        d="M15 55.5c3-2 6 2 9 0s6 2 9 0 6 2 9 0 6 2 8 0"
      />
    </svg>
  );
}

export function BrandName({ className = "brand-name" }) {
  return (
    <span className={className}>
      Vibez<em>Routes</em>
    </span>
  );
}
