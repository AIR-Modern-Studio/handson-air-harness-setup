## Passo 2: A espinha (`AGENTS.md`)

Pacote identificado: **{{ agent_label }}**, idioma `{{ lang }}`, em `{{ package_dir }}/`.

Agora a skill `air-harness-setup` entra em ação. Ela lê o projeto, pergunta o que o código não responde e gera o `AGENTS.md` sob medida, a espinha que todo agente lê em toda conversa.

**Objetivo deste passo:** gravar o `{{ code_dir }}/AGENTS.md`. {{ pointer_note | safe }}

### 📖 Como a skill trabalha

A instalação acontece numa sessão à parte das sessões em que você trabalha no código: o agente é aberto na **pasta-mãe** (raiz do repositório), não dentro de `{{ code_dir }}/`. Ela pode se estender por mais de uma sessão, porque o andamento fica registrado e é retomado.

1. **O gatilho.** Você envia uma mensagem que aponta para o `SKILL.md` do pacote e para a pasta do projeto. A skill confirma em qual pasta vai instalar e espera o seu ok antes de seguir.
1. **Documentação primeiro.** Antes de ler o código, ela pergunta se o time tem documentação do projeto (arquitetura, ADRs, guia de contribuição, padrões), mesmo que você não tenha apontado nada no gatilho. Depois faz uma leitura limitada do projeto.
1. **O planejamento.** A skill mostra o que encontrou, o que vai propor, em que ordem e quantos itens são, e grava isso em `PLAN.md`. É orientação, não aprovação: é a hora de dispensar o que você não quiser, antes de ela gerar. Cada documento ainda passa pela sua validação.
1. **A espinha.** O primeiro item é o `AGENTS.md`, junto com o arquivo de ponteiro, se o seu agente usar um. A skill entrevista você só sobre o que os documentos e o código não responderam. "Não sei" e "pula" são respostas válidas: ela marca a lacuna e segue.
1. **Rascunho → validação → gravação.** Cada documento vai primeiro para `{{ package_dir }}/runs/{{ code_dir }}/draft/`. Você lê no editor, pede ajustes, e só então a skill grava no projeto.
1. **Os demais documentos e as rules** vêm depois, um de cada vez: os documentos no Passo 3 e as rules no Passo 4.

**Memória da instalação.** A cada etapa, a skill registra o andamento em `{{ package_dir }}/runs/{{ code_dir }}/` (`STATE.md`, `PROJECT.md`, `PLAN.md`, `DECISIONS.md`). Se você abrir uma sessão nova, o mesmo gatilho retoma de onde parou.

### ⌨️ Atividade: Abrir o agente na pasta-mãe

1. {{ open_hint | safe }}

### ⌨️ Atividade: Disparar a skill

1. Envie o gatilho abaixo ao agente, já preenchido. *Sobre o projeto* resume o projeto e avisa o agente que o `README.md` e a pasta `.github/` da raiz são o roteiro deste hands-on: sem esse aviso, ele pode se guiar pelo exercício em vez da skill. O que o gatilho não disser, a skill pergunta.

   ```text
   Leia `{{ package_dir }}/harness/skills/air-harness-setup/SKILL.md` e instale o harness no projeto `{{ code_dir }}`.

   Sobre o projeto: servidor MCP em TypeScript/Node que gera dados brasileiros fictícios para teste (pessoas, CPF, CNH, PIS…) chamando o site 4Devs. Não tem controle de versão, CI nem forja próprios: o git deste repositório (histórico, branches, PRs), o `README.md` e a pasta `.github/` da raiz são do roteiro deste hands-on. Ignore todos eles.
   ```

1. Confirme a pasta do projeto quando a skill perguntar (`{{ code_dir }}`).

   > ❕ **Importante:** as respostas do agente nem sempre são determinísticas. A conversa pode ter alguns passos a mais do que os descritos aqui, como uma pergunta ou uma confirmação extra: responda e siga normalmente.

1. Responda sobre a documentação: se o projeto tiver alguma, aponte onde está; se não tiver, diga que não há.

1. Leia o planejamento que a skill apresenta (`PLAN.md`). Dispense agora o que não quiser; o resto vem para validação, um item por vez.

1. Responda às perguntas da entrevista.

1. Quando a skill apresentar o rascunho do `AGENTS.md` (e do arquivo de ponteiro, se o seu agente usar um), abra no editor e leia. Nem sempre o agente mostra o rascunho na tela, principalmente no CLI: os arquivos estão em `{{ package_dir }}/runs/{{ code_dir }}/draft/`. Peça ajustes até ficar com a cara do projeto, e então aprove.

   > ❕ **Importante:** na skill, nada é obrigatório. A obrigação é dela: depois de ler o projeto, ela sempre propõe o `AGENTS.md`, mesmo que conclua que nada mais é necessário. Aprovar, ajustar ou recusar cada documento é decisão sua.

1. Quando o `AGENTS.md` for gravado, avise a skill que vai parar por aqui: os demais documentos ficam para o Passo 3 e as rules para o Passo 4. Confira que o andamento ficou registrado em `{{ package_dir }}/runs/{{ code_dir }}/STATE.md`.

1. Confira que o arquivo foi gravado em `{{ code_dir }}/AGENTS.md`. {{ pointer_note | safe }}

1. Faça o commit na `main`, **incluindo a pasta `runs/` do pacote**, e envie (push):

   ```bash
   git add .
   git commit -m "Passo 2: AGENTS.md"
   git push
   ```

1. Aguarde a verificação nesta issue.
