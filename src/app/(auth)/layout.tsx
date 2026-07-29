import { Logo } from "@/components/logo";

const HIGHLIGHTS = [
  {
    title: "Registro confidencial",
    body: "Cada relato é vinculado apenas à sua conta e visível somente para a equipe responsável.",
  },
  {
    title: "Acompanhamento em tempo real",
    body: "Veja o status de cada denúncia enviada, do recebimento à conclusão.",
  },
  {
    title: "Gestão centralizada",
    body: "O time administrativo trata todos os casos em um painel único e auditável.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 lg:flex">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-32 size-[26rem] rounded-full bg-brand/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -left-24 size-[24rem] rounded-full bg-brand/20 blur-3xl"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-white/20">
              <svg viewBox="0 0 24 24" fill="none" className="size-4.5">
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
            <span className="text-[15px] font-semibold tracking-tight text-white">
              SafeReport
            </span>
          </span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Canal de denúncias corporativas
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Um ambiente seguro para relatar condutas inadequadas e acompanhar a
            apuração de cada caso.
          </p>

          <ul className="mt-10 space-y-6">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex gap-3.5">
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3">
                    <path
                      d="m5 12.5 4.5 4.5L19 7"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/35">
          © {new Date().getFullYear()} Safe Report
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
