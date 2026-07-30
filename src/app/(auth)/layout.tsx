import Link from "next/link";
import { Logo } from "@/components/logo";
import { currentYearInBrazil } from "@/lib/datetime";

const HIGHLIGHTS = [
  {
    title: "Visão consolidada",
    body: "Todas as denúncias recebidas em um painel único, com métricas por status.",
  },
  {
    title: "Busca e filtros",
    body: "Localize casos por denunciante, pessoa denunciada ou situação da apuração.",
  },
  {
    title: "Trilha de tratativa",
    body: "Atualize o status e registre observações internas em cada caso.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-strong p-12 lg:flex">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-32 size-[26rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -left-24 size-[24rem] rounded-full bg-black/20 blur-3xl"
        />

        <div className="relative">
          <Link href="/" aria-label="Ir para a página inicial">
            <Logo tone="dark" />
          </Link>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Painel de apuração
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Área interna da equipe responsável pelo tratamento das denúncias
            recebidas pelo canal.
          </p>

          <ul className="mt-10 space-y-6">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex gap-3.5">
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 ring-1 ring-accent/30">
                  <svg viewBox="0 0 24 24" fill="none" className="size-3">
                    <path
                      d="m5 12.5 4.5 4.5L19 7"
                      stroke="#FEF200"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/35">
          © {currentYearInBrazil()} COAPI
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Link href="/" aria-label="Ir para a página inicial">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
