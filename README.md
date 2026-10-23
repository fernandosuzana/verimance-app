# Verimance

Plataforma de relacionamento para pessoas 45+, com o **Guardian**, uma IA que lê as conversas e alerta sobre golpes românticos. Trilíngue: francês, inglês e português.

**O que já funciona neste código**

| Área | O que faz |
|---|---|
| Site público (`/`) | Página inicial com números do problema, como funciona, planos e botões das lojas |
| Contas | Criar conta, confirmar e-mail, entrar, recuperar senha, sair |
| Perfil (`/app/onboarding`, `/app/me`) | Nome, idade, cidade, gênero, interesse, bio, foto |
| Verificação | O membro pede verificação; a equipe aprova no console |
| Descobrir (`/app/discover`) | Só perfis verificados e ativos, filtrados por interesse, sem bloqueados |
| Conversas (`/app/chats`) | Chat privado em tempo real. Só os dois participantes leem |
| Guardian | Analisa cada mensagem no servidor e alerta quem recebe. Regras + IA (Claude) |
| Conversar com o Guardian (`/app/guardian`) | O membro pergunta sobre um match; o Guardian responde com o contexto das conversas |
| Aliado da família | Recebe um e-mail curto quando o Guardian detecta pedido de dinheiro |
| Denúncia e bloqueio | Com evidências anexadas automaticamente |
| Guardian+ | Assinatura mensal ou anual pelo Stripe, cobrada na moeda local; teste grátis de 14 dias |
| Console da equipe (`/admin`) | Denúncias, verificações, mensagens de investidores, chaves de API |
| API B2B (`/api/v1/conversations/analyze`) | Parceiros enviam conversas e recebem a análise do Guardian |
| Investidores (`/investors`) | Formulário que grava no banco e envia e-mail para investors@verimance.com |

---

## Como colocar no ar (≈ 30 minutos, uma vez só)

Você vai criar 3 contas gratuitas e 1 chave paga. Faça na ordem.

### 1. Banco de dados — Supabase (grátis)
1. Crie uma conta em **supabase.com** e clique em **New project**. Nome: `verimance`. Região: **Canada (Central)**. Guarde a senha do banco.
2. No menu da esquerda, abra **SQL Editor › New query**, cole todo o conteúdo do arquivo `supabase/schema.sql` deste repositório e clique em **Run**.
3. Em **Project Settings › API**, copie três valores: **Project URL**, **anon public** e **service_role** (este é secreto).
4. Em **Authentication › URL Configuration**, coloque em *Site URL* o endereço do site (ex.: `https://verimance.com`) e adicione `https://verimance.com/auth/callback` em *Redirect URLs*.

### 2. Guardian IA — Anthropic (pago por uso)
1. Crie uma conta em **console.anthropic.com**, adicione um cartão em *Billing* e crie uma chave em **API Keys**.
2. Guarde a chave (começa com `sk-ant-`).

### 3. Hospedagem — Vercel (grátis para começar)
1. Crie uma conta em **vercel.com** entrando com o GitHub.
2. Clique em **Add New › Project** e importe `fernandosuzana/verimance-app`.
3. Antes de clicar em Deploy, abra **Environment Variables** e cole as variáveis do arquivo `.env.example`, preenchidas:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (passo 1)
   - `ANTHROPIC_API_KEY` (passo 2)
   - `NEXT_PUBLIC_SITE_URL` = o endereço final do site
4. Clique em **Deploy**. Em 2 minutos o site está no ar num endereço `*.vercel.app`.

### 4. Vire administrador
1. Crie sua conta no site.
2. No Supabase, abra o SQL Editor e rode (trocando o e-mail):
   ```sql
   update public.profiles set role = 'admin', verification = 'verified'
   where id = (select id from auth.users where email = 'fernandosuzana@gmail.com');
   ```
3. Agora `/admin` abre o console da equipe.

### 5. Opcionais (podem ficar para depois)
- **Pagamentos (Stripe)**: crie o produto *Guardian+* com dois preços recorrentes (US$15/mês e US$150/ano) e ative **Adaptive Pricing** para cobrar na moeda local. Preencha `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_YEARLY`. Crie um webhook para `https://SEU-SITE/api/stripe/webhook` com os eventos `checkout.session.completed`, `customer.subscription.updated` e `customer.subscription.deleted`, e coloque o segredo em `STRIPE_WEBHOOK_SECRET`. Sem isso, o botão de assinar fica oculto e todos ganham o teste de 14 dias.
- **E-mails (Resend)**: para o formulário de investidores e os alertas do aliado da família. Crie conta em resend.com, verifique o domínio verimance.com e preencha `RESEND_API_KEY`.
- **Domínio**: na Vercel, *Settings › Domains › Add* `verimance.com` e siga as instruções de DNS. Combine antes com quem cuida do app atual.
- **Lojas**: quando os apps estiverem publicados, preencha `NEXT_PUBLIC_APP_STORE_URL` e `NEXT_PUBLIC_PLAY_STORE_URL`.

---

## Privacidade e segurança (como foi construído)
- Toda tabela tem **Row Level Security**: cada membro só lê as próprias conversas, alertas e denúncias.
- Mensagens só são gravadas pelo servidor, para o Guardian analisar cada uma. A chave da Anthropic fica só no servidor.
- Membros não conseguem alterar sozinhos verificação, Trust Score, plano ou papel de administrador.
- O Guardian nunca acusa ninguém: mostra sinais e explica.

## Ainda não incluído (próximas entregas de engenharia)
- **Verificação automática de identidade** (documento + prova de vida) com um fornecedor como Persona ou Veriff. Hoje a equipe aprova manualmente no console.
- **Chamada de vídeo dentro do app** com checagem de rosto.
- **Planejador de encontro seguro** com check-in.
- **Apps nativos iOS e Android.**
- Termos de Uso e Política de Privacidade (textos jurídicos).

## Desenvolvimento local
```bash
cp .env.example .env.local   # preencha as chaves
npm install
npm run dev                  # http://localhost:3000
```
