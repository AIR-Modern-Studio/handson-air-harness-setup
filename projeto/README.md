# 4Devs MCP Server

[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

Um servidor MCP (Model Context Protocol) que integra com a API 4Devs para geração de documentos e dados brasileiros válidos para testes e desenvolvimento.

## 📋 Visão Geral

O 4Devs MCP Server fornece acesso programático à API 4Devs através do protocolo MCP, permitindo que assistentes de IA e outras ferramentas gerem dados brasileiros realistas incluindo:

- **Dados Pessoais Completos**: Nome, idade, documentos, endereço, contatos
- **Documentos Brasileiros Válidos**: CPF, RG, CNH, PIS, Certidões, Título de Eleitor
- **Dados Geográficos**: Estados e cidades brasileiras com códigos válidos
- **Geração em Lote**: Até 30 registros por requisição
- **Customização Avançada**: Controle de gênero, idade, localização e formatação

## ✨ Ferramentas Disponíveis

### 1. 🧑 gerar_pessoa

Gera dados completos de pessoas brasileiras com documentos válidos.

**Características:**

- Geração de 1 a 30 pessoas por requisição
- Documentos com formatação customizável (com/sem pontuação)
- Filtros por gênero, idade e localização
- Dados completos: nome, CPF, RG, endereço, contatos, características físicas

**Casos de Uso:**

- Testes de sistemas de cadastro
- População de bancos de dados de desenvolvimento
- Validação de formulários
- Demonstrações de produtos

### 2. 🏙️ carregar_cidades

Lista todas as cidades de um estado brasileiro com seus códigos.

**Características:**

- Retorna código e nome de cada cidade
- Suporta todos os 27 estados brasileiros
- Dados atualizados e validados

**Casos de Uso:**

- Preenchimento de dropdowns de cidades
- Validação de endereços
- Integração com sistemas de logística

### 3. 📜 gerador_certidao

Gera números válidos de certidões brasileiras.

**Tipos Suportados:**

- Certidão de Nascimento
- Certidão de Casamento
- Certidão de Casamento Religioso
- Certidão de Óbito

**Casos de Uso:**

- Testes de sistemas cartoriais
- Validação de documentos
- Simulação de processos legais

### 4. 🚗 gerar_cnh

Gera números válidos de CNH (Carteira Nacional de Habilitação).

**Características:**

- Números com dígitos verificadores corretos
- Formato padrão brasileiro

**Casos de Uso:**

- Testes de sistemas de trânsito
- Validação de habilitação
- Sistemas de locação de veículos

### 5. 💼 gerar_pis

Gera números válidos de PIS/PASEP/NIS.

**Características:**

- Números com dígitos verificadores corretos
- Formatação customizável (com/sem pontuação)

**Casos de Uso:**

- Testes de sistemas de RH
- Validação de folha de pagamento
- Sistemas previdenciários

### 6. 🗳️ gerar_titulo_eleitor

Gera números válidos de Título de Eleitor.

**Características:**

- Números específicos por estado ou aleatórios
- Formato padrão da Justiça Eleitoral

**Casos de Uso:**

- Testes de sistemas eleitorais
- Validação de cadastro eleitoral
- Sistemas de identificação civil

## 🚀 Instalação

### Método 1: NPM Package (Recomendado para Desenvolvimento)

#### Pré-requisitos

- Node.js 22 ou superior
- npm ou yarn

#### Passos de Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/4devs-mcp-server.git
cd 4devs-mcp-server

# Instale as dependências
npm install

# Compile o projeto
npm run build
```

#### Configuração no Claude Desktop

Adicione ao arquivo de configuração do Claude Desktop:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "4devs": {
      "command": "node",
      "args": ["/caminho/completo/para/4devs-mcp-server/build/index.js"]
    }
  }
}
```

### Método 2: Docker (Recomendado para Produção)

#### Pré-requisitos

- Docker 20.10 ou superior
- Docker Compose (opcional)

#### Build da Imagem Docker

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/4devs-mcp-server.git
cd 4devs-mcp-server

# Build da imagem
docker build -t 4devs-mcp-server .
```

#### Executar com Docker

```bash
# Executar o container
docker run -i --rm 4devs-mcp-server
```

#### Configuração no Claude Desktop (Docker)

```json
{
  "mcpServers": {
    "4devs": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "4devs-mcp-server"]
    }
  }
}
```

#### Docker Compose (Opcional)

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  4devs-mcp-server:
    build: .
    image: 4devs-mcp-server
    stdin_open: true
    tty: true
```

