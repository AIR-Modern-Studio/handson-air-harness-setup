## Passo 2: A espinha (`AGENTS.md`)

Pacote identificado: **{{ agent_label }}**, idioma `{{ lang }}`, em `{{ package_dir }}/`.

Agora a skill `air-harness-setup` entra em ação. Ela lê o projeto, pergunta o que o código não responde e gera o `AGENTS.md` sob medida, a espinha que todo agente lê em toda conversa.

### 📖 Como a skill trabalha

- **Sessão de instalação.** O agente é aberto na **pasta-mãe** (raiz do repositório), não dentro de `{{ code_dir }}/`. É uma sessão só para instalar o harness.
- **Primeiro o roteiro.** A skill mostra o que pretende fazer e espera você concordar. É a hora de dispensar o que não interessa.
- **Ela pergunta antes de varrer.** Se o projeto tem documentação, diga onde está. "Não sei" e "pula" são respostas válidas: a skill marca a lacuna e segue.
- **Rascunho → validação → gravação.** Cada documento vai primeiro para `{{ package_dir }}/runs/{{ code_dir }}/draft/`. Você lê, pede ajustes, e só então a skill grava no projeto.
- **Memória da sessão.** A skill registra o andamento em `{{ package_dir }}/runs/{{ code_dir }}/`, na raiz do pacote (`STATE.md`, `PROJECT.md`, `PLAN.md`, `DECISIONS.md`). Se a sessão cair, o mesmo gatilho retoma de onde parou.

### ⌨️ Atividade: Abrir o agente na pasta-mãe

{%- if agent == "claude-code" %}

1. Abra um terminal na raiz do repositório (a pasta-mãe) e inicie o Claude Code:

   ```bash
   claude
   ```
{%- elif agent == "kiro" %}

1. No Kiro, abra a **pasta-mãe** (raiz do repositório) com **File → Open Folder**. Se preferir a CLI, abra o terminal na pasta-mãe e inicie o Kiro CLI.
{%- elif agent == "github-copilot" %}

1. No VS Code, abra a **pasta-mãe** (raiz do repositório) com **File → Open Folder**.
1. Abra o Copilot Chat e selecione o modo **Agent**.
{%- elif agent == "ai-cockpit-reasoning" %}

1. No VS Code, abra a **pasta-mãe** (raiz do repositório) com **File → Open Folder**.
1. Abra o painel do AI/C Reasoning e inicie uma conversa nova.
{%- else %}

1. Abra o seu agente na **pasta-mãe** (raiz do repositório).
{%- endif %}

### ⌨️ Atividade: Disparar a skill

1. Envie o gatilho abaixo ao agente. As duas primeiras linhas já estão preenchidas; complete os dois campos de baixo com as suas palavras:

   ```text
   Leia `{{ package_dir }}/harness/skills/air-harness-setup/SKILL.md` e instale o harness no projeto `{{ code_dir }}`.

   Sobre o projeto: <o que é, para quem, stack principal, o que já existe de configuração de agente, o que o agente costuma errar aqui — em poucas linhas>

   Documentos que ajudam: <anexe ou aponte os caminhos — README, documento de arquitetura, ADRs, guia de contribuição, padrões do time>
   ```

1. Leia o roteiro que a skill propõe e responda. Responda às perguntas da entrevista.

1. Quando a skill apresentar o rascunho do `AGENTS.md`, abra o arquivo no editor e leia. Peça ajustes até ficar com a cara do projeto, e então aprove.

   > ❕ **Importante:** o `AGENTS.md` é o único documento obrigatório. Neste passo, pare depois que ele (e o arquivo de ponteiro, se o seu agente usar um) for gravado. **Não feche a sessão**: você continua nela no Passo 3.

1. Confira que o arquivo foi gravado em `{{ code_dir }}/AGENTS.md`.
{%- if agent == "claude-code" %}
   O Claude Code também recebe `{{ code_dir }}/CLAUDE.md`, que aponta para o `AGENTS.md`.
{%- elif agent == "github-copilot" %}
   O Copilot também recebe `{{ code_dir }}/.github/copilot-instructions.md`, que aponta para o `AGENTS.md`.
{%- endif %}

1. Faça o commit na `main`, **incluindo a pasta `runs/` do pacote**, e envie (push):

   ```bash
   git add .
   git commit -m "Passo 2: AGENTS.md"
   git push
   ```

1. Aguarde a verificação nesta issue.
