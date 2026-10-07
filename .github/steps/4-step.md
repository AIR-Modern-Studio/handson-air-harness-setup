## Passo 4: Rules sob medida

O `AGENTS.md` vale para o projeto inteiro. As **rules** valem para uma parte dele e só entram em cena quando o assunto aparece, o que mantém a espinha enxuta. São a parte mais específica do harness: o pacote não traz rule pronta, só a forma e um exemplo fictício que a skill usa como referência para escrever as suas.

**Objetivo deste passo:** gravar pelo menos uma rule `air-*`, de área ou playbook. Na skill, zero rules também é uma decisão válida; para o exercício avançar, a verificação procura pelo menos uma.

### 📖 Duas famílias de rules

| | Rule de área | Playbook |
| --- | --- | --- |
| O que é | Uma convenção para uma parte do código | Um procedimento com ordem, para um tipo de tarefa |
| Quando entra | Sozinha, quando você trabalha nos caminhos dela | Quando você invoca, de propósito |
| Exemplo | Acesso a dados: limite da transação, o que nunca vai para log | Hotfix: o que fazer primeiro, que verificações manter mesmo com pressa |

A pergunta que separa as duas é **o que faz a rule carregar**. Se é "sempre que alguém mexer nestes caminhos", é rule de área. Se é "quando estivermos fazendo este trabalho", com passos numa ordem que importa, é playbook. Tem passos mas a ordem não importa? É rule de área. Tem ordem mas vale para todo arquivo? Divida.

### 📖 Rules no {{ agent_label }}

| Tipo | Onde fica | Como chega ao agente |
| --- | --- | --- |
| Rule de área | `{{ rule_area_path | safe }}` | {{ rule_area_load | safe }} |
| Playbook | `{{ rule_task_path | safe }}` | {{ rule_task_load | safe }} |

`<nome>` é o assunto da rule, em minúsculas e com hífens, sem o prefixo `air-`. No playbook é também o que você digita para invocá-lo, então vale ser curto e fácil de adivinhar.

### 📖 Como a skill propõe

- **Do projeto, não de uma lista.** Cada candidata nasce de um sinal que a skill viu no projeto ou ouviu na entrevista: uma camada que chega ao dado, um contrato público, dinheiro que precisa fechar, dado pessoal, um passo que o time erra sob pressão, "a coisa que sempre quebra". Sem sinal, sem rule.
- **Primeiro a proposta, depois o rascunho.** Cada candidata chega em poucas linhas: o que cobre, por que cabe aqui (com o sinal nomeado), quão crítica é e quanto custa em contexto a cada sessão. O rascunho só é gerado se você quiser a rule.
- **O que o time já tem fica.** Se já existe uma rule parecida, a skill não mexe nela nem cria uma gêmea: diz se ela basta, que linha acrescentaria ou onde há sobreposição, e você decide.

### 📖 O que olhar no rascunho

- **Uma área só, em frases que o agente consegue seguir.** Rule que passa de umas 40 linhas, ou que vira procedimento, é sinal de que deveria ser playbook.
- **O escopo.** {{ scope_hint | safe }}
- **Nenhum `<...>` sobrando.** Campo do template sem preencher no escopo é um glob que não casa com nada.

### ⌨️ Atividade: Aprovar ao menos uma rule

1. Continue a instalação, na mesma sessão ou numa nova. Se quiser começar uma sessão nova, abra o agente na pasta-mãe e envie o gatilho abaixo:

   ```text
   Leia `{{ package_dir }}/harness/skills/air-harness-setup/SKILL.md` e instale o harness no projeto `{{ code_dir }}`.
   ```

1. Para cada candidata, leia a proposta e decida se quer o rascunho. Recusar já na proposta também é decisão, e fica registrada com o motivo.

   > ❕ **Importante:** as respostas do agente nem sempre são determinísticas. A conversa pode ter alguns passos a mais do que os descritos aqui, como uma pergunta ou uma confirmação extra: responda e siga normalmente.

1. Nas rules que quiser, leia o rascunho, confira o escopo e o nome, peça ajustes e aprove. Nem sempre o agente mostra o rascunho na tela, principalmente no CLI: os arquivos estão em `{{ package_dir }}/runs/{{ code_dir }}/draft/`. Escolha **pelo menos uma**.

1. Quando a skill passar para a espinha revisada e a verificação, avise que vai parar por aqui: o fechamento fica para o Passo 5. Confira que o andamento ficou registrado em `{{ package_dir }}/runs/{{ code_dir }}/STATE.md`. Se a skill seguir direto para a verificação e a entrega, sem dar tempo de parar, tudo bem: commite tudo neste passo. No Passo 5 você confere o resultado e registra a conclusão.

1. Faça o commit na `main`, incluindo `runs/`, e envie (push):

   ```bash
   git add .
   git commit -m "Passo 4: rules"
   git push
   ```

1. Aguarde a verificação nesta issue.
