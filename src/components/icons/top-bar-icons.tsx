import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** App tiles and top bar icons, redrawn from the reference at the size they are shown. */

export function AppLogoLd(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        d="M6.5 4.85h1.95a3.2 3.2 0 0 1 0 6.4H8.1"
        fill="none"
        stroke="#3860e2"
        strokeWidth="1.7"
      />
      <path d="M3.5 3.7h2.1V10h2.5v2.1H3.5Z" fill="#18181b" />
    </svg>
  );
}

export function AppLogoGeo(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <rect width="16" height="16" rx="3.5" fill="#01a2df" />
      <path
        d="M3.4 10.9 2 7.1l2-3.5L8 2.1l4 1.5 2 3.5-1.4 3.8Z"
        fill="#ffffff"
      />
      <path
        d="M2 7h12M8 2.1 5.8 7 8 10.9 10.2 7 8 2.1ZM5.8 7l-1.6 3.9M10.2 7l1.6 3.9M4 3.6 5.8 7M12 3.6 10.2 7"
        fill="none"
        stroke="#01a2df"
        strokeWidth=".75"
      />
      <path d="M4.3 11.8h7.4v1.5H4.3Z" fill="#ffffff" />
    </svg>
  );
}

export function AppLogoArrow(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="app-arrow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4fd585" />
          <stop offset="1" stopColor="#84dc6b" />
        </linearGradient>
      </defs>
      <rect width="16" height="16" rx="3.5" fill="#000000" />
      <path d="M5 5h6.7v5.9l-.9 1.4H9V7.3H3.6Z" fill="url(#app-arrow)" />
    </svg>
  );
}

function Outline({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function AppsAddIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <rect x="2.6" y="2.9" width="5.6" height="5.6" rx="1.3" />
      <rect x="2.6" y="11.5" width="5.6" height="5.6" rx="1.3" />
      <rect x="11.2" y="11.5" width="5.6" height="5.6" rx="1.3" />
      <path d="M14 2.9v5.6M11.2 5.7h5.6" />
    </Outline>
  );
}

export function HelpIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <path d="M10 2.4a7.6 7.6 0 1 1-3.7 14.25L2.4 17.6l.95-3.8A7.6 7.6 0 0 1 10 2.4Z" />
      <path d="M7.9 8.1a2.15 2.15 0 1 1 3.05 1.95c-.55.27-.95.75-.95 1.4v.35" />
      <circle cx="10" cy="14.1" r=".2" fill="currentColor" />
    </Outline>
  );
}

export function CreateIcon(props: IconProps) {
  return (
    <Outline strokeWidth={2} {...props}>
      <path d="M10 5.2v9.6M5.2 10h9.6" />
    </Outline>
  );
}
