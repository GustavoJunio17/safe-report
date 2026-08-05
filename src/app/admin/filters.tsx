"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/types";
import { MAX_SEARCH_LENGTH } from "@/lib/search";

export function AdminFilters({ status, q }: { status: string; q: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    const params = new URLSearchParams();
    const nextStatus = String(formData.get("status") || "");
    const nextQuery = String(formData.get("q") || "").trim();
    if (nextStatus) params.set("status", nextStatus);
    if (nextQuery) params.set("q", nextQuery);
    const search = params.toString();
    // A transição mantém o botão em estado de carregamento até a nova
    // lista chegar do servidor.
    startTransition(() => {
      router.push(search ? `/admin?${search}` : "/admin");
    });
  }

  return (
    <form action={submit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m16 16 4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          name="q"
          defaultValue={q}
          maxLength={MAX_SEARCH_LENGTH}
          placeholder="Buscar por denunciante ou denunciado"
          className="field-input pl-9"
        />
      </div>

      <select
        name="status"
        defaultValue={status}
        className="field-input sm:w-52"
      >
        <option value="">Todos os status</option>
        {STATUS_ORDER.map((item) => (
          <option key={item} value={item}>
            {STATUS_LABEL[item]}
          </option>
        ))}
      </select>

      <button type="submit" disabled={pending} className="btn-secondary">
        {pending ? (
          <>
            <svg
              viewBox="0 0 24 24"
              className="size-4 animate-spin"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                opacity="0.25"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            Filtrando...
          </>
        ) : (
          "Filtrar"
        )}
      </button>
    </form>
  );
}
