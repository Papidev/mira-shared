# mira-shared

Code and CI steps shared by [mira-admin](https://github.com/Papidev/mira-admin) and [mira-explorer](https://github.com/Papidev/mira-explorer). This repository is public: never put secrets here.

## CI actions

- `setup`: installs the repository's own pnpm (`packageManager` in `package.json`) and Node.js versions, then runs `pnpm install --frozen-lockfile`. Use it after `actions/checkout`:

  ```yaml
  - uses: Papidev/mira-shared/.github/actions/setup@main
    with:
      node-version-file: .nvmrc # optional; defaults to engines.node in package.json
  ```

- `changed`: reports whether a push or pull request changed the given paths, so checks can skip documentation-only changes. Use it after `actions/checkout` with `fetch-depth: 0`:

  ```yaml
  - id: changes
    uses: Papidev/mira-shared/.github/actions/changed@main
  - if: steps.changes.outputs.changed == 'true'
    run: pnpm test
  ```

  Pass `paths` (Git pathspecs, one per line) to check other paths.

## Content API schemas

The `@mira/shared` package exports the zod schemas of the Mira Explorer content API (published content, Admin reads, write and baseline contracts) and the Story and Person content they embed. Explorer validates requests with them; the Admin builds and checks requests and responses with the same ones.

It ships TypeScript sources with `zod` as a peer dependency. Pin a commit:

```sh
pnpm add github:Papidev/mira-shared#<commit>
```

Internal imports use `.ts` extensions, so consumers enable `allowImportingTsExtensions` (with `noEmit`), and Next.js apps add `@mira/shared` to `transpilePackages`. Changing a schema changes the API contract: update Explorer before or together with the Admin.

## Agent skills

`skills/` holds the shared core of the Mira agent skills. Each repository keeps a short skill with the same name under `.agents/skills/` that links to `node_modules/@mira/shared/skills/<name>/SKILL.md` and adds only its own steps.
