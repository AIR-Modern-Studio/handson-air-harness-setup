#!/usr/bin/env python3
"""Verificação dos passos do hands-on AI/R Harness Setup.

Uso: python3 .github/scripts/check_step.py <passo>

Lê .github/handson.json, identifica o pacote do AI/R Harness Setup extraído
na pasta-mãe (raiz deste repositório), descobre agente e idioma pelo
harness/MANIFEST.json e confere o trabalho do passo.

Escreve em $GITHUB_OUTPUT:
  vars    YAML com step_number, results_table, tips, agent, agent_label,
          lang, package_dir, code_dir, open_hint, pointer_note, rule_area,
          rule_task (usado pelos templates de comentário)
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

# Onde cada agente guarda o que a skill escreve no projeto, e os textos por
# agente que os templates de .github/steps/ usam (open_hint, rule_area,
# rule_task; {code} vira CODE_DIR).
AGENTS = {
    "claude-code": {
        "label": "Claude Code",
        "pointer": "CLAUDE.md",
        "rule_globs": [".claude/rules/air-*.md"],
        "task_globs": [".claude/commands/air-*.md", ".claude/skills/air-*/SKILL.md"],
        "scope_key": "paths:",
        "open_hint": "Abra um terminal na raiz do repositório (a pasta-mãe) e inicie o Claude Code com `claude`.",
        "rule_area": "`{code}/.claude/rules/air-*.md`, com `paths:` no frontmatter",
        "rule_task": "`{code}/.claude/commands/air-*.md`, acionado com `/air-<nome>`",
    },
    "kiro": {
        "label": "Kiro",
        "pointer": None,
        "rule_globs": [".kiro/steering/air-*.md"],
        "task_globs": [],  # task-type no Kiro = steering com inclusion: manual
        "scope_key": "inclusion:",
        "open_hint": "No Kiro, abra a **pasta-mãe** (raiz do repositório) com **File → Open Folder**. "
                     "Se preferir a CLI, abra o terminal na pasta-mãe e inicie o Kiro CLI.",
        "rule_area": "`{code}/.kiro/steering/air-*.md`, com `inclusion: fileMatch`",
        "rule_task": "`{code}/.kiro/steering/air-*.md`, com `inclusion: manual`, acionado com `#air-<nome>`",
    },
    "github-copilot": {
        "label": "GitHub Copilot",
        "pointer": ".github/copilot-instructions.md",
        "rule_globs": [".github/instructions/air-*.instructions.md"],
        "task_globs": [".github/prompts/air-*.prompt.md"],
        "scope_key": "applyTo:",
        "open_hint": "No VS Code, abra a **pasta-mãe** (raiz do repositório) com **File → Open Folder**. "
                     "Depois abra o Copilot Chat e selecione o modo **Agent**.",
        "rule_area": "`{code}/.github/instructions/air-*.instructions.md`, com `applyTo:`",
        "rule_task": "`{code}/.github/prompts/air-*.prompt.md`",
    },
    "ai-cockpit-reasoning": {
        "label": "AI/C Reasoning",
        "pointer": None,
        "rule_globs": [".aicockpit/rules/air-*.md"],
        "task_globs": [".aicockpit/workflows/air-*.md"],
        "scope_key": None,
        "open_hint": "No VS Code, abra a **pasta-mãe** (raiz do repositório) com **File → Open Folder**. "
                     "Depois abra o painel do AI/C Reasoning e inicie uma conversa nova.",
        "rule_area": "`{code}/.aicockpit/rules/air-*.md`",
        "rule_task": "`{code}/.aicockpit/workflows/air-*.md`",
    },
}

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
            "package_dir": None, "harness_dir": None}
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
    info.update(agent=agent, lang=lang, harness_dir=harness_dir,
                package_dir=package_dir)
    return info


def rel(path: Path | None) -> str:
    return path.relative_to(ROOT).as_posix() if path else ""


def run_files(info: dict, name: str) -> list[Path]:
    if not info["package_dir"]:
        return []
    return sorted(info["package_dir"].glob(f"runs/*/{name}"))


def spine_placeholders(info: dict) -> set[str]:
    """Placeholders `<...>` do template da espinha do próprio pacote do participante."""
    if not info["harness_dir"]:
        return set()
    tpl = info["harness_dir"] / "templates" / "spine.md"
    if not tpl.is_file():
        return set()
    text = re.sub(r"<!--.*?-->", "", tpl.read_text(encoding="utf-8", errors="replace"), flags=re.S)
    return {m for m in re.findall(r"<[^<>\n!][^<>\n]{0,80}>", text)}


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
                        "Use o zip baixado da página do Outer Harness sem renomear a pasta.")
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
        text = agents_md.read_text(encoding="utf-8", errors="replace")
        body = re.sub(r"```.*?```", "", text, flags=re.S)
        body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
        found = {m.split("(")[0].strip() for m in re.findall(r"^## +(.+?)\s*$", body, flags=re.M)}
        missing = [s for s in CONFIG["spine_sections"] if s not in found]
        results.append({
            "description": f"`AGENTS.md` com as {len(CONFIG['spine_sections'])} seções da espinha",
            "passed": not missing,
        })
        if missing:
            tips.append("Seções que não encontrei: " + ", ".join(f"`## {s}`" for s in missing)
                        + ". Os títulos ficam em inglês nos dois idiomas.")
        leftovers = sorted(p for p in spine_placeholders(info) if p in body)
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
    spec = AGENTS.get(info["agent"] or "")
    if not spec:
        results.append({"description": "Agente identificado pelo pacote", "passed": False})
        tips.append("Não identifiquei o agente. Confira o Passo 1.")
        return
    rules = code_glob(spec["rule_globs"])
    tasks = code_glob(spec["task_globs"])
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


def step4(info: dict, results: list, tips: list) -> None:
    spec = AGENTS.get(info["agent"] or "")
    diff, existed = changed_files()
    harness_paths = [f"{CODE_DIR}/AGENTS.md"]
    if spec:
        if spec["pointer"]:
            harness_paths.append(f"{CODE_DIR}/{spec['pointer']}")
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
        tips.append("Ajuste o `AGENTS.md` ou uma rule `air-*` que já existia com o que você aprendeu na tarefa, "
                    "e envie no mesmo push.")
    # TODO(projeto-base): verificação específica da tarefa (testes, arquivo esperado…)


def main() -> int:
    step = int(sys.argv[1])
    info = identify()
    results: list[dict] = []
    tips: list[str] = []
    {1: step1, 2: step2, 3: step3, 4: step4}[step](info, results, tips)

    spec = AGENTS.get(info["agent"] or "", {})
    pointer_note = (f"No {spec['label']}, o `AGENTS.md` vem acompanhado de `{CODE_DIR}/{spec['pointer']}`, "
                    "o arquivo que faz o agente lê-lo." if spec.get("pointer") else "")
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
        "pointer_note": pointer_note,
        "rule_area": spec.get("rule_area", "").format(code=CODE_DIR),
        "rule_task": spec.get("rule_task", "").format(code=CODE_DIR),
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
