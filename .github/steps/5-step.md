## Passo 5: Fechar a instalação

As rules estão gravadas. Falta a skill fechar a instalação: rever a espinha, conferir a sessão inteira e mostrar o que ficou onde.

**Objetivo deste passo:** concluir a instalação e commitar o resultado. A verificação confere que a espinha continua com as oito seções, que o arquivo de ponteiro (se o seu agente usar um) carrega a espinha, que nada de `runs/` foi parar no projeto e que o andamento ficou registrado em `STATE.md`.

### 📖 A espinha revisada

Quando um trecho do `AGENTS.md` vira rule, ele sai da espinha, o que deixa um buraco ou uma repetição. A skill mostra o `AGENTS.md` revisado, com os ponteiros para as rules novas, e você valida de novo. Nada que você já aprovou muda sem passar por você outra vez. Se nada saiu da espinha, esta etapa não acontece.

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

1. Continue a instalação, na mesma sessão ou numa nova. Numa sessão nova, abra o agente na pasta-mãe e envie a primeira linha do gatilho do Passo 2.

1. Se a skill mostrar o `AGENTS.md` revisado, leia e valide.

1. Leia a verificação. Se algum item falhou, decida com a skill o que fazer.

1. Leia a entrega e compare com o que você aprovou. Anote o que ficou em aberto.

   > ❕ **Importante:** se quiser incluir algo além do proposto (um servidor MCP, uma skill do time, uma regra de segurança), peça **agora**, durante a sessão de instalação. A skill não fica no projeto depois.

1. Antes do commit, revise o diff (`git status` e `git diff`): ele é a palavra final sobre o que mudou.

1. Faça o commit na `main`, incluindo `runs/`, e envie (push):

   ```bash
   git add .
   git commit -m "Passo 5: fechamento da instalação"
   git push
   ```

1. Aguarde a verificação nesta issue.
