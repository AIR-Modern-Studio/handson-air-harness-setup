## Passo 6: Usar o harness numa tarefa real

O harness está instalado. Agora é um dia normal de trabalho: você pede uma tarefa ao agente e observa o que muda porque ele leu o que vocês escreveram. Quando ele acertar, é o harness funcionando. Quando errar, é um **achado**, e o ajuste vai para o documento, não só para o código.

### 📖 Conheça o projeto: 4devs-mcp-server

O `{{ code_dir }}/` é um **servidor MCP** (Model Context Protocol) escrito em TypeScript/Node. Ele dá a assistentes de IA ferramentas para gerar **dados brasileiros fictícios para teste**: pessoas, CPF, RG, CNH, PIS, certidões, título de eleitor. Por baixo, cada ferramenta chama o site [4Devs](https://www.4devs.com.br/).

```text
Cliente MCP (Claude, Copilot, Kiro…)
      │  stdio: mensagens JSON-RPC pelo stdin/stdout
      ▼
4devs-mcp-server   src/index.ts → src/server.ts → src/tools/*.ts → src/api/client.ts
      │  HTTPS
      ▼
www.4devs.com.br
```

O `server.ts` recebe o pedido e chama a tool. A tool valida os parâmetros com Zod e usa o `client.ts` para falar com o 4Devs.

| Tool | O que gera |
| --- | --- |
| `gerar_pessoa` | De 1 a 30 pessoas completas: nome, CPF, RG, endereço, contatos |
| `carregar_cidades` | As cidades de uma UF, com o código que o `gerar_pessoa` aceita |
| `gerador_certidao` | Número de certidão de nascimento, casamento ou óbito |
| `gerar_cnh` | Número de CNH |
| `gerar_pis` | Número de PIS/NIS/PASEP |
| `gerar_titulo_eleitor` | Número de título de eleitor, opcionalmente de uma UF |

Além das tools, o servidor expõe o próprio README como resource (`readme://documentation`), para o assistente consultar.

| Para | Comando |
| --- | --- |
| Instalar as dependências exatamente como estão no lockfile | `npm ci` |
| Compilar `src/` para `build/` | `npm run build` |
| Rodar os testes unitários | `npm test`: usa uma API 4Devs falsa, sem rede |
| Testar as tools de ponta a ponta | `node test-tools.js`: precisa do build e chama o 4Devs de verdade |
| Abrir o servidor no MCP Inspector | `npm run inspector` |

O projeto tem dois tipos de teste:

- `npm test`: testes unitários com uma API 4Devs falsa. São rápidos, não usam rede e cobrem validação e respostas de erro.
- `node test-tools.js`: o único teste ponta a ponta. Ele sobe o servidor compilado (`build/index.js`), conversa com ele por stdio como um cliente MCP de verdade e chama o 4Devs real, uma vez para cada tool. Só ele pega problemas de integração: transporte, cliente HTTP, certificado TLS e o formato real das respostas. Como depende da rede, não roda no CI.

### 📖 A tarefa: dois problemas reais, nesta ordem

**A. Primeiro, a rede de proteção: o `test-tools.js` mente.** Rode o teste e repare no que acontece: cada caso fica parado uns 15 segundos, o log mostra `⏱️ Test timed out` e logo depois `✅ Test passed!`, e o resumo final diz `Passed: 0/6`. Um teste em que não dá para confiar não protege nada.

**B. Depois, a mudança arriscada: dependências vulneráveis.** O `npm audit` aponta vulnerabilidades de severidade alta e crítica. Parte delas está em dependências diretas (`@modelcontextprotocol/sdk` e `axios`) e parte em dependências delas. Corrigir significa atualizar pacotes, e atualizar pacotes pode quebrar o servidor.

> ❕ **Por que nesta ordem:** atualizar dependências sem um teste confiável é apostar. Com o `test-tools.js` consertado, a Tarefa B tem como provar que nada quebrou.

### 📖 Onde o harness entra

O agente começa cada sessão sabendo só o que o harness diz a ele. Sem os comandos exatos, ele chuta o runner e perde minutos a cada tentativa. Sem saber o que não pode quebrar, ele descobre do pior jeito. Estes são os pontos da tarefa em que o harness pode fazer diferença:

| O que a tarefa exige do agente | O que o harness pode ter dito | Onde costuma estar |
| --- | --- | --- |
| Usar os comandos certos e compilar antes de testar | `npm ci`, `npm run build`, `node test-tools.js` | `AGENTS.md` → **Commands** |
| Saber que o teste depende do 4Devs e pode falhar por rede | "o `test-tools.js` chama a API real e precisa do build" | `AGENTS.md` → **Testing** |
| Não quebrar o protocolo ao mexer em logs | "o stdout é o canal do MCP; log só com `console.error`" | `AGENTS.md` → **Gotchas**, ou uma rule de área |
| Atualizar dependências com segurança | lockfile versionado, `npm ci`, nada de `--force`, versão major só com aprovação | `AGENTS.md` → **Security**, ou a constitution |

O seu harness é o que **você** aprovou nos Passos 2 a 5, então ele pode não ter tudo isso. Se o agente tropeçar num ponto que o harness não cobre, isso é um achado, e é exatamente o que a última atividade usa.

### ⌨️ Atividade: Abrir uma sessão de trabalho

Nos Passos 2 a 5 você trabalhou na pasta-mãe, com a skill de instalação. Agora é o contrário: uma sessão de trabalho normal, **dentro de `{{ code_dir }}/`**, que é onde o harness foi instalado e de onde o agente o carrega. A skill de instalação não entra aqui.

1. Abra o {{ agent_label | default("seu agente", true) }} dentro de `{{ code_dir }}/`:

   {{ work_hint | safe }}

### ⌨️ Atividade: Tarefa A, consertar o `test-tools.js`

1. Envie ao agente:

   ```text
   O test-tools.js deveria validar as 6 tools do servidor, mas o resultado não é confiável: o log mostra "Test passed" e o resumo final diz 0/6. Descubra a causa, corrija o script para que ele aprove quando a tool responde certo e reprove quando ela devolve erro, e rode de novo para me mostrar o resumo.
   ```

1. Acompanhe e anote o que observar:
   - O agente compilou antes de rodar o teste, com os comandos que estão na espinha?
   - Ele explicou a causa antes de sair editando?
   - Se mexeu em logs, manteve tudo fora do stdout?
   - Onde ele hesitou, chutou um comando ou precisou da sua correção?

1. Considere pronto quando:
   - cada caso termina em poucos segundos, sem esperar o timeout;
   - o resumo bate com o que o log mostra;
   - uma chamada que a tool rejeita (por exemplo, `gerar_pessoa` com `txt_qtde: 0`) conta como falha, não como sucesso;
   - o script sai com código 0 só quando todos os casos passam.

   > ❕ **Se os casos falharem com `unable to get local issuer certificate` ou `SELF_SIGNED_CERT_IN_CHAIN`:** o problema não é o script. O servidor verifica o certificado TLS do 4Devs e, atrás de um proxy corporativo com inspeção TLS, o Node precisa confiar na CA da empresa. Veja a seção "Uso atrás de Proxy Corporativo (Inspeção TLS)" do `{{ code_dir }}/README.md`. Não desligue a verificação.

<details>
<summary>Travou? Veja as causas</summary><br/>

- O servidor MCP nunca termina sozinho: o script não fecha o stdin dele. O timeout de 15 s dispara antes, mata o processo e marca o caso como falha. Só depois disso o evento `close` lê a resposta e imprime "Test passed", tarde demais.
- Uma tool que falha não devolve erro JSON-RPC: devolve um `result` com `isError: true`. O script trata qualquer `result` como sucesso.
- Depois do `initialize`, o cliente deveria enviar a notificação `notifications/initialized`, e o script não envia.

</details>

### ⌨️ Atividade: Tarefa B, eliminar as dependências vulneráveis

1. Envie ao agente:

   ```text
   O npm audit aponta vulnerabilidades de severidade alta e crítica neste projeto. Atualize as dependências para eliminá-las, sem trocar versão major sem me consultar. Antes de terminar, rode o build e o test-tools.js para provar que nada quebrou, e me mostre o npm audit de antes e de depois.
   ```

1. Acompanhe e anote o que observar:
   - O `package-lock.json` foi atualizado junto com as dependências?
   - O agente evitou atalhos como `npm audit fix --force`?
   - Ele usou o teste da Tarefa A como prova?
   - Ele separou o que vem de dependência direta do que vem de dependência transitiva?

1. Considere pronto quando:
   - `npm audit --audit-level=high` termina sem erro;
   - `npm run build` e `node test-tools.js` passam.

   > ❕ **Importante:** se sobrar alguma vulnerabilidade sem correção publicada, não force. Registre o motivo na mensagem do commit.

### 📖 Fechar o ciclo: o erro vira documento

Quando o agente erra, há duas reações possíveis. A primeira é corrigir o resultado, e ela resolve o caso de hoje. A segunda é corrigir o que produziu o resultado, o harness. Só a segunda evita que o mesmo erro volte na próxima sessão.

Para cada achado, o caminho tem três passos:

1. **Classificar.** O time já sabe qual é o comportamento certo? Se sabe, o problema é do harness, que deveria ter guiado o agente. Se ninguém nunca decidiu, primeiro é preciso decidir: nenhuma rule garante uma decisão que não foi tomada.
1. **Rotear.** Escolha o documento que muda:

   | O achado | Onde ajustar |
   | --- | --- |
   | O agente quebrou uma convenção que seguiria se soubesse dela | A rule de área daquele caminho; se a convenção vale para o projeto inteiro, a espinha |
   | Ele refez um procedimento de vários passos, às vezes errado | Um playbook |
   | Cruzou algo inegociável, como segurança ou dados pessoais | A constitution, mais uma linha no contrato de review |
   | Não achou um comando ou um caminho | A espinha (`AGENTS.md`) |
   | Um defeito que uma máquina detectaria | Um check automático no CI, a camada de **sensores**, que vem depois dos guias |

   O `npm audit` que a verificação deste passo roda no CI é um exemplo de sensor: ele pega a vulnerabilidade sem depender de alguém lembrar.

   Um exemplo de algo inegociável: diante de um erro de certificado, o agente propõe desligar a verificação TLS (`NODE_TLS_REJECT_UNAUTHORIZED=0` ou `rejectUnauthorized: false`) em vez de confiar na CA da empresa. O comportamento certo já está decidido, porque o README do projeto proíbe esse atalho. O ajuste vai para a constitution, mais uma linha no contrato de review.

1. **Alterar e verificar.** Edite em vez de acrescentar: uma segunda rule sobre o mesmo assunto deixa o agente com duas respostas. Antes de gravar uma linha nova, pergunte: o agente erraria sem ela? Se não erraria, ela não entra.

### ⌨️ Atividade: Ajustar o harness

1. Escolha **um** achado das duas tarefas: um ponto em que o agente errou, hesitou, chutou um comando ou fez diferente do que o time faria.

1. Descreva o achado ao próprio agente da sessão de trabalho e peça que ele proponha a mudança no documento certo. Ele mostra, você valida, ele escreve. Quem decide o texto é você.

1. Ajuste um documento do harness que **já existe**: o `{{ code_dir }}/AGENTS.md`, uma rule `air-*` ou outro documento instalado. Preserve o frontmatter que faz a rule carregar, como `paths`, `applyTo` ou `fileMatchPattern`. Se o achado pedir um documento novo, como um playbook, crie-o e acrescente na espinha o ponteiro para ele, dizendo quando usá-lo.

   > [!TIP]
   > Quer comprovar o ajuste? Peça a mesma coisa numa sessão nova e veja se o agente acerta de primeira. É opcional.

### ⌨️ Atividade: Enviar

1. Envie a Tarefa A, a Tarefa B e o ajuste no harness. Pode fazer quantos commits e pushes quiser: a cada push eu confiro tudo o que você fez desde o início do passo.

   ```bash
   git add .
   git commit -m "Passo 6: test-tools, dependências e ajuste no harness"
   git push
   ```

1. A verificação confere quatro coisas:
   - houve mudança no código do projeto;
   - `test-tools.js` e `package-lock.json` foram alterados neste passo;
   - o `npm audit` não encontra vulnerabilidade alta ou crítica que já tenha correção disponível;
   - um documento do harness que já estava instalado foi ajustado.

1. Aguarde a revisão final nesta issue.
