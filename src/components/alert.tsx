const TONES = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
} as const;

export function Alert({
  tone = "info",
  children,
}: {
  tone?: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={`rounded-lg border px-3.5 py-3 text-sm ${TONES[tone]}`}
    >
      {children}
    </div>
  );
}
