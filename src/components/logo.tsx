/**
 * Marca da COAPI redesenhada em vetor: disco amarelo com anel verde,
 * duas araucárias formando o "M" e os troncos na base.
 */
export function CoapiMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="#FEF200" />
      <clipPath id="coapi-disc">
        <circle cx="50" cy="50" r="42" />
      </clipPath>
      <g clipPath="url(#coapi-disc)" fill="#056839">
        <path d="M33 15 50 61 13 61Z" />
        <path d="M67 15 87 61 50 61Z" />
        <rect x="6" y="60" width="88" height="6" />
        <rect x="34" y="66" width="5" height="28" />
        <rect x="61" y="66" width="5" height="28" />
      </g>
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="#056839"
        strokeWidth="8"
      />
    </svg>
  );
}

export function Logo({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <CoapiMark />
      <span className="flex flex-col leading-none">
        <span
          className={`text-base font-bold tracking-tight ${
            tone === "dark" ? "text-white" : "text-ink"
          }`}
        >
          COAPI
        </span>
        <span
          className={`mt-1 text-[11px] font-medium tracking-wide uppercase ${
            tone === "dark" ? "text-white/50" : "text-muted"
          }`}
        >
          Canal de denúncias
        </span>
      </span>
    </span>
  );
}
