<div align="center">

# AI/R Harness Setup

_Configurando um Outer Harness na prática_

Exercício de {{ login }} · no seu ritmo, pode pausar quando quiser

[![](https://img.shields.io/badge/Continuar%20o%20Exerc%C3%ADcio-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)]({{ issue_url }})

</div>

> [!WARNING]
> **Desligue modos de resposta comprimida durante a instalação.** Se você usa uma skill ou modo que encurta as respostas do agente (o Caveman, por exemplo), desligue antes de colar o gatilho (no Caveman, `/caveman off`) e religue ao terminar. A instalação é feita de validações: em cada uma, o chat mostra só um resumo curto e as perguntas em aberto, e é esse texto que você precisa ler inteiro para aprovar. Os documentos já vão para arquivo, então a economia seria pequena, e o risco é perder uma ressalva.

> [!TIP]
> **Voltando depois de um tempo?** O passo em que você parou é sempre o último comentário da [issue do exercício]({{ issue_url }}).

## Do que se trata

O agente de código começa cada conversa sabendo só o que os documentos do projeto dizem a ele. Neste hands-on você instala o **AI/R Harness Setup** no `4devs-mcp-server/`: a skill `air-harness-setup`, rodando no agente que você já usa, lê o projeto, entrevista você e propõe o `AGENTS.md`, os demais documentos e as rules sob medida. Nada é gravado sem a sua aprovação.

## Os 6 passos

| Passo | O que você faz | Resultado |
| --- | --- | --- |
| 1 · Montar a pasta-mãe | Baixa o pacote do seu agente e extrai na raiz do repositório, ao lado do código | `air-harness-<agente>-<idioma>/` |
| 2 · A espinha | A skill lê o projeto, entrevista você e propõe o `AGENTS.md` | `4devs-mcp-server/AGENTS.md` |
| 3 · Os demais documentos | Constitution, review, arquitetura e outros, um por vez: você aprova, ajusta ou dispensa | Decisões em `DECISIONS.md` |
| 4 · Rules sob medida | A skill propõe rules de área e playbooks a partir do projeto | Pelo menos uma rule `air-*` |
| 5 · Fechar a instalação | A skill revisa a espinha, verifica a sessão e mostra o que ficou onde | Andamento registrado em `STATE.md` |
| 6 · Usar o harness | Uma tarefa real com o agente; o que ele errar vira ajuste num documento | Um documento do harness ajustado |

A cada push na `main`, uma verificação automática responde na issue e libera o passo seguinte.

## Como retomar

Do Passo 2 ao 5, a skill conduz a instalação, que pode se estender por várias sessões. O andamento fica em `air-harness-<agente>-<idioma>/runs/4devs-mcp-server/`.

1. Abra o agente na **pasta-mãe**, a raiz deste repositório (não dentro de `4devs-mcp-server/`).
1. Envie a primeira linha do gatilho do Passo 2:

   ```text
   Leia `air-harness-<agente>-<idioma>/harness/skills/air-harness-setup/SKILL.md` e instale o harness no projeto `4devs-mcp-server`.
   ```

1. A skill lê o registro e retoma de onde parou.

<sub>Downloads e guias: [página do AI/R Harness Setup](https://airportal.sharepoint.com/sites/ai-adoption/ai-champions/SitePages/AIR-Harness-Setup.aspx). Se algo travar, veja a aba [Actions](../../actions) ou avise quem está conduzindo o hands-on.</sub>
