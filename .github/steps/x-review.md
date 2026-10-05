## Revisão

Você configurou um Outer Harness do começo ao fim com o **{{ agent_label | default("seu agente", true) }}**:

- ✅ Montou a pasta-mãe com o pacote ao lado do código.
- ✅ Gerou e validou o `AGENTS.md`, a espinha que o agente lê em toda conversa.
- ✅ Aprovou rules sob medida, com escopo, sem copiar nada do pacote.
- ✅ Usou o harness numa tarefa real e devolveu o aprendizado para o documento.

### O que fica no projeto e o que não fica

- **Fica:** só o que você aprovou, dentro de `{{ code_dir }}/`.
- **Não fica:** o pacote, a skill e a pasta `runs/`. Num projeto real, o pacote mora na pasta-mãe e não entra no repositório do projeto (aqui ele entrou só para o exercício ser verificado).
- **Nunca é tocado na instalação:** a configuração de MCP do projeto.

### O que vem a seguir?

**Use em seu projeto.** O mesmo pacote serve para outros projetos da mesma pasta-mãe: extraia ao lado, abra o agente na pasta-mãe e envie o gatilho com a pasta do projeto.

- [Página do Outer Harness no site AI Champions](https://airportal.sharepoint.com/sites/ai-adoption/ai-champions/SitePages/Outer-Harness.aspx): downloads e guias de apoio.
