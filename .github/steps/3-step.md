## Passo 3: Rules sob medida

O `AGENTS.md` vale para o projeto inteiro. As **rules** valem para uma parte dele: uma área do código (por exemplo, acesso a dados) ou um tipo de tarefa (por exemplo, hotfix). Elas carregam só quando o assunto aparece, o que mantém a espinha enxuta.

### 📖 Rules no {{ agent_label }}

A skill propõe **rules candidatas** a partir do que encontrou no projeto. Você escolhe quais quer e valida **uma a uma**. Nenhuma rule do pacote é gravada direto: os exemplos do pacote servem de forma, e o texto é escrito para o seu projeto.

| Tipo | Onde fica no {{ agent_label }} |
| --- | --- |
| Área do código | {{ rule_area | safe }} |
| Tipo de tarefa | {{ rule_task | safe }} |

### ⌨️ Atividade: Aprovar ao menos uma rule

1. Continue a instalação. Pode ser na mesma sessão do Passo 2 ou numa nova; uma sessão nova começa com o contexto limpo, o que ajuda se a conversa já ficou longa. Numa sessão nova, abra o agente na pasta-mãe e envie a primeira linha do gatilho do Passo 2: a skill lê o registro em `{{ package_dir }}/runs/{{ code_dir }}/` e retoma de onde parou.

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
