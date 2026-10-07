## Passo 5: Fechar a instalação

As rules estão gravadas. Falta a skill fechar a instalação: rever a espinha, conferir a sessão inteira e mostrar o que ficou onde.

**Objetivo deste passo:** concluir a instalação e commitar o resultado. A verificação confere que a espinha continua com as oito seções, que o arquivo de ponteiro (se o seu agente usar um) carrega a espinha, que nada de `runs/` foi parar no projeto e que o fechamento ficou registrado: o `STATE.md` atualizado neste passo ou, se o fechamento não precisou de nenhuma alteração, a conclusão registrada em `DECISIONS.md`, com o `STATE.md` e o `PLAN.md` concluídos.

### 📖 A espinha revisada

Quando um trecho do `AGENTS.md` vira rule, ele sai da espinha, o que deixa um buraco ou uma repetição. A skill mostra o `AGENTS.md` revisado, com os ponteiros para as rules novas, e você valida de novo. Nada que você já aprovou muda sem passar por você outra vez. Antes de mexer no `AGENTS.md`, a skill guarda uma cópia dele em `{{ package_dir }}/runs/{{ code_dir }}/before/`: o projeto não tem controle de versão próprio, e essa cópia é o que permite desfazer a revisão. Se nada saiu da espinha, esta etapa não acontece.

### 📖 A verificação independente

A skill confere a sessão inteira, de preferência com um subagente que não escreveu nada, porque quem escreveu tende a não ver o próprio erro. A lista é objetiva, de contar ou procurar:

- nada foi gravado sem a sua aprovação, nem fora do que o pacote prevê (`MANIFEST.json`);
- a configuração de MCP não foi tocada, a menos que você tenha pedido;
- a espinha tem as oito seções e nenhum campo do template sobrando;
- a espinha é lida: {{ spine_reach | safe }};
- {{ verify_scope | safe }};
- nada de `runs/` foi parar no projeto, e nenhum segredo ou dado pessoal foi escrito.

Se algum item falhar, a skill reporta e não conserta por conta própria: a decisão é sua. Se ela não puder delegar, avisa que a verificação não foi independente.

### 📖 A entrega

No fim, a skill mostra o que foi escrito, onde ficou e como chega ao agente; o que não entrou e por quê; o que ficou em aberto, como as lacunas da entrevista; e o que fazer agora.

### ⌨️ Atividade: Concluir a instalação

1. Continue a instalação, na mesma sessão ou numa nova. Se quiser começar uma sessão nova, abra o agente na pasta-mãe e envie o gatilho abaixo:

   ```text
   Leia `{{ package_dir }}/harness/skills/air-harness-setup/SKILL.md` e instale o harness no projeto `{{ code_dir }}`.
   ```

1. Se a skill apresentar o `AGENTS.md` revisado, leia e valide. Nem sempre o agente mostra o rascunho na tela, principalmente no CLI: o arquivo está em `{{ package_dir }}/runs/{{ code_dir }}/draft/`.

1. Leia a verificação. Se algum item falhou, decida com a skill o que fazer.

   > ❕ **Importante:** as respostas do agente nem sempre são determinísticas. A conversa pode ter alguns passos a mais do que os descritos aqui, como uma pergunta ou uma confirmação extra: responda e siga normalmente.

1. Leia a entrega e compare com o que você aprovou. Anote o que ficou em aberto.

   > ❕ **Importante:** se quiser incluir algo além do proposto (um servidor MCP, uma skill do time, uma regra de segurança), peça **agora**, durante a sessão de instalação. A skill não fica no projeto depois.

1. O fechamento pode não alterar nenhum arquivo: quando nada saiu da espinha e a verificação passou, ou quando a skill já fechou a instalação no Passo 4. Se o `git status` não mostrar nenhuma alteração, confira se o agente está certo antes de seguir:

   - a verificação passou em todos os itens da lista acima, sem nada para corrigir;
   - o `STATE.md` e o `PLAN.md`, em `{{ package_dir }}/runs/{{ code_dir }}/`, não têm nenhum item pendente.

   Se estiver tudo certo, peça para registrar a conclusão:

   ```text
   Conferi a verificação e a entrega da instalação do harness em `{{ code_dir }}`, e estão corretas: a instalação está concluída e não precisa de nenhuma alteração. Registre essa decisão em `{{ package_dir }}/runs/{{ code_dir }}/DECISIONS.md`. Confira também se o `STATE.md` e o `PLAN.md` dessa pasta marcam a instalação como concluída e, se não marcarem, atualize. Não altere nada dentro de `{{ code_dir }}/`.
   ```

   > ❕ **Importante:** a verificação deste passo procura essa decisão no `DECISIONS.md` e confere se o `STATE.md` e o `PLAN.md` marcam a instalação como concluída.

1. Antes do commit, revise o diff (`git status` e `git diff`): ele é a palavra final sobre o que mudou.

1. Faça o commit na `main`, incluindo `runs/`, e envie (push):

   ```bash
   git add .
   git commit -m "Passo 5: fechamento da instalação"
   git push
   ```

1. Aguarde a verificação nesta issue.