Execute com:

```bash
docker-compose up
```

## ⚙️ Configuração Avançada

### Variáveis de Ambiente

O servidor suporta as seguintes variáveis de ambiente:

```bash
# Nível de log (opcional)
LOG_LEVEL=info  # debug, info, warn, error

# Timeout de requisições (opcional, em ms)
REQUEST_TIMEOUT=30000
```

### Configuração com Variáveis de Ambiente

**NPM/Node.js:**

```json
{
  "mcpServers": {
    "4devs": {
      "command": "node",
      "args": ["/caminho/para/build/index.js"],
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

**Docker:**

```json
{
  "mcpServers": {
    "4devs": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "LOG_LEVEL=debug", "4devs-mcp-server"]
    }
  }
}
```

### Uso atrás de Proxy Corporativo (Inspeção TLS)

O servidor verifica o certificado TLS da API 4Devs (comportamento padrão do Node.js). Em redes com proxy que inspeciona TLS, o proxy reassina o tráfego com a CA corporativa, e as chamadas falham com um erro como `SELF_SIGNED_CERT_IN_CHAIN` ou `unable to get local issuer certificate`.

Clientes MCP costumam iniciar o servidor com um ambiente reduzido. Por isso, mesmo que `NODE_EXTRA_CA_CERTS` já esteja definida no seu terminal, declare-a no `env` da configuração do servidor.

A solução é fazer o Node.js confiar na CA corporativa. Peça o certificado da CA (formato PEM) à equipe de infraestrutura e use uma das opções abaixo.

**NPM/Node.js:** aponte `NODE_EXTRA_CA_CERTS` para o arquivo PEM no `env` da configuração do servidor no cliente MCP:

```json
{
  "mcpServers": {
    "4devs": {
      "command": "node",
      "args": ["/caminho/para/build/index.js"],
      "env": {
        "NODE_EXTRA_CA_CERTS": "/caminho/para/ca-corporativa.pem"
      }
    }
  }
}
```

Se a CA corporativa já estiver instalada no repositório de certificados do sistema operacional, use `"NODE_USE_SYSTEM_CA": "1"` no lugar de `NODE_EXTRA_CA_CERTS`. Essa variável existe a partir do Node.js 22.19.0 (e 24.6.0).

**Docker:** monte o PEM no container e passe `NODE_EXTRA_CA_CERTS` apontando para ele:

```json
{
  "mcpServers": {
    "4devs": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-v", "/caminho/para/ca-corporativa.pem:/certs/ca-corporativa.pem:ro",
        "-e", "NODE_EXTRA_CA_CERTS=/certs/ca-corporativa.pem",
        "4devs-mcp-server"
      ]
    }
  }
}
```

O container roda como o usuário `node` (uid 1000), então o arquivo PEM montado precisa ter permissão de leitura para esse usuário (por exemplo, `chmod 644`).

> ⚠️ **Não use `NODE_TLS_REJECT_UNAUTHORIZED=0`.** Essa variável desliga a verificação de certificados de todas as conexões do processo e expõe o tráfego a interceptação. Ela não é uma alternativa aceitável à configuração da CA.

## 📖 Guia de Uso Detalhado

### 1. Gerar Pessoa

Gera dados completos de uma ou mais pessoas brasileiras.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Valores | Descrição |
|-----------|------|-------------|---------|-----------|
| `sexo` | string | Sim | "H", "M", "I" | H=Homem, M=Mulher, I=Indiferente |
| `txt_qtde` | number | Sim | 1-30 | Quantidade de pessoas |
| `pontuacao` | string | Não | "S", "N" | Incluir pontuação nos documentos |
| `idade` | number | Não | 0-120 | Idade específica (0=aleatória) |
| `cep_estado` | string | Não | UF | Sigla do estado (ex: "SP") |
| `cep_cidade` | number | Não | código | Código da cidade (via carregar_cidades) |

**Exemplo Básico:**

```json
{
  "name": "gerar_pessoa",
  "arguments": {
    "sexo": "I",
    "txt_qtde": 1
  }
}
```

**Exemplo Avançado (Pessoa de Florianópolis, SC, 25 anos):**

```json
{
  "name": "gerar_pessoa",
  "arguments": {
    "sexo": "M",
    "txt_qtde": 1,
    "pontuacao": "S",
    "idade": 25,
    "cep_estado": "SC",
    "cep_cidade": 8349
  }
}
```

**Resposta:**

```json
[
  {
    "nome": "Maria Silva Santos",
    "idade": 25,
    "cpf": "123.456.789-00",
    "rg": "12.345.678-9",
    "data_nasc": "15/03/1999",
    "sexo": "Feminino",
    "signo": "Peixes",
    "mae": "Ana Silva",
    "pai": "José Santos",
    "email": "maria.silva@example.com",
    "senha": "abc123XYZ",
    "cep": "88000-000",
    "endereco": "Rua das Flores 123",
    "numero": 456,
    "bairro": "Centro",
    "cidade": "Florianópolis",
    "estado": "SC",
    "telefone_fixo": "(48) 3234-5678",
    "celular": "(48) 98765-4321",
    "altura": "1,65",
    "peso": 60,
    "tipo_sanguineo": "A+",
    "cor": "azul"
  }
]
```

### 2. Carregar Cidades

Lista todas as cidades de um estado brasileiro.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Valores | Descrição |
|-----------|------|-------------|---------|-----------|
| `cep_estado` | string | Sim | UF | Sigla do estado |

**Estados Suportados:**
AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MS, MT, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO

**Exemplo:**

```json
{
  "name": "carregar_cidades",
  "arguments": {
    "cep_estado": "SC"
  }
}
```

**Resposta:**

```json
{
  "estado": "SC",
  "total_cidades": 295,
  "cidades": [
    {
      "code": 8319,
      "name": "Abdon Batista"
    },
    {
      "code": 8349,
      "name": "Florianópolis"
    },
    {
      "code": 8542,
      "name": "São José"
    }
  ]
}
```

### 3. Gerador de Certidão

Gera números de certidões brasileiras.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Valores | Descrição |
|-----------|------|-------------|---------|-----------|
| `pontuacao` | string | Não | "S", "N" | Incluir pontuação |
| `tipo_certidao` | string | Não | Ver abaixo | Tipo da certidão |

**Tipos de Certidão:**

- `nascimento` - Certidão de Nascimento
- `casamento` - Certidão de Casamento
- `casamento_religioso` - Certidão de Casamento Religioso
- `obito` - Certidão de Óbito
- `Indiferente` - Tipo aleatório (padrão)

**Exemplo:**

```json
{
  "name": "gerador_certidao",
  "arguments": {
    "tipo_certidao": "nascimento",
    "pontuacao": "S"
  }
}
```

**Resposta:**

```json
{
  "tipo_certidao": "nascimento",
  "numero": "123456 01 55 2020 1 12345 678 1234567-89"
}
```

### 4. Gerar CNH

Gera números de CNH (Carteira Nacional de Habilitação).

**Parâmetros:** Nenhum

**Exemplo:**

```json
{
  "name": "gerar_cnh",
  "arguments": {}
}
```

**Resposta:**

```json
{
  "cnh": "12345678901"
}
```

### 5. Gerar PIS

Gera números de PIS (Programa de Integração Social).

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Valores | Descrição |
|-----------|------|-------------|---------|-----------|
| `pontuacao` | string | Não | "S", "N" | Incluir pontuação |

**Exemplo:**

```json
{
  "name": "gerar_pis",
  "arguments": {
    "pontuacao": "S"
  }
}
```

**Resposta:**

```json
{
  "pis": "123.45678.90-1"
}
```

### 6. Gerar Título de Eleitor

Gera números de Título de Eleitor.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Valores | Descrição |
|-----------|------|-------------|---------|-----------|
| `estado` | string | Não | UF | Sigla do estado |

**Exemplo:**

```json
{
  "name": "gerar_titulo_eleitor",
  "arguments": {
    "estado": "SP"
  }
}
```

**Resposta:**

```json
{
  "estado": "SP",
  "titulo_eleitor": "123456789012"
}
```

## 🎯 Exemplos de Uso Prático

### Exemplo 1: Gerar 5 Pessoas de Florianópolis

```javascript
// 1. Primeiro, obter o código de Florianópolis
{
  "name": "carregar_cidades",
  "arguments": {
    "cep_estado": "SC"
  }
}
// Resultado: Florianópolis tem código 8349

