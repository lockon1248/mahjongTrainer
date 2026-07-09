<!-- SPECTRA:START v1.0.2 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `$spectra-*` skills when:

- A discussion needs structure before coding → `$spectra-discuss`
- User wants to plan, propose, or design a change → `$spectra-propose`
- Tasks are ready to implement → `$spectra-apply`
- There's an in-progress change to continue → `$spectra-ingest`
- User asks about specs or how something works → `$spectra-ask`
- Implementation is done → `$spectra-archive`
- Commit only files related to a specific change → `$spectra-commit`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `$spectra-apply` and `$spectra-ingest` skills handle parked changes automatically.

<!-- SPECTRA:END -->

# Project Hard Gates

## 1. Repo Entry Gate

Every time work starts in this repo, the assistant must first:

1. read this `AGENTS.md`
2. read `openspec/config.yaml`
3. read the relevant files under `openspec/specs/`
4. determine the authoritative spec system before writing any spec, plan, or proposal

If these steps are not completed first, the assistant must stop and correct the workflow before continuing.

## 2. Spec Authority Gate

This repo uses `Spectra` / `OpenSpec` as the authoritative spec workflow.

- Authoritative spec files must live under `openspec/specs/`
- Authoritative change artifacts must live under `openspec/changes/`
- The assistant must not create `SPEC.md`, `PLAN.md`, `docs/superpowers/*`, or other mirror documents as the primary source of truth
- Mirror documents may only be created if the user explicitly requests them

## 3. Start-of-Work Output Requirement

Before implementation begins, the assistant must explicitly state:

1. `依據文件`
2. `已確認事項`
3. `未確認事項`

If any unconfirmed item affects rules, copy, interactions, data structures, or implementation boundaries, the assistant must not guess and must not silently implement assumptions.

## 4. No-Guess Rule

The assistant must not invent:

- specs
- copy
- validation rules
- default values
- interaction behavior
- scoring rules
- undocumented table rules

Unknowns must be recorded in the proper spec/change artifacts instead of being directly implemented as settled behavior.

## 5. Environment Problem Gate

When environment issues happen:

- only one minimal repair attempt is allowed before reporting back
- the assistant must not create alternate project directories, mirror workspaces, symlink-based workarounds, or duplicate spec systems unless the user explicitly asks for that
- environment repair must not silently take over the main task

If the first repair attempt fails, the assistant must report:

1. what failed
2. why it blocks progress
3. what the smallest next action is

## 6. Ask-Less Rule

The assistant must not ask the user questions that can be answered by:

- reading repo files
- reading config
- reading specs
- reading command output
- checking the actual workspace state

Questions are only allowed when the answer cannot be discovered locally and materially changes implementation.

## 7. Project Rules Override Generic Workflow

For this repo, rule priority is:

1. direct user instruction
2. this project `AGENTS.md`
3. `openspec/` workflow and artifacts
4. global `AGENTS.md`
5. optional skills / generic workflows

If a generic workflow conflicts with this repo's `OpenSpec` workflow, the repo workflow must win.

## 8. Violation Recovery Rule

If the assistant violates any hard gate above, it must:

1. stop implementation
2. list the violated rule(s)
3. describe the correction
4. repair the workflow state first
5. only then resume work

## 9. Environment Blocker Protocol

When dependency installation, file deletion, directory creation, test cache writes, or package-manager operations fail with filesystem or permission errors such as:

- `EPERM`
- `Operation not permitted`
- `EACCES`
- repeated partial `node_modules` installs

the assistant must treat the issue as an **environment blocker**, not a product implementation task.

Required behavior:

1. make at most **one** minimal repair attempt
2. record the exact failing command and exact failing path
3. stop expanding workaround scope after the first failed repair
4. do **not** create:
   - alternate project directories
   - duplicate workspaces
   - symlink-based dependency replacements
   - mirror repos
   - parallel spec systems
5. do **not** repeatedly reinstall, delete, move, or recreate `node_modules`
6. report the blocker clearly before doing anything beyond the first repair attempt

The only acceptable first repair attempt is one of:

- remove a single broken cache or generated directory
- restore expected file permissions on the exact failing path
- retry the same command once in the correct runtime environment

If that attempt fails, the assistant must stop and report the blocker.

## 10. Token Discipline Rule

The assistant must minimize user token waste.

It must not:

- ask a question that can be answered from the repo
- ask for confirmation before performing a clearly reversible or diagnostic action
- restate the same blocker multiple times without new information
- create extra explanation documents when the repo already has a required system
- narrate low-value intermediate steps that do not change direction

Before asking any question, the assistant must internally verify:

1. the answer cannot be discovered locally
2. the answer materially changes implementation
3. the question is shorter than the avoided wasted work

If any of the above is false, the assistant must not ask the question.

## 11. Drift Stop Rule

The assistant must stop itself when work drifts away from the user's actual goal.

Drift indicators include:

- spending more than one consecutive turn on environment cleanup
- editing files that are not part of the repo's authoritative workflow
- creating mirror artifacts because the main workflow was not understood
- debugging tooling without first confirming whether the issue blocks the requested task

When drift is detected, the assistant must:

1. stop current actions
2. name the drift explicitly
3. reduce back to the smallest goal-aligned action
4. continue only from the authoritative repo workflow

## 12. File-System Authority Rule

Before creating or editing any planning or specification file, the assistant must determine:

1. which directory the repo's tooling actually reads
2. which file names the repo expects
3. whether the content must be in English or Chinese for the user's use

If this is not verified first, the assistant must not create the file.
