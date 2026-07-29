import { Logo } from "@/components/logo";

/** Bloco cinza pulsante que ocupa o lugar de um conteúdo ainda carregando. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-line ${className}`}
    />
  );
}

/**
 * Cabeçalho do painel enquanto a página carrega. Repete a estrutura do
 * AppShell porque o loading.tsx substitui a página inteira — sem isso o
 * cabeçalho some e a tela "pula" quando o conteúdo chega.
 */
export function AppShellSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Logo />
          <div className="ml-auto flex items-center gap-3">
            <Skeleton className="hidden h-8 w-32 sm:block" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </header>

      <main
        aria-busy="true"
        className="mx-auto w-full max-w-6xl flex-1 px-5 py-10"
      >
        <span className="sr-only">Carregando…</span>
        {children}
      </main>

      <footer className="border-t border-line py-6">
        <p className="mx-auto max-w-6xl px-5 text-xs text-muted">
          COAPI · Canal confidencial de denúncias. Todos os registros são
          tratados de forma sigilosa.
        </p>
      </footer>
    </>
  );
}