// 2. Gerar 5 pessoas de Florianópolis com idade entre 20-30
{
  "name": "gerar_pessoa",
  "arguments": {
    "sexo": "I",
    "txt_qtde": 5,
    "pontuacao": "S",
    "idade": 25,
    "cep_estado": "SC",
    "cep_cidade": 8349
  }
}
```

### Exemplo 2: Gerar Documentos Completos para uma Pessoa

```javascript
// 1. Gerar dados da pessoa
{
  "name": "gerar_pessoa",
  "arguments": {
    "sexo": "M",
    "txt_qtde": 1,
    "pontuacao": "S"
  }
}

// 2. Gerar CNH
{
  "name": "gerar_cnh",
  "arguments": {}
}

// 3. Gerar Certidão de Nascimento
{
  "name": "gerador_certidao",
  "arguments": {
    "tipo_certidao": "nascimento",
    "pontuacao": "S"
  }
}

// 4. Gerar PIS
{
  "name": "gerar_pis",
  "arguments": {
    "pontuacao": "S"
  }
}

// 5. Gerar Título de Eleitor
{
  "name": "gerar_titulo_eleitor",
  "arguments": {
    "estado": "SP"
  }
}
```

### Exemplo 3: Popular Banco de Dados de Teste

```javascript
// Gerar 30 pessoas (máximo por requisição)
{
  "name": "gerar_pessoa",
  "arguments": {
    "sexo": "I",
    "txt_qtde": 30,
    "pontuacao": "N"
  }
}
```

## 🧪 Testes

### Testar Localmente

```bash
# Testes unitários (sem rede; usam uma API 4Devs falsa)
npm test

