## Passo 1: Montar a pasta-mãe

Este repositório já está organizado do jeito que o AI/R Harness Setup trabalha: **a raiz do repositório é a pasta-mãe**, e o código do projeto está em `{{ code_dir }}/`. Neste passo você baixa o pacote do agente que vai usar e coloca ao lado do código.

### 📖 O que é o AI/R Harness Setup

O Outer Harness é o conjunto de documentos que orienta o agente dentro de um projeto: o `AGENTS.md` (a espinha), as rules e os demais documentos. O pacote do AI/R Harness Setup traz a matéria-prima desses documentos e a skill `air-harness-setup`, que conduz a instalação com você.

Três ideias guiam o exercício:

- **Nada é copiado.** O pacote traz templates e exemplos. A skill gera cada documento sob medida para o projeto, mostra para você, e só grava depois que você valida.
- **O pacote fica ao lado do código, nunca dentro.** Ele vive na pasta-mãe; o que vai para o projeto é só o que você aprovou.
- **Você escolhe o agente.** Existe um pacote por agente (Claude Code, Kiro, GitHub Copilot, AI/C Reasoning) e por idioma. A partir do pacote que você colocar aqui, eu identifico qual você está usando.

> [!TIP]
> A página do AI/R Harness Setup no site AI Champions tem os downloads e os guias de apoio:
> https://airportal.sharepoint.com/sites/ai-adoption/ai-champions/SitePages/AIR-Harness-Setup.aspx

### ⌨️ Atividade: Clonar o repositório

1. Clone a sua cópia do exercício na sua máquina:

   ```bash
   git clone https://github.com/{{ full_repo_name }}.git
   ```

1. Abra a pasta clonada e observe a estrutura. A pasta clonada é a pasta-mãe:

   ```text
   {{ repo_name }}/   ← pasta-mãe (raiz do repositório)
   └── {{ code_dir }}/                 ← código do projeto
   ```

1. Dê uma olhada em `{{ code_dir }}/` para conhecer o projeto. Ele ainda não tem harness nenhum.

### ⌨️ Atividade: Baixar e extrair o pacote

1. Na página do Outer Harness, baixe o zip do **agente que você vai usar**, no **idioma** que preferir.

1. Extraia o zip **na raiz do repositório**, ao lado de `{{ code_dir }}/`. O zip já traz a pasta `air-harness-<agente>-<idioma>/`: extraia direto na raiz, sem criar outra pasta em volta (no Windows, em **Extrair tudo**, aponte o destino para a raiz do repositório). Não renomeie a pasta: o nome dela identifica o agente e o idioma.

   ```text
   {{ repo_name }}/
   ├── air-harness-<agente>-<idioma>/   ← pacote (ao lado)
   │   ├── guides/
   │   └── harness/
   └── {{ code_dir }}/                    ← código
   ```

   > ❕ **Importante:** use um pacote só. Se extraiu dois, apague o que não vai usar.

1. Faça o commit da pasta do pacote na branch `main` e envie (push):

   ```bash
   git add .
   git commit -m "Passo 1: pacote do AI/R Harness Setup"
   git push
   ```

1. Aguarde alguns segundos e atualize esta issue. Eu confiro o pacote e posto o Passo 2 já com as instruções do seu agente.
