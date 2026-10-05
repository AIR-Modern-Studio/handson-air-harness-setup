# AI/R Harness Setup

_Configurando um Outer Harness na prática._

O agente de código começa cada conversa sabendo só o que os documentos do projeto dizem a ele. Se ninguém escreveu os comandos, as convenções e o que não se pode tocar, ele adivinha, e você corrige o mesmo erro na semana seguinte.

Neste hands-on você muda isso: instala o **AI/R Harness Setup** num projeto, valida cada documento e vê o agente seguir o que vocês escreveram.

## Conheça o AI/R Harness Setup

O AI/R Harness Setup é o conjunto de arquivos de instrução que orienta o agente de código dentro do seu projeto: a espinha (`AGENTS.md`), as rules por área, os playbooks e a estação de review. Você não escreve do zero e não copia nada pronto. O próprio agente monta cada arquivo para o seu projeto, numa sessão de instalação feita junto com você.

- 🔍 **Parte do que o projeto já tem.** O agente lê o README, os manifests, o CI e a documentação que você indicar, e pergunta só o que falta. "Não sei" também é resposta: vira uma lacuna marcada.
- ✍️ **Sob medida, nunca copiado.** O pacote traz a forma de cada documento e um exemplo fictício como referência. O texto é escrito para o seu projeto.
- ✅ **Você aprova tudo.** Cada documento chega como rascunho e só é gravado depois do seu sim. Nada do que o projeto já tem é sobrescrito.
- 🤖 **Funciona com o agente que você já usa:** Claude Code, Kiro, GitHub Copilot ou AI/C Reasoning, com as instruções em português ou inglês.

<p align="center">
  <img src=".github/images/architecture-of-trust.png" alt="Diagrama Architecture of Trust: o harness de um agente dividido em guides (orientação antes de agir), sensores (verificação depois de agir) e o modelo ao centro." width="800" />
</p>
<p align="center"><sub>O AI/R Harness Setup cobre a camada de <em>guides</em> do Outer Harness: orienta o agente antes de ele agir. Sensores e gates, que verificam depois, são a camada seguinte.</sub></p>

## O que você leva deste hands-on

- **Um `AGENTS.md` com a cara do projeto.** É a espinha que o agente lê em toda conversa: comandos, convenções, segurança e armadilhas conhecidas.
- **Rules sob medida.** O agente só as carrega quando o assunto aparece, seja uma área do código ou um tipo de tarefa.
- **O loop de feedback.** Quando o agente erra, você ajusta o documento, e não só o código, para o erro não voltar.
- **Um roteiro para repetir no seu squad.** O mesmo pacote serve para os outros projetos.

## Como funciona

1. **Montar a pasta-mãe.** Baixe o pacote do seu agente e extraia ao lado do código, nunca dentro.
1. **Gerar a espinha.** O agente entrevista você e propõe o `AGENTS.md`. Você ajusta e aprova.
1. **Aprovar rules.** Escolha pelo menos uma das rules candidatas e valide.
1. **Usar e ajustar.** Faça uma tarefa real com o agente e leve o que aprendeu de volta ao documento.

Cada passo chega numa issue do seu repositório. A cada push na `main`, uma verificação automática responde nessa issue e libera o passo seguinte. Você faz no seu ritmo.

## Antes de começar

- **Para quem é:** AI Champions e desenvolvedores que vão levar o AI/R Harness Setup aos projetos dos seus squads.
- **Você vai precisar de:** Git, uma conta GitHub com acesso à organização AIR-Modern-Studio, acesso à [página do AI/R Harness Setup](https://airportal.sharepoint.com/sites/ai-adoption/ai-champions/SitePages/AIR-Harness-Setup.aspx) no site AI Champions (é de lá que vem o pacote) e um dos quatro agentes instalado.
- **Onde:** na sua máquina, com o repositório clonado.

## Comece agora

Copie o exercício para a sua conta como repositório **privado**, espere **uns 20 segundos** e **atualize a página**. As instruções vão aparecer numa issue do seu repositório.

[![](https://img.shields.io/badge/Copiar%20Exerc%C3%ADcio-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/new?template_owner=AIR-Modern-Studio&template_name=handson-air-harness-setup&owner=%40me&name=handson-air-harness-setup&description=Exerc%C3%ADcio:+AI/R+Harness+Setup&visibility=private)

<details>
<summary>Está com problemas?</summary><br/>

- Crie a cópia como **privada**: o projeto-base é interno.
- Se a issue não aparecer em 20 segundos, abra a aba [Actions](../../actions) e veja se o job ainda está rodando.
- Se um job falhou, avise quem está conduzindo o hands-on.

</details>
