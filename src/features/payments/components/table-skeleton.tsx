const ROWS = 10;

export function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading payments">
      <div className="h-10 border-b border-line-subtle" />
      {Array.from({ length: ROWS }, (_, index) => (
        <div
          key={index}
          className="flex h-11 items-center gap-6 border-b border-line-subtle px-4"
        >
          <div className="h-3 w-24 animate-pulse rounded bg-offset" />
          <div className="h-3 w-16 animate-pulse rounded bg-offset" />
          <div className="h-3 w-28 animate-pulse rounded bg-offset" />
          <div className="h-3 w-40 animate-pulse rounded bg-offset" />
          <div className="h-3 flex-1 animate-pulse rounded bg-offset" />
        </div>
      ))}
    </div>
  );
}
