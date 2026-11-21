---
name: pr-generation
description: Shared Mira conventions for preparing, creating or updating pull requests. Loaded through each repository's own pr-generation skill, which adds that repository's body format and release steps.
---

# PR generation

Read the full diff against the PR's base branch before choosing a title or describing changes. Use the repository guidance to select verification; opening a PR or marking it ready for review does not by itself require a blanket test, type-check, lint, format or build run.

## Title

Use a lowercase prefix and colon:

- `add:` for new capabilities
- `change:` for behavior updates
- `fix:` for bug fixes
- `docs:` for documentation-only changes
- `chore:` for maintenance
- `refactor:` for internal restructuring without intended behavior changes

Keep the title concise and scoped to the PR's main change. Choose one prefix even when the PR contains related fixes or documentation.

## Body

Follow the repository's own body format. In every format, keep each point understandable without the conversation, summarize the verification actually performed, and describe material risks or limitations plainly instead of using labels such as door, blast radius or merge danger. Leave session history and unrelated operational work out.

Link the originating issue with its repository name (for example `Papidev/mira-explorer#355`); use a closing keyword only when the PR completes that issue. When using a GitHub connector, pass actual newlines and leave a blank line before Markdown lists.

## State, assignment and access

- Open PRs ready for review unless the user explicitly asks for a draft.
- Assign new PRs to `Papidev` when permissions allow.
- Create and change PRs and their metadata only as `Papidev`, following the repository's Mira GitHub account rules.
