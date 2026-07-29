export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4.5"
          aria-hidden="true"
        >
          <path
            d="M12 3 5 6v5.5c0 4.3 2.9 8.3 7 9.5 4.1-1.2 7-5.2 7-9.5V6l-7-3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="m9.2 12.2 2 2 3.6-3.9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-ink">
        Safe<span className="text-brand">Report</span>
      </span>
    </span>
  );
}