# Compilar o projeto
npm run build

# Executar script de teste customizado
node test-tools.js
```

### Testar com MCP Inspector

O MCP Inspector é uma ferramenta oficial para testar servidores MCP interativamente.

```bash
# Instalar e executar o Inspector
npm run inspector
```

O Inspector abrirá uma interface web em `http://localhost:6274` onde você pode:

- Listar todas as ferramentas disponíveis
- Testar cada ferramenta com parâmetros customizados
- Ver respostas em tempo real
- Debugar problemas de integração

### Testar com Docker

```bash
# Build da imagem
docker build -t 4devs-mcp-server .

# Testar a imagem
docker run -i --rm 4devs-mcp-server
```

## 🏗️ Estrutura do Projeto

```txt
projeto/
├── src/
│   ├── api/
│   │   ├── client.ts               # Cliente HTTP para API 4Devs
│   │   └── types.ts                # Tipos de request/response da API 4Devs
│   ├── resources/
│   │   └── readme-resource.ts      # Resource MCP com documentação
│   ├── schemas/
│   │   └── tool-schemas.ts         # Schemas Zod para validação
│   ├── tools/
│   │   ├── api-response.ts         # Validação das respostas da API 4Devs
│   │   ├── gerar-pessoa.ts         # Tool: Gerar Pessoa
│   │   ├── carregar-cidades.ts     # Tool: Carregar Cidades
│   │   ├── gerador-certidao.ts     # Tool: Gerador Certidão
│   │   ├── gerar-cnh.ts            # Tool: Gerar CNH
│   │   ├── gerar-pis.ts            # Tool: Gerar PIS
│   │   └── gerar-titulo-eleitor.ts # Tool: Gerar Título Eleitor
│   ├── server.ts                   # Implementação do servidor MCP
│   └── index.ts                    # Ponto de entrada
├── test/                           # Testes unitários (node:test)
│   └── helpers/fake-api.ts         # API 4Devs falsa para os testes
├── build/                          # Código compilado (gerado)
├── build-test/                     # Testes compilados (gerado)
├── node_modules/                   # Dependências (gerado)
├── test-tools.js                   # Testes de integração das tools (requer build; chama a API real)
├── Dockerfile                      # Configuração Docker
├── .dockerignore                   # Arquivos ignorados no Docker
├── .gitignore                      # Arquivos ignorados no Git
├── package.json                    # Configuração npm
├── package-lock.json               # Versões travadas das dependências (usado pelo npm ci)
├── tsconfig.json                   # Configuração TypeScript
├── tsconfig.test.json              # Configuração TypeScript dos testes
└── README.md                       # Esta documentação
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Compilar o projeto
npm run build

# Iniciar o servidor (após compilar)
npm start

# Modo desenvolvimento com watch
npm run dev

# Abrir MCP Inspector
npm run inspector

# Limpar arquivos compilados
npm run clean
```

