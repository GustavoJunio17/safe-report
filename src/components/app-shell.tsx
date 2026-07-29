import Link from "next/link";
import { Logo } from "@/components/logo";
import { signOut } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";

function initials(profile: Profile) {
  const source = profile.full_name?.trim() || profile.email;
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppShell({
  profile,
  children,
  nav,
}: {
  profile: Profile;
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Link
            href="/admin"
            aria-label="Ir para a página inicial do painel"
            className="shrink-0"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">{nav}</nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-tight font-medium text-ink">
                {profile.full_name || profile.email}
              </p>
              <p className="text-xs leading-tight text-muted">Administrador</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand-strong">
              {initials(profile)}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-canvas hover:text-ink"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
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

export function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-brand-soft text-brand-strong"
          : "text-muted hover:bg-canvas hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
