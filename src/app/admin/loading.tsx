import { AppShellSkeleton, Skeleton } from "@/components/skeleton";

const ROWS = Array.from({ length: 6 }, (_, index) => index);
const STATS = Array.from({ length: 4 }, (_, index) => index);

export default function AdminLoading() {
  return (
    <AppShellSkeleton>
      <div className="mb-8">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>

      <dl className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((item) => (
          <div key={item} className="card p-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-8 w-14" />
          </div>
        ))}
      </dl>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 sm:w-52" />
          <Skeleton className="h-11 sm:w-24" />
        </div>

        <div className="divide-y divide-line">
          {ROWS.map((row) => (
            <div
              key={row}
              className="flex items-center gap-4 px-5 py-4 sm:gap-8"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="hidden h-4 w-36 sm:block" />
              <Skeleton className="hidden h-4 w-28 sm:block" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </AppShellSkeleton>
  );
}
