## 🏁 Você chegou ao fim!

Pode comemorar: você configurou um Outer Harness do começo ao fim com o **{{ agent_label | default("seu agente", true) }}**. A partir de agora, o agente não começa mais do zero em `{{ code_dir }}/`. Ele abre cada conversa sabendo o que vocês decidiram, porque cada linha passou pela sua aprovação.

### 🏆 O que você construiu

- ✅ **Montou a pasta-mãe**, com o pacote ao lado do código.
- ✅ **Gerou e validou o `AGENTS.md`**, a espinha que o agente lê em toda conversa.
- ✅ **Decidiu os demais documentos** (constitution, review, arquitetura…), aprovando só o que fazia sentido.
- ✅ **Aprovou rules sob medida**, com escopo, sem copiar nada do pacote.
- ✅ **Fechou a instalação** com a espinha revisada, a verificação independente e a entrega.
- ✅ **Pôs o harness para trabalhar numa tarefa real:** com o agente, deixou o `test-tools.js` confiável, eliminou as vulnerabilidades altas e críticas e devolveu o aprendizado para um documento do harness.

### ✨ O que muda no seu dia a dia

| Antes | Agora |
| --- | --- |
| Toda conversa começava com você explicando comandos e convenções | O agente lê isso na espinha, sem você repetir |
| O agente chutava o que não sabia e descobria do pior jeito | Ele segue o que vocês decidiram, e o que ninguém sabia virou lacuna marcada |
| Você corrigia o mesmo erro na semana seguinte | O erro vira uma linha no documento, e a próxima sessão já começa sabendo |

A última linha você já viveu no Passo 6: o achado da tarefa virou ajuste no harness. É esse hábito que faz o harness melhorar com o tempo, um achado de cada vez.

### 📦 O que fica no projeto e o que não fica

- **Fica:** só o que você aprovou, dentro de `{{ code_dir }}/`.
- **Não fica:** o pacote, a skill e a pasta `runs/`. Num projeto real, o pacote mora na pasta-mãe e não entra no repositório do projeto (aqui ele entrou só para o exercício ser verificado).
- **Nunca é tocado na instalação:** a configuração de MCP do projeto.

### 🚀 E agora?

**Leve para os seus projetos quando quiser.** O mesmo pacote serve para outros projetos da mesma pasta-mãe: extraia ao lado, abra o agente na pasta-mãe e envie o gatilho com a pasta do projeto. Cada projeto do squad com harness é menos tempo reexplicando o básico.

- [Página do AI/R Harness Setup no site AI Champions](https://airportal.sharepoint.com/sites/ai-adoption/ai-champions/SitePages/AIR-Harness-Setup.aspx): downloads e guias de apoio.

Bom trabalho! Seu agente agradece, e o você da semana que vem também. 🙌
