---
name: pr-generation
description: Shared Mira conventions for preparing, creating or updating pull requests. Loaded through each repository's own pr-generation skill, which adds that repository's own steps.
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

Use this format for every Mira PR, including when the generic `pr` skill is also loaded; it takes precedence over that skill's template.

```markdown
<One or two sentences on the purpose and resulting behavior, for a reviewer who has not read the conversation.>

## Before / After

- **Before:** <previous problem or behavior>
- **After:** <resulting capability or behavior>

## Changes

- <related behavior grouped together, and why it matters>

## Current limits

- <concrete limitation or remaining work needed to understand this scope>

## Verification

- <check actually performed and its result>

Part of Papidev/mira-explorer#<issue>.
```

- Write in plain English with familiar words; explain unavoidable technical terms. Keep each bullet short and understandable without the conversation.
- Scale the detail to the change and omit empty sections; omit Current limits when there is no material limitation. Group related behavior instead of listing every file or step.
- Describe risks and limitations plainly, without labels such as door, blast radius or merge danger. Keep future plans out unless needed to understand the scope.
- Summarize only verification actually performed, and distinguish earlier results from checks run now. For documentation-only changes, a brief diff-review statement is enough.
- Use screenshots or diagrams only when they explain something the bullets cannot.
- Leave out placeholders, session history, unrelated operational work and release bookkeeping already clear from the diff.

Link the originating issue with its repository name (for example `Papidev/mira-explorer#355`); use a closing keyword only when the PR completes that issue. When using a GitHub connector, pass actual newlines and leave a blank line before Markdown lists.

## State, assignment and access

- Open PRs ready for review unless the user explicitly asks for a draft.
- Assign new PRs to `Papidev` when permissions allow.
- Create and change PRs and their metadata only as `Papidev`, following the repository's Mira GitHub account rules.
