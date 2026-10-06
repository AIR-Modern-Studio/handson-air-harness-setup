#!/usr/bin/env python3
"""Verificação dos passos do hands-on AI/R Harness Setup.

Uso: python3 .github/scripts/check_step.py <passo>

Lê .github/handson.json, identifica o pacote do AI/R Harness Setup extraído
na pasta-mãe (raiz deste repositório), descobre agente e idioma pelo
harness/MANIFEST.json e confere o trabalho do passo.

Escreve em $GITHUB_OUTPUT:
  vars    YAML com step_number, results_table, tips, agent, agent_label,
          lang, package_dir, code_dir, open_hint, work_hint, pointer_note,
          doc_constitution, doc_review_contract, doc_review_examples,
          doc_architecture, doc_pr_template, doc_docs_index, rule_area_path,
          rule_area_load, rule_task_path, rule_task_load, scope_hint,
          spine_reach, verify_scope (usado pelos templates de comentário)
  passed  "true" | "false"
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path.cwd()
CONFIG = json.loads((ROOT / ".github" / "handson.json").read_text(encoding="utf-8"))
CODE_DIR = CONFIG["code_dir"]
CODE = ROOT / CODE_DIR

def work_hint(cli: str | None, ide: str) -> str:
    """Como abrir o agente dentro de CODE_DIR (passo 6): bullets dentro de um item de lista numerada."""
    options = ([f"- **Pela CLI:** no terminal, entre na pasta (`cd {CODE_DIR}`) e {cli}."] if cli else [])
    options.append(f"- **Pela IDE:** {ide}.")
    return "\n   ".join(options)


# Onde cada agente guarda o que a skill escreve no projeto, e os textos por
# agente que os templates de .github/steps/ usam (open_hint, work_hint,
# rule_area_load, rule_task_load, scope_hint). scope_glob_key é a chave do frontmatter com os
# globs de escopo de uma rule de área.
AGENTS = {
    "claude-code": {
        "label": "Claude Code",
        "pointer": "CLAUDE.md",
        "rule_globs": [".claude/rules/air-*.md"],
        "task_globs": [".claude/commands/air-*.md", ".claude/skills/air-*/SKILL.md"],
        "scope_key": "paths:",
        "open_hint": "Abra um terminal na **pasta-mãe** (raiz do repositório) e inicie o Claude Code com `claude`. "
                     "Se preferir a IDE, abra a pasta-mãe na sua IDE de preferência e use a extensão do Claude Code.",
        "work_hint": work_hint("inicie o Claude Code com `claude`",
                               f"abra a pasta `{CODE_DIR}/` na sua IDE de preferência e use a extensão do Claude Code"),
        "scope_glob_key": "paths",
        "rule_area_load": "Carrega sozinha quando você trabalha nos caminhos do `paths:` do frontmatter",
        "rule_task_load": "Você invoca: `/air-<nome>`",
        "scope_hint": "Confira o `paths:` do frontmatter: ele precisa casar com arquivos que existem no projeto. "
                      "Um glob que não casa com nada é uma rule que nunca carrega, e ela falha em silêncio.",
    },
    "kiro": {
        "label": "Kiro",
        "pointer": None,
        "rule_globs": [".kiro/steering/air-*.md"],
        "task_globs": [],  # task-type no Kiro = steering com inclusion: manual
        "scope_key": "inclusion:",
        "open_hint": "No Kiro, abra a **pasta-mãe** (raiz do repositório) com **File → Open Folder**. "
                     "Se preferir a CLI, abra o terminal na pasta-mãe e inicie o Kiro CLI.",
        "work_hint": work_hint("inicie o Kiro CLI",
                               f"abra a pasta `{CODE_DIR}/` no Kiro IDE com **File → Open Folder**"),
        "scope_glob_key": "fileMatchPattern",
        "rule_area_load": "Carrega sozinha quando você trabalha nos caminhos do `fileMatchPattern:` (`inclusion: fileMatch`)",
        "rule_task_load": "Com `inclusion: manual`, você invoca: `#air-<nome>`",
        "scope_hint": "Confira o `fileMatchPattern:` do frontmatter: ele precisa casar com arquivos que existem no projeto. "
                      "Um glob que não casa com nada é uma rule que nunca carrega, e ela falha em silêncio.",
    },
    "github-copilot": {
        "label": "GitHub Copilot",
        "pointer": ".github/copilot-instructions.md",
        "rule_globs": [".github/instructions/air-*.instructions.md"],
        "task_globs": [".github/prompts/air-*.prompt.md"],
        "scope_key": "applyTo:",
        "open_hint": "Na sua IDE de preferência, abra a **pasta-mãe** (raiz do repositório), "
                     "depois abra o Copilot Chat e selecione o modo **Agent**. "
                     "Se preferir a CLI, abra o terminal na pasta-mãe e inicie o GitHub Copilot CLI.",
        "work_hint": work_hint("inicie o GitHub Copilot CLI",
                               f"abra a pasta `{CODE_DIR}/` na sua IDE de preferência e use o Copilot Chat no modo **Agent**"),
        "scope_glob_key": "applyTo",
        "rule_area_load": "Carrega sozinha quando você trabalha nos caminhos do `applyTo:` do frontmatter",
        "rule_task_load": "Você invoca: `/air-<nome>`",
        "scope_hint": "Confira o `applyTo:` do frontmatter: ele precisa casar com arquivos que existem no projeto. "
                      "Um glob que não casa com nada é uma rule que nunca carrega, e ela falha em silêncio.",
    },
    "ai-cockpit-reasoning": {
        "label": "AI/C Reasoning",
        "pointer": None,
        "rule_globs": [".aicockpit/rules/air-*.md"],
        "task_globs": [".aicockpit/workflows/air-*.md"],
        "scope_key": None,
        "open_hint": "Na sua IDE de preferência, abra a **pasta-mãe** (raiz do repositório), "
                     "depois abra o painel do AI/C Reasoning e inicie uma conversa nova. "
                     "Se preferir a CLI, abra o terminal na pasta-mãe e inicie a CLI do AI/C Reasoning.",
        "work_hint": work_hint("inicie a CLI do AI/C Reasoning",
                               f"abra a pasta `{CODE_DIR}/` na sua IDE de preferência, "
                               "depois abra o painel do AI/C Reasoning e inicie uma conversa nova"),
        "scope_glob_key": None,
        "rule_area_load": "Sem escopo: a pasta `rules/` carrega inteira, em toda sessão",
        "rule_task_load": "Você invoca: `/air-<nome>.md`",
        "scope_hint": "O AI/C Reasoning não tem escopo: a pasta `rules/` inteira é lida em toda sessão. "
                      "Cada rule aprovada custa contexto sempre, então aprove só as que valem esse custo.",
    },
}

# Documentos que a skill propõe entre a espinha e as rules (passo 3 do hands-on),
# pelo `kind` do MANIFEST.json do pacote.
DOC_KINDS = ("constitution", "review-contract", "review-examples", "architecture",
             "pr-template", "docs-index")

LANG_LABEL = {"pt-BR": "Português", "en": "English"}
SKIP_DIRS = {".git", ".github", "node_modules", CODE_DIR}


# --------------------------------------------------------------------------- #
# Identificação do pacote, agente e idioma
# --------------------------------------------------------------------------- #
def normalize_agent(raw: str) -> str | None:
    raw = (raw or "").lower()
    if "claude" in raw:
        return "claude-code"
    if "kiro" in raw:
        return "kiro"
    if "copilot" in raw:
        return "github-copilot"
    if "cockpit" in raw or "ai-c" in raw or "aic" in raw:
        return "ai-cockpit-reasoning"
    return None


def normalize_lang(raw: str) -> str | None:
    raw = (raw or "").lower()
    if raw.startswith("pt") or raw.endswith("pt-br") or raw.endswith("-pt"):
        return "pt-BR"
    if raw == "en" or raw.endswith("-en"):
        return "en"
    return None


def find_manifests(base: Path, max_depth: int = 4) -> list[Path]:
    found = []
    for path in base.rglob("MANIFEST.json"):
        rel = path.relative_to(base)
        if len(rel.parts) - 1 > max_depth or rel.parts[0] in SKIP_DIRS:
            continue
        if path.parent.name == "harness":
            found.append(path)
    return sorted(found)


def identify() -> dict:
    manifests = find_manifests(ROOT)
    info = {"manifests": manifests, "agent": None, "lang": None,
            "package_dir": None, "harness_dir": None, "manifest_files": []}
    if len(manifests) != 1:
        return info
    manifest = manifests[0]
    harness_dir = manifest.parent
    package_dir = harness_dir.parent  # pasta que contém harness/ e guides/
    try:
        data = json.loads(manifest.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        data = {}
    meta = data.get("harness", {}) if isinstance(data.get("harness"), dict) else {}
    agent = (normalize_agent(str(data.get("agent", "")))
             or normalize_agent(str(meta.get("agent", "")))
             or normalize_agent(package_dir.name))
    lang = (normalize_lang(str(data.get("lang", data.get("language", ""))))
            or normalize_lang(str(meta.get("lang", meta.get("language", ""))))
            or normalize_lang(package_dir.name))
    files = data.get("files") if isinstance(data.get("files"), list) else []
    info.update(agent=agent, lang=lang, harness_dir=harness_dir,
                package_dir=package_dir, manifest_files=files)
    return info


def manifest_entries(info: dict, kinds: tuple[str, ...]) -> list[dict]:
    return [f for f in info["manifest_files"]
            if isinstance(f, dict) and f.get("kind") in kinds and f.get("path")]


def entry_paths(entry: dict) -> list[str]:
    """Caminhos possíveis da entrada no projeto (sob CODE_DIR), incluindo as variantes por forja."""
    paths = [entry["path"], *(entry.get("variants") or {}).values()]
    return [f"{CODE_DIR}/{p}" for p in dict.fromkeys(paths)]


def rel(path: Path | None) -> str:
    return path.relative_to(ROOT).as_posix() if path else ""


def run_files(info: dict, name: str) -> list[Path]:
    if not info["package_dir"]:
        return []
    return sorted(info["package_dir"].glob(f"runs/*/{name}"))


def template_placeholders(info: dict, name: str) -> set[str]:
    """Placeholders `<...>` de um template do próprio pacote do participante."""
    if not info["harness_dir"]:
        return set()
    tpl = info["harness_dir"] / "templates" / name
    if not tpl.is_file():
        return set()
    text = re.sub(r"<!--.*?-->", "", tpl.read_text(encoding="utf-8", errors="replace"), flags=re.S)
    return {m for m in re.findall(r"<[^<>\n!][^<>\n]{0,80}>", text)}


def doc_body(path: Path) -> str:
    """Texto do documento sem blocos de código e sem comentários HTML."""
    text = path.read_text(encoding="utf-8", errors="replace")
    body = re.sub(r"```.*?```", "", text, flags=re.S)
    return re.sub(r"<!--.*?-->", "", body, flags=re.S)


def spine_missing(body: str) -> list[str]:
    found = {m.split("(")[0].strip() for m in re.findall(r"^## +(.+?)\s*$", body, flags=re.M)}
    return [s for s in CONFIG["spine_sections"] if s not in found]


def scope_globs(text: str, key: str) -> list[str]:
    """Globs de escopo no frontmatter: `paths:` em lista, `applyTo:` com vírgulas, `fileMatchPattern:`."""
    if not text.lstrip().startswith("---"):
        return []
    lines = text.lstrip().split("---")[1].splitlines()
    for i, line in enumerate(lines):
        m = re.match(rf"^{key}:\s*(.*)$", line.strip())
        if not m:
            continue
        value = m.group(1).strip()
        if value:
            items = value.strip("[]").split(",")
        else:
            items = []
            for nxt in lines[i + 1:]:
                if not nxt.strip().startswith("-"):
                    break
                items.append(nxt.strip()[1:])
        return [g for g in (it.strip().strip("'\"") for it in items) if g]
    return []


def glob_matches(pattern: str) -> bool:
    try:
        return any(CODE.glob(pattern.lstrip("/")))
    except (ValueError, NotImplementedError):
        return False


def code_glob(patterns: list[str]) -> list[Path]:
    out: list[Path] = []
    for pattern in patterns:
        out.extend(CODE.glob(pattern))
    return sorted(set(out))


# --------------------------------------------------------------------------- #
# Passos
# --------------------------------------------------------------------------- #
def step1(info: dict, results: list, tips: list) -> None:
    manifests = info["manifests"]
    inside_code = [m for m in CODE.rglob("MANIFEST.json") if m.parent.name == "harness"] if CODE.exists() else []
    results.append({
        "description": "Pacote do AI/R Harness Setup extraído na pasta-mãe",
        "passed": len(manifests) == 1,
    })
    if not manifests and not inside_code:
        tips.append("Não encontrei `harness/MANIFEST.json` fora da pasta "
                    f"`{CODE_DIR}/`. Extraia o zip na raiz do repositório, ao lado de `{CODE_DIR}/`.")
    elif len(manifests) > 1:
        tips.append("Encontrei mais de um pacote: "
                    + ", ".join(f"`{rel(m)}`" for m in manifests)
                    + ". Deixe só o pacote do agente que você vai usar.")
    results.append({
        "description": f"Pacote fora da pasta do código (`{CODE_DIR}/`)",
        "passed": not inside_code,
    })
    if inside_code:
        tips.append("O pacote fica ao lado do código, nunca dentro. Mova "
                    f"`{rel(inside_code[0].parent.parent)}` para a raiz do repositório.")
    if len(manifests) == 1:
        agent_ok = info["agent"] in AGENTS
        lang_ok = info["lang"] in LANG_LABEL
        label = AGENTS[info["agent"]]["label"] if agent_ok else "?"
        results.append({
            "description": f"Agente identificado: {label} · idioma: {LANG_LABEL.get(info['lang'], '?')}",
            "passed": agent_ok and lang_ok,
        })
        if not (agent_ok and lang_ok):
            tips.append("Não consegui ler agente/idioma do `MANIFEST.json` nem do nome da pasta. "
                        "Use o zip baixado da página do AI/R Harness Setup sem renomear a pasta.")
        skill = list(info["harness_dir"].glob("skills/air-harness-setup/SKILL*.md"))
        results.append({
            "description": "Skill `air-harness-setup` presente no pacote",
            "passed": bool(skill),
        })


def step2(info: dict, results: list, tips: list) -> None:
    agents_md = CODE / "AGENTS.md"
    exists = agents_md.is_file()
    results.append({"description": f"`{CODE_DIR}/AGENTS.md` criado", "passed": exists})
    if exists:
        body = doc_body(agents_md)
        missing = spine_missing(body)
        results.append({
            "description": f"`AGENTS.md` com as {len(CONFIG['spine_sections'])} seções da espinha",
            "passed": not missing,
        })
        if missing:
            tips.append("Seções que não encontrei: " + ", ".join(f"`## {s}`" for s in missing)
                        + ". Os títulos ficam em inglês nos dois idiomas.")
        leftovers = sorted(p for p in template_placeholders(info, "spine.md") if p in body)
        results.append({
            "description": "Nenhum placeholder do template sobrando",
            "passed": not leftovers,
        })
        if leftovers:
            tips.append("Ainda há campos do template sem preencher: "
                        + ", ".join(f"`{x}`" for x in leftovers[:5])
                        + ". Peça à skill para completar ou responda \"não sei\" para marcar como lacuna.")
    else:
        tips.append(f"O `AGENTS.md` fica na raiz da pasta do código: `{CODE_DIR}/AGENTS.md`.")

    spec = AGENTS.get(info["agent"] or "")
    if spec and spec["pointer"]:
        pointer = CODE / spec["pointer"]
        results.append({
            "description": f"Arquivo de ponteiro do {spec['label']} (`{spec['pointer']}`)",
            "passed": pointer.is_file(),
        })
    state = run_files(info, "STATE.md")
    results.append({
        "description": "Memória da sessão registrada no pacote (`runs/<projeto>/STATE.md`)",
        "passed": bool(state),
    })
    if not state:
        tips.append("A pasta `runs/` é criada pela skill dentro do pacote. Faça o commit dela junto.")


def step3(info: dict, results: list, tips: list) -> None:
    diff, _ = changed_files()
    package = rel(info["package_dir"])
    decisions = [f for f in diff
                 if package and f.startswith(f"{package}/runs/") and f.endswith("/DECISIONS.md")]
    results.append({
        "description": "Decisões sobre os documentos registradas (`runs/<projeto>/DECISIONS.md` atualizado neste push)",
        "passed": bool(decisions),
    })
    if not decisions:
        tips.append("Não encontrei alteração no `DECISIONS.md` neste push. É lá que a skill registra cada decisão, "
                    "inclusive o motivo de cada documento dispensado. Faça o commit incluindo a pasta `runs/` do pacote.")
    entries = manifest_entries(info, DOC_KINDS)
    found = []  # um caminho por documento: o primeiro que existe, entre as variantes
    for entry in entries:
        hit = next((p for p in entry_paths(entry) if (ROOT / p).is_file()), None)
        if hit:
            found.append(hit)
    results.append({
        "description": f"Documentos do harness no projeto: {len(found)} de {len(entries)}"
                       + (" (" + ", ".join(f"`{p}`" for p in found) + ")" if found
                          else " (dispensados, ou o projeto já tinha os seus)"),
        "passed": True,
    })


def step4(info: dict, results: list, tips: list) -> None:
    spec = AGENTS.get(info["agent"] or "")
    if not spec:
        results.append({"description": "Agente identificado pelo pacote", "passed": False})
        tips.append("Não identifiquei o agente. Confira o Passo 1.")
        return
    # No Copilot o contrato de review fica em .github/instructions/, junto das rules.
    not_rules = {p for e in manifest_entries(info, DOC_KINDS + ("spine", "pointer")) for p in entry_paths(e)}
    rules = [r for r in code_glob(spec["rule_globs"]) if rel(r) not in not_rules]
    tasks = [t for t in code_glob(spec["task_globs"]) if rel(t) not in not_rules]
    results.append({
        "description": f"Ao menos uma rule `air-*` do {spec['label']} aprovada e gravada ({len(rules) + len(tasks)} encontrada(s))",
        "passed": bool(rules or tasks),
    })
    if not (rules or tasks):
        tips.append("Onde procurei: " + ", ".join(f"`{CODE_DIR}/{g}`" for g in spec["rule_globs"] + spec["task_globs"]))
    if spec["scope_key"] and rules:
        unscoped = [r for r in rules
                    if not r.read_text(encoding="utf-8", errors="replace").lstrip().startswith("---")
                    or spec["scope_key"] not in r.read_text(encoding="utf-8", errors="replace").split("---")[1]]
        results.append({
            "description": f"Rules de área com escopo no frontmatter (`{spec['scope_key']}`)",
            "passed": not unscoped,
        })
        if unscoped:
            tips.append("Sem escopo: " + ", ".join(f"`{rel(r)}`" for r in unscoped[:3]))
    if rules or tasks:
        placeholders = template_placeholders(info, "rule-area.md") | template_placeholders(info, "rule-task-type.md")
        leftovers = sorted({f"`{rel(r)}`" for r in rules + tasks if any(p in doc_body(r) for p in placeholders)})
        results.append({
            "description": "Nenhum campo do template sobrando nas rules",
            "passed": not leftovers,
        })
        if leftovers:
            tips.append("Ainda há campos `<...>` do template em: " + ", ".join(leftovers[:3])
                        + ". Um escopo entre `<>` é um glob que não casa com nada.")
    if spec["scope_glob_key"]:
        sleeping = [f"`{rel(r)}` (`{g}`)" for r in rules
                    for g in scope_globs(r.read_text(encoding="utf-8", errors="replace"), spec["scope_glob_key"])
                    if "<" not in g and not glob_matches(g)]
        if sleeping:
            tips.append("Escopo que não casa com nenhum arquivo do projeto: " + ", ".join(sleeping[:3])
                        + ". Uma rule assim nunca carrega; confira com a skill se o projeto ainda não tem esses arquivos.")
    decisions = run_files(info, "DECISIONS.md")
    results.append({
        "description": "Decisões da sessão registradas (`runs/<projeto>/DECISIONS.md`)",
        "passed": bool(decisions),
    })


def changed_files() -> tuple[list[str], list[str]]:
    """Arquivos alterados neste push e arquivos que já existiam antes dele."""
    before = os.environ.get("BEFORE_SHA", "")
    after = os.environ.get("AFTER_SHA", "HEAD")
    if not before or set(before) == {"0"}:
        before = f"{after}~1"
    diff = subprocess.run(["git", "diff", "--name-only", "--diff-filter=AM", before, after],
                          capture_output=True, text=True, check=False).stdout.split()
    existed = subprocess.run(["git", "ls-tree", "-r", "--name-only", before],
                             capture_output=True, text=True, check=False).stdout.split()
    return diff, existed


def step5(info: dict, results: list, tips: list) -> None:
    diff, _ = changed_files()
    package = rel(info["package_dir"])
    state = [f for f in diff if package and f.startswith(f"{package}/runs/") and f.endswith("/STATE.md")]
    results.append({
        "description": "Andamento registrado (`runs/<projeto>/STATE.md` atualizado neste push)",
        "passed": bool(state),
    })
    if not state:
        tips.append("Não encontrei alteração no `STATE.md` neste push. Faça o commit incluindo a pasta `runs/` do pacote.")
    agents_md = CODE / "AGENTS.md"
    missing = spine_missing(doc_body(agents_md)) if agents_md.is_file() else CONFIG["spine_sections"]
    results.append({
        "description": f"`AGENTS.md` com as {len(CONFIG['spine_sections'])} seções da espinha",
        "passed": not missing,
    })
    if missing:
        tips.append("Seções que não encontrei: " + ", ".join(f"`## {s}`" for s in missing) + ".")
    spec = AGENTS.get(info["agent"] or "")
    if spec and spec["pointer"]:
        pointer = CODE / spec["pointer"]
        reads = pointer.is_file() and "AGENTS.md" in pointer.read_text(encoding="utf-8", errors="replace")
        results.append({
            "description": f"Arquivo de ponteiro (`{CODE_DIR}/{spec['pointer']}`) carrega o `AGENTS.md`",
            "passed": reads,
        })
        if not reads:
            tips.append("Sem o ponteiro apontando para o `AGENTS.md`, nada do que foi instalado é lido pelo agente.")
    notes = sorted({rel(p.parent) for p in CODE.rglob("STATE.md")
                    if (p.parent / "PROJECT.md").is_file() or (p.parent / "DECISIONS.md").is_file()})
    results.append({
        "description": f"Nenhuma anotação da instalação (`runs/`) dentro de `{CODE_DIR}/`",
        "passed": not notes,
    })
    if notes:
        tips.append("As anotações da skill ficam no pacote, nunca no projeto: " + ", ".join(f"`{n}`" for n in notes[:3]) + ".")


def step6(info: dict, results: list, tips: list) -> None:
    spec = AGENTS.get(info["agent"] or "")
    diff, existed = changed_files()
    harness_paths = [f"{CODE_DIR}/AGENTS.md"]
    if spec:
        if spec["pointer"]:
            harness_paths.append(f"{CODE_DIR}/{spec['pointer']}")
    harness_paths += [p for e in manifest_entries(info, DOC_KINDS) for p in entry_paths(e)]
    harness_prefixes = (f"{CODE_DIR}/.claude/", f"{CODE_DIR}/.kiro/",
                        f"{CODE_DIR}/.github/instructions/", f"{CODE_DIR}/.github/prompts/",
                        f"{CODE_DIR}/.aicockpit/")
    code_changes = [f for f in diff if f.startswith(f"{CODE_DIR}/")
                    and f not in harness_paths and not f.startswith(harness_prefixes)]
    harness_changes = [f for f in diff if f in existed and
                       (f in harness_paths or (f.startswith(harness_prefixes) and "/air-" in f))]
    results.append({
        "description": f"Tarefa feita no código do projeto ({len(code_changes)} arquivo(s))",
        "passed": bool(code_changes),
    })
    results.append({
        "description": "Ajuste num documento do harness que já estava instalado",
        "passed": bool(harness_changes),
    })
    if not harness_changes:
        tips.append("Ajuste o `AGENTS.md`, uma rule `air-*` ou outro documento do harness que já existia "
                    "com o que você aprendeu na tarefa, e envie no mesmo push.")

    # Tarefa A: test-tools.js; Tarefa B: dependências vulneráveis.
    test_tools = f"{CODE_DIR}/test-tools.js" in diff
    results.append({"description": "Tarefa A: `test-tools.js` corrigido neste push", "passed": test_tools})
    if not test_tools:
        tips.append(f"Não encontrei alteração em `{CODE_DIR}/test-tools.js` neste push. "
                    "A Tarefa A é deixar o resultado dele confiável.")
    lockfile = f"{CODE_DIR}/package-lock.json" in diff
    results.append({"description": "Tarefa B: `package-lock.json` atualizado neste push", "passed": lockfile})
    if not lockfile:
        tips.append(f"Não encontrei alteração em `{CODE_DIR}/package-lock.json` neste push. "
                    "Atualizar dependências muda o lockfile, e ele vai no mesmo commit.")
    vulnerable = audit_fixable(("high", "critical"))
    if vulnerable is None:
        results.append({"description": "Tarefa B: auditoria de dependências (`npm audit`) não pôde rodar",
                        "passed": True})
        tips.append("Não consegui rodar o `npm audit` nesta verificação, então ela não bloqueia o passo. "
                    f"Confira na sua máquina com `npm audit --audit-level=high` dentro de `{CODE_DIR}/`.")
    else:
        results.append({
            "description": "Tarefa B: nenhuma vulnerabilidade alta ou crítica com correção disponível"
                           + (f" ({len(vulnerable)} encontrada(s))" if vulnerable else ""),
            "passed": not vulnerable,
        })
        if vulnerable:
            tips.append("O `npm audit` ainda aponta, com correção disponível: "
                        + ", ".join(f"`{name}`" for name in vulnerable[:5])
                        + f". Rode `npm audit` dentro de `{CODE_DIR}/` e peça ao agente para atualizar.")


def audit_fixable(severities: tuple[str, ...]) -> list[str] | None:
    """Pacotes com vulnerabilidade nas severidades dadas e correção disponível; None se o npm audit não rodar."""
    try:
        out = subprocess.run(["npm", "audit", "--package-lock-only", "--json"], cwd=CODE,
                             capture_output=True, text=True, check=False, timeout=120).stdout
        report = json.loads(out)
    except (OSError, subprocess.TimeoutExpired, json.JSONDecodeError):
        return None
    if "vulnerabilities" not in report:
        return None  # ex.: lockfile ausente ou erro de rede; o JSON traz só "error"
    return sorted(name for name, v in report["vulnerabilities"].items()
                  if v.get("severity") in severities and v.get("fixAvailable"))


def main() -> int:
    step = int(sys.argv[1])
    info = identify()
    results: list[dict] = []
    tips: list[str] = []
    {1: step1, 2: step2, 3: step3, 4: step4, 5: step5, 6: step6}[step](info, results, tips)

    spec = AGENTS.get(info["agent"] or "", {})
    pointer_note = (f"No {spec['label']}, o `AGENTS.md` vem acompanhado de `{CODE_DIR}/{spec['pointer']}`, "
                    "o arquivo que faz o agente lê-lo." if spec.get("pointer") else "")
    docs = {e["kind"]: entry_paths(e)[0] for e in manifest_entries(info, DOC_KINDS)}
    rule_paths = {e["kind"]: entry_paths(e)[0].replace("<name>", "<nome>")
                  for e in manifest_entries(info, ("rule-area", "rule-task-type"))}
    label = spec.get("label", "")
    if spec.get("pointer"):
        spine_reach = f"o `{CODE_DIR}/{spec['pointer']}` carrega o `AGENTS.md`"
    else:
        spine_reach = f"o {label} lê o `AGENTS.md` nativamente" if label else ""
    if spec.get("scope_glob_key"):
        verify_scope = "o escopo de cada rule de área casa com arquivos que existem no projeto"
    else:
        verify_scope = (f"o escopo das rules não se aplica: no {label} elas não têm escopo, "
                        "e cada uma é lida em toda sessão") if label else ""
    payload = {
        "step_number": step,
        "results_table": results,
        "tips": tips,
        "agent": info["agent"] or "",
        "agent_label": spec.get("label", ""),
        "lang": info["lang"] or "",
        "package_dir": rel(info["package_dir"]),
        "code_dir": CODE_DIR,
        "open_hint": spec.get("open_hint", "Abra o seu agente na **pasta-mãe** (raiz do repositório)."),
        "work_hint": spec.get("work_hint", work_hint("inicie o seu agente",
                                                     f"abra a pasta `{CODE_DIR}/` na IDE em que você usa o agente")),
        "pointer_note": pointer_note,
        **{f"doc_{kind.replace('-', '_')}": docs.get(kind, "") for kind in DOC_KINDS},
        "rule_area_path": rule_paths.get("rule-area", ""),
        "rule_area_load": spec.get("rule_area_load", ""),
        "rule_task_path": rule_paths.get("rule-task-type", ""),
        "rule_task_load": spec.get("rule_task_load", ""),
        "scope_hint": spec.get("scope_hint", ""),
        "spine_reach": spine_reach,
        "verify_scope": verify_scope,
    }
    passed = all(r["passed"] for r in results)
    out = os.environ.get("GITHUB_OUTPUT")
    text = json.dumps(payload, ensure_ascii=False)  # JSON é YAML válido
    if out:
        with open(out, "a", encoding="utf-8") as fh:
            fh.write(f"vars={text}\n")
            fh.write(f"passed={'true' if passed else 'false'}\n")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
