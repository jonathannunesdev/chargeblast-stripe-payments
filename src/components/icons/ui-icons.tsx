import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Button and filter icons, redrawn from the reference at the size they are shown. */
function Outline({
  children,
  viewBox,
  strokeWidth,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Outline viewBox="0 0 14 14" strokeWidth={1.7} {...props}>
      <path d="M7 1.9v10.2M1.9 7h10.2" />
    </Outline>
  );
}

export function AnalyzeIcon(props: IconProps) {
  return (
    <Outline viewBox="0 0 16 16" strokeWidth={1.6} {...props}>
      <path d="M2.75 2.5v10.75h10.5M5.75 7.75v3M8.75 5v5.75M11.75 3v7.75" />
    </Outline>
  );
}

export function AddCircleIcon(props: IconProps) {
  return (
    <Outline viewBox="0 0 16 16" strokeWidth={1.1} {...props}>
      <circle cx="8" cy="8" r="5.3" />
      <path d="M8 5.2v5.6M5.2 8h5.6" />
    </Outline>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" {...props}>
      <path
        d="M5 3c.4 2.2 1.8 3.6 4 4-2.2.4-3.6 1.8-4 4-.4-2.2-1.8-3.6-4-4 2.2-.4 3.6-1.8 4-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M10 .5v3.4M8.3 2.2h3.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExportIcon(props: IconProps) {
  return (
    <Outline viewBox="0 0 16 16" strokeWidth={1.25} {...props}>
      <path d="M2.75 11v2.25c0 .41.34.75.75.75h9c.41 0 .75-.34.75-.75V11" />
      <path d="M5.5 10.6V9a3.1 3.1 0 0 1 3.1-3.1h4.2M10.9 3.8l2.1 2.1-2.1 2.1" />
    </Outline>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Outline viewBox="0 0 20 20" strokeWidth={1.65} {...props}>
      <path d="M8.52 4.49 8.84 2.69 11.16 2.69 11.48 4.49 12.85 5.06 14.35 4.01 15.99 5.65 14.94 7.15 15.51 8.52 17.31 8.84 17.31 11.16 15.51 11.48 14.94 12.85 15.99 14.35 14.35 15.99 12.85 14.94 11.48 15.51 11.16 17.31 8.84 17.31 8.52 15.51 7.15 14.94 5.65 15.99 4.01 14.35 5.06 12.85 4.49 11.48 2.69 11.16 2.69 8.84 4.49 8.52 5.06 7.15 4.01 5.65 5.65 4.01 7.15 5.06Z" />
      <circle cx="10" cy="10" r="2.6" />
    </Outline>
  );
}
