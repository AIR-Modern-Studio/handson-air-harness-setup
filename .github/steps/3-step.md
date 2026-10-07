## Passo 3: Os demais documentos

A espinha está gravada. Agora a skill passa pelos outros documentos do harness, um de cada vez. Cada um cobre uma parte que a espinha só aponta: o que bloquearia uma mudança, como o review julga, o mapa da arquitetura.

**Objetivo deste passo:** passar por cada documento que a skill propuser e decidir: aprovar, ajustar ou dispensar. A verificação confere que as suas decisões ficaram registradas em `{{ package_dir }}/runs/{{ code_dir }}/DECISIONS.md`.

### 📖 Os documentos no {{ agent_label }}

| Documento | Para que serve | Onde fica |
| --- | --- | --- |
| Constitution | As poucas regras que bloqueariam uma mudança neste projeto. Vem do que o time diz: o que já causou incidente, o que um regulador ou contrato obriga. | `{{ doc_constitution }}` |
| Contrato de review | O que o review considera importante aqui e o que ele confere em toda mudança. | `{{ doc_review_contract }}` |
| Calibração do review | A régua do revisor automatizado: o que ele pode aprovar sozinho, o que só reporta e o que bloqueia. | `{{ doc_review_examples }}` |
| Arquitetura | Um mapa de alto nível: camadas, direção das dependências e decisões-chave. | `{{ doc_architecture }}` |
| Template de PR | O formato que pré-preenche todo pull request, de pessoa ou de agente. | `{{ doc_pr_template }}` no GitHub; o lugar muda conforme a forja |
| Índice da documentação | Uma linha por documento do projeto: o que é e quando ler. | `{{ doc_docs_index }}` |

- **Um por vez, na ordem que fizer sentido para o projeto.** Cada documento segue o caminho do `AGENTS.md`: rascunho em `{{ package_dir }}/runs/{{ code_dir }}/draft/`, você lê no editor, pede ajustes e decide.
- **A constitution começa com perguntas.** Ela é escrita com o que você disser, nunca com uma lista trazida de fora: o que já causou incidente aqui? O que faria você recusar uma entrega?
- **O que o projeto já tem prevalece.** Se já existe um documento equivalente, a skill mostra o que encontrou e não o substitui.
- **Sem base, sem documento.** Se um documento sairia só com o esqueleto, a skill pergunta antes de gerar. Sem forja (GitHub, GitLab…), não há template de PR. Sem CI, o review não fala do que o CI garante.

### ⌨️ Atividade: Decidir os documentos

1. Continue a instalação. Pode ser na mesma sessão do Passo 2 ou numa nova; uma sessão nova começa com o contexto limpo, o que ajuda se a conversa já ficou longa. Se quiser começar uma sessão nova, abra o agente na pasta-mãe e envie o gatilho abaixo: a skill lê o registro em `{{ package_dir }}/runs/{{ code_dir }}/` e retoma de onde parou.

   ```text
   Leia `{{ package_dir }}/harness/skills/air-harness-setup/SKILL.md` e instale o harness no projeto `{{ code_dir }}`.
   ```

1. Para cada documento que a skill apresentar, leia o resumo e as perguntas em aberto, abra o rascunho no editor e decida: aprove, peça ajustes ou dispense. Nem sempre o agente mostra o rascunho na tela, principalmente no CLI: os arquivos estão em `{{ package_dir }}/runs/{{ code_dir }}/draft/`.

   > ❕ **Importante:** nenhum destes documentos é obrigatório. Dispensar é uma decisão, não uma falha, e fica registrada com o motivo em `DECISIONS.md`.

   > ❕ **Importante:** as respostas do agente nem sempre são determinísticas. A conversa pode ter alguns passos a mais do que os descritos aqui, como uma pergunta ou uma confirmação extra: responda e siga normalmente.

1. Quando a skill chegar às **rules candidatas**, avise que vai parar por aqui: as rules ficam para o Passo 4. Confira que o andamento ficou registrado em `{{ package_dir }}/runs/{{ code_dir }}/STATE.md`.

1. Confira o que foi gravado em `{{ code_dir }}/`.

1. Faça o commit na `main`, **incluindo a pasta `runs/` do pacote**, e envie (push):

   ```bash
   git add .
   git commit -m "Passo 3: documentos"
   git push
   ```

1. Aguarde a verificação nesta issue.
