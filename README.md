# Safe Report

Canal corporativo de denúncias. Next.js 16 (App Router) + Supabase (Auth + Postgres + RLS) + Tailwind CSS v4.

## Rotas

| Rota          | Acesso        | O que faz                                                     |
| ------------- | ------------- | ------------------------------------------------------------- |
| `/`           | público       | Formulário de denúncia. Sem conta, sem login. Devolve protocolo |
| `/login`      | público       | Entrada da equipe interna                                     |
| `/admin`      | só admin      | Painel: métricas, busca, filtro por status                    |
| `/admin/[id]` | só admin      | Detalhe do caso, mudança de status e notas internas           |

Não existe cadastro na aplicação: contas administrativas são criadas manualmente no Supabase.

## Estrutura

```
src/
  proxy.ts                  # sessão + proteção de /admin (Next 16 "middleware")
  app/
    page.tsx                # formulário público
    (auth)/login/           # acesso restrito
    admin/                  # painel + detalhe /admin/[id]
  components/
    report-form.tsx         # formulário público
  lib/
    supabase/{server,client,env}.ts
    actions/{auth,reports}.ts  # Server Actions com validação Zod
    auth.ts                 # requireAdmin
    cpf.ts                  # máscara + validação de dígitos
supabase/
  schema.sql                # tabelas, trigger, RLS (banco novo)
  migrations/               # ALTERs para banco já existente
```

## Rodar local

```bash
pnpm install
cp .env.example .env.local   # preencha com as chaves do Supabase
pnpm dev
```

---

## 1. Configurar o Supabase

1. **Criar projeto** — https://supabase.com/dashboard → _New project_. Região `South America (São Paulo)`; guarde a senha do banco.
2. **Rodar o schema** — SQL Editor → _New query_ → cole todo o conteúdo de `supabase/schema.sql` → _Run_. Isso cria:
   - tabelas `profiles` e `reports`;
   - trigger `on_auth_user_created`, que cria o profile automaticamente no cadastro;
   - função `is_admin()` e todas as políticas de RLS.
3. **Pegar as chaves** — Project Settings → _API keys_:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `publishable` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   Cole em `.env.local`.

4. **URLs de redirecionamento** — Authentication → _URL Configuration_:
   - `Site URL`: `https://seu-projeto.vercel.app`
   - `Redirect URLs`: `http://localhost:3000/**` e `https://seu-projeto.vercel.app/**`
5. **Criar o administrador** — Authentication → _Users_ → _Add user_ → _Create new user_. Marque **Auto Confirm User**. Depois, no SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'voce@email.com';
   ```

   Repita para cada pessoa da equipe. Não há tela de cadastro na aplicação — é intencional: ninguém cria conta sozinho.

### Segurança do modelo de dados

- `reports` aceita `INSERT` de qualquer visitante (o formulário é público), mas `SELECT`, `UPDATE` e `DELETE` exigem `is_admin()`. Uma pessoa que envie uma denúncia não consegue ler nenhuma — nem a própria.
- O papel (`role`) nunca vem do cliente — é definido no banco e lido no servidor.
- `admin_notes` só existe na tela do admin.
- Como o formulário é aberto, considere ativar proteção contra abuso na Vercel (BotID ou rate limit no WAF) antes de divulgar a URL.

---

## 2. Deploy na Vercel

1. **Subir o código**

   ```bash
   git add -A && git commit -m "feat: safe report"
   git remote add origin git@github.com:SEU-USUARIO/safe-report.git
   git push -u origin main
   ```

2. **Importar** — https://vercel.com/new → selecione o repositório. A Vercel detecta Next.js sozinha; não mude build command nem output directory.

3. **Variáveis de ambiente** — em _Environment Variables_ (Production, Preview e Development):

   | Nome                            | Valor                      |
   | ------------------------------- | -------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave anon/publishable     |

   Pela CLI:

   ```bash
   npx vercel link
   npx vercel env add NEXT_PUBLIC_SUPABASE_URL
   npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   npx vercel env pull .env.local   # sincroniza local
   ```

4. **Deploy** — depois do primeiro deploy, volte ao Supabase e coloque a URL final em _Site URL_ / _Redirect URLs_ (passo 5 acima).

5. **Domínio próprio** (opcional) — Settings → Domains → adicione o domínio e aponte o DNS. Atualize as URLs no Supabase novamente.

### Observações de produção

- As páginas são dinâmicas (`ƒ`) porque dependem da sessão — sem cache indevido de dados sensíveis.
- Preview deployments usam o mesmo banco. Para isolar, crie um segundo projeto Supabase e use variáveis diferentes no ambiente _Preview_.
