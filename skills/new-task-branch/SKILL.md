---
name: new-task-branch
description: Shared Mira workflow for starting a new task on a fresh branch from updated main. Loaded through each repository's own new-task-branch skill.
---

# New task branch

1. Inspect the current branch and local changes with `git status --short --branch`.
2. For a new task or session, update local `main` from `origin/main` with a fast-forward pull, then create a new branch from it. Do this even if the current branch starts with `feat/`.
3. Before changing files on `main`, `master` or another non-feature branch, create a `feat/` branch first, even when the user did not call it a new task.
4. Use the user's branch name when provided, even if it does not follow the `feat/` pattern. Otherwise choose a concise, lowercase, hyphen-separated `feat/<task-name>` based on the task; use `feat/new-task` when the purpose is not yet clear.
5. When continuing an existing task, stay on its current branch only while it is unmerged. Check merge status before reusing it: fetch `origin`, then check whether its tip is contained in `origin/main`; for squash/rebase merges, verify the associated PR's merged state using the required GitHub account. A user report that the branch was merged also establishes this. After a merge, follow step 2, preserving uncommitted work. An instruction to work on the current branch applies to active, unmerged branches.

## Safety

- Never discard or revert local changes when creating or switching branches.
- If updating `main` or switching branches would conflict with local changes, stop and ask the user how to proceed instead of stashing, discarding or carrying changes across branches.
