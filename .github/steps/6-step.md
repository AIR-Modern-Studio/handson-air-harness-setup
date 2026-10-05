## Passo 6: Usar o harness e fechar o loop

O harness está instalado. Agora você trabalha no projeto como num dia normal e observa o agente seguindo o que vocês escreveram. Quando ele errar, ou deixar passar uma convenção, o ajuste vai **no documento**, não só no código. É assim que o harness melhora com o uso.

### 📖 O loop de feedback

- O agente erra uma vez → você corrige o código **e** pergunta: "que linha do `AGENTS.md` ou de qual rule teria evitado isso?"
- Se a resposta é "nenhuma", falta uma linha. Se existe uma linha e ele não seguiu, ela está ambígua ou no lugar errado.
- O guia "Mexer num documento já instalado", na página do Outer Harness, mostra para onde vai cada tipo de achado.

### ⌨️ Atividade: Uma tarefa no projeto

1. Abra o {{ agent_label | default("seu agente", true) }} **dentro de `{{ code_dir }}/`**. Esta é uma sessão de trabalho normal, não de instalação.

1. Peça ao agente a tarefa abaixo:

   <!-- TODO(projeto-base): descrever a tarefa do hands-on quando o projeto-base estiver definido. -->

   ```text
   <tarefa do hands-on>
   ```

1. Observe a resposta: o agente citou ou seguiu algo do `AGENTS.md` ou da rule que você aprovou? Revise o código gerado.

### ⌨️ Atividade: Ajustar o harness

1. Escolha **um** ponto em que o agente errou, hesitou ou fez diferente do que o time faria.

1. Ajuste o documento que deveria ter evitado isso: o `{{ code_dir }}/AGENTS.md`, uma rule `air-*` ou outro documento do harness que já existe. Pode pedir ao agente para propor a mudança, mas você decide o texto.

1. Faça **um único push** com a tarefa e o ajuste no documento:

   ```bash
   git add .
   git commit -m "Passo 6: tarefa + ajuste no harness"
   git push
   ```

1. Aguarde a revisão final nesta issue.
