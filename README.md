# Safe Report

Canal corporativo de denúncias. Next.js 16 (App Router) + Supabase (Auth + Postgres + RLS) + Tailwind CSS v4.

## Perfis

| Perfil  | Acesso                                                                     |
| ------- | -------------------------------------------------------------------------- |
| `user`  | `/relatar` — formulário de denúncia + acompanhamento das próprias denúncias |
| `admin` | `/admin` — painel com métricas, filtros, busca e tratativa de cada caso     |

A rota `/` redireciona conforme o papel do usuário logado.

## Estrutura

```
src/
  proxy.ts                  # refresh de sessão + proteção de rotas (Next 16 "middleware")
  app/
    (auth)/login|cadastro   # autenticação
    relatar/                # área do usuário
    admin/                  # painel do admin + detalhe /admin/[id]
  components/               # UI compartilhada
  lib/
    supabase/{server,client}.ts
    actions/{auth,reports}.ts  # Server Actions com validação Zod
    auth.ts                 # requireProfile / requireAdmin
    cpf.ts                  # máscara + validação de dígitos
supabase/schema.sql         # tabelas, trigger, RLS
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

4. **E-mail de confirmação** — Authentication → _Providers_ → _Email_:
   - Para testar rápido, desligue **Confirm email** (o usuário entra direto após o cadastro).
   - Em produção, mantenha ligado e configure SMTP próprio em Authentication → _Emails_ (o SMTP padrão do Supabase tem limite baixo).
5. **URLs de redirecionamento** — Authentication → _URL Configuration_:
   - `Site URL`: `https://seu-projeto.vercel.app`
   - `Redirect URLs`: `http://localhost:3000/**` e `https://seu-projeto.vercel.app/**`
6. **Criar o admin** — cadastre-se em `/cadastro` e promova a conta no SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'voce@empresa.com';
   ```

   Faça logout/login para o novo papel valer.

### Segurança do modelo de dados

- RLS ativo nas duas tabelas: usuário lê/insere apenas as próprias denúncias; admin lê todas e é o único que altera status e notas.
- O papel (`role`) nunca vem do cliente — é definido no banco e lido no servidor.
- `admin_notes` só aparece na tela do admin.

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
