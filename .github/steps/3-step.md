## Passo 3: Rules sob medida

O `AGENTS.md` vale para o projeto inteiro. As **rules** valem para uma parte dele: uma área do código (por exemplo, acesso a dados) ou um tipo de tarefa (por exemplo, hotfix). Elas carregam só quando o assunto aparece, o que mantém a espinha enxuta.

### 📖 Rules no {{ agent_label }}

A skill propõe **rules candidatas** a partir do que encontrou no projeto. Você escolhe quais quer e valida **uma a uma**. Nenhuma rule do pacote é gravada direto: os exemplos do pacote servem de forma, e o texto é escrito para o seu projeto.

| Tipo | Onde fica no {{ agent_label }} |
| --- | --- |
{%- if agent == "claude-code" %}
| Área do código | `{{ code_dir }}/.claude/rules/air-*.md`, com `paths:` no frontmatter |
| Tipo de tarefa | `{{ code_dir }}/.claude/commands/air-*.md`, acionado com `/air-<nome>` |
{%- elif agent == "kiro" %}
| Área do código | `{{ code_dir }}/.kiro/steering/air-*.md`, com `inclusion: fileMatch` |
| Tipo de tarefa | `{{ code_dir }}/.kiro/steering/air-*.md`, com `inclusion: manual`, acionado com `#air-<nome>` |
{%- elif agent == "github-copilot" %}
| Área do código | `{{ code_dir }}/.github/instructions/air-*.instructions.md`, com `applyTo:` |
| Tipo de tarefa | `{{ code_dir }}/.github/prompts/air-*.prompt.md` |
{%- elif agent == "ai-cockpit-reasoning" %}
| Área do código | `{{ code_dir }}/.aicockpit/rules/air-*.md` |
| Tipo de tarefa | `{{ code_dir }}/.aicockpit/workflows/air-*.md` |
{%- endif %}

### ⌨️ Atividade: Aprovar ao menos uma rule

1. Volte à sessão de instalação do Passo 2. Se ela foi fechada, abra o agente de novo na pasta-mãe e envie o mesmo gatilho: a skill retoma de onde parou.

1. A skill vai oferecer os demais documentos, um a um. Valide, ajuste ou dispense cada um. Dispensar também é uma decisão, e fica registrada com o motivo em `runs/<projeto>/DECISIONS.md`.

1. Quando chegarem as **rules candidatas**, escolha **pelo menos uma** que faça sentido para o projeto. Leia o rascunho, ajuste o escopo se precisar e aprove.

1. Ao final, a skill faz a verificação da instalação. Leia o resumo.

   > ❕ **Importante:** se você quiser incluir algo além do proposto (um servidor MCP, por exemplo), peça **agora**, durante a sessão de instalação. A skill não fica no projeto depois.

1. Faça o commit na `main`, incluindo `runs/`, e envie (push):

   ```bash
   git add .
   git commit -m "Passo 3: rules"
   git push
   ```

1. Aguarde a verificação nesta issue.
