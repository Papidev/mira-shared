# mira-shared

Code and CI steps shared by [mira-admin](https://github.com/Papidev/mira-admin) and [mira-explorer](https://github.com/Papidev/mira-explorer). This repository is public: never put secrets here.

## CI actions

- `setup`: installs pnpm 10.18.0 and Node.js 24, then runs `pnpm install --frozen-lockfile`. Use it after `actions/checkout`:

  ```yaml
  - uses: Papidev/mira-shared/.github/actions/setup@main
  ```

- `changed`: reports whether a push or pull request changed the given paths, so checks can skip documentation-only changes. Use it after `actions/checkout` with `fetch-depth: 0`:

  ```yaml
  - id: changes
    uses: Papidev/mira-shared/.github/actions/changed@main
  - if: steps.changes.outputs.changed == 'true'
    run: pnpm test
  ```

  Pass `paths` (Git pathspecs, one per line) to check other paths.