O `npm run dev` reinicia o servidor a cada arquivo salvo em `src/`. A cada reinício, o cliente MCP conectado perde a sessão e o Node escreve `Restarting ...` no stdout. Para usar com um cliente MCP (Inspector, Claude Desktop), compile com `npm run build` e configure o cliente para rodar `node build/index.js`: o `npm start` também escreve o banner do npm no stdout.

### Adicionar Nova Ferramenta

1. **Criar arquivo da ferramenta** em `src/tools/`:

```typescript
import { FourDevsClient } from '../api/client.js';
import { z } from 'zod';

export const minhaNovaFerramenta = {
  name: 'minha_nova_ferramenta',
  description: 'Descrição da ferramenta',
  inputSchema: {
    type: 'object',
    properties: {
      parametro: {
        type: 'string',
        description: 'Descrição do parâmetro'
      }
    },
    required: ['parametro']
  },
  
  async execute(client: FourDevsClient, args: any) {
    // Implementação
    const result = await client.request({
      acao: 'minha_acao',
      ...args
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
};
```

2. **Adicionar schema Zod** em `src/schemas/tool-schemas.ts`:

```typescript
export const minhaNovaFerramentaSchema = z.object({
  parametro: z.string()
});
```

3. **Registrar no servidor** em `src/server.ts`:

```typescript
import { minhaNovaFerramenta } from './tools/minha-nova-ferramenta.js';

// No método setupHandlers(), adicionar:
case minhaNovaFerramenta.name:
  return await minhaNovaFerramenta.execute(this.client, request.params.arguments);
```

### Contribuir com o Projeto

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📚 Referências

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [4Devs API](https://www.4devs.com.br/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github) - Referência de implementação

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## ⚠️ Avisos

- Este servidor é destinado apenas para fins de teste e desenvolvimento
- Os dados gerados são fictícios mas seguem formatos válidos brasileiros
- Não use dados gerados para fins fraudulentos ou ilegais
- A API 4Devs é um serviço de terceiros e pode ter limitações de uso

## 🐛 Problemas Conhecidos

- A API 4Devs pode retornar tipos de resposta variados (string ou objeto) para alguns endpoints
- Certifique-se de usar `responseType: 'text'` para endpoints de documentos para evitar conversão para notação científica

## 📞 Suporte

Para problemas ou dúvidas:

- Abra uma issue no GitHub
- Consulte a documentação do MCP
- Verifique a documentação da API 4Devs

## 🎉 Agradecimentos

- [4Devs](https://www.4devs.com.br/) pela API pública de geração de dados brasileiros
- [Anthropic](https://www.anthropic.com/) pelo Model Context Protocol
- Comunidade open source por ferramentas e bibliotecas utilizadas
