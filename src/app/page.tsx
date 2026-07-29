import { Logo } from "@/components/logo";
import { ReportForm } from "@/components/report-form";

const HIGHLIGHTS = [
  {
    title: "Envio sem cadastro",
    body: "Você não precisa criar conta nem se identificar em nenhum sistema externo.",
  },
  {
    title: "Tratamento sigiloso",
    body: "O relato é lido apenas pela equipe responsável pela apuração.",
  },
  {
    title: "Protocolo na hora",
    body: "Ao enviar, você recebe um número de protocolo para referência futura.",
  },
];

export default function HomePage() {
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <Logo />
        </div>
      </header>

      <section className="border-b border-line bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">
            Canal de denúncias
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white">
            Registre uma denúncia de forma segura
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
            Preencha o formulário abaixo com o máximo de detalhes possível. Seu
            relato é encaminhado diretamente à equipe responsável pela apuração.
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title}>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-14">
        <div className="card p-6 sm:p-9">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Formulário de denúncia
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Todos os campos são obrigatórios.
          </p>
          <div className="mt-8">
            <ReportForm />
          </div>
        </div>
      </main>

      <footer className="border-t border-line py-6">
        <p className="mx-auto max-w-6xl px-5 text-xs text-muted">
          Safe Report · Canal confidencial de denúncias. Os dados informados são
          usados exclusivamente na apuração do caso.
        </p>
      </footer>
    </>
  );
}
