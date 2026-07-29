import type { Metadata } from "next";
import { Alert } from "@/components/alert";
import { signOut } from "@/lib/actions/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Acesso restrito" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  if (erro === "sem-permissao") {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Sem permissão
        </h2>
        <p className="mt-2 text-sm text-muted">
          Sua conta existe, mas ainda não foi liberada para o painel de
          apuração.
        </p>

        <div className="mt-6">
          <Alert tone="error">
            Peça a um administrador para liberar seu acesso.
          </Alert>
        </div>

        <form action={signOut} className="mt-8">
          <button type="submit" className="btn-secondary w-full">
            Sair e entrar com outra conta
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        Acesso restrito
      </h2>
      <p className="mt-2 text-sm text-muted">
        Área destinada à equipe responsável pela apuração das denúncias.
      </p>

      <LoginForm />
    </div>
  );
}
