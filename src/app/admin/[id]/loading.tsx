import { AppShellSkeleton, Skeleton } from "@/components/skeleton";

const LINES = Array.from({ length: 5 }, (_, index) => index);
const ROWS = Array.from({ length: 3 }, (_, index) => index);

export default function ReportLoading() {
  return (
    <AppShellSkeleton>
      <Skeleton className="mb-6 h-4 w-36" />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-80 max-w-full" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="card space-y-3 p-6">
            <Skeleton className="h-4 w-20" />
            {LINES.map((line) => (
              <Skeleton
                key={line}
                className={`h-3.5 ${line === LINES.length - 1 ? "w-2/3" : "w-full"}`}
              />
            ))}
          </section>

          <section className="card p-6">
            <Skeleton className="h-4 w-44" />
            <div className="mt-2 divide-y divide-line">
              {ROWS.map((row) => (
                <div key={row} className="space-y-2 py-3.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-52 max-w-full" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <div className="card space-y-4 p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-56 max-w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </aside>
      </div>
    </AppShellSkeleton>
  );
}
