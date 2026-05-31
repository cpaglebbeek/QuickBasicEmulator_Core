# CLAUDE.md — QuickBasicEmulator_Core

## Rol

Canonieke dialect-spec + AST-types + test-suite. **Bron van waarheid** voor wat elke dialect-statement betekent.

## Conventies

- **Spec-bestanden zijn JSON**, geen TypeScript. Zo blijven ze door non-TS tools (Rust-decompiler, C++ _X86) te consumeren.
- AST-types in TypeScript zijn **discriminated unions** met `kind: '...'` velden.
- Test-cases hebben naast `.bas` ook `.expected.txt` of `.expected.json` voor automatische diff.

## Sessie-startprotocol

1. Pull deze repo + Meta_QuickBasicEmulator
2. Lees `ROADMAP.md` in Meta_QuickBasicEmulator voor huidige milestone
3. Run `npm test` om baseline-status te zien

## Bij wijzigingen

- Spec-wijziging = bump `version.json` minor (v0.X.Y → v0.X+1.0) want breaking voor consumers
- Test-case toevoeging = bump patch
- Bij elke commit: zorg dat alle bestaande tests groen blijven

## Code-locaties

| Wat | Waar |
|---|---|
| Dialect-spec | `src/spec/dialect_*.json` |
| AST-types | `src/ast/types.ts` |
| Tests | `tests/*.bas` + `tests/expected/*.txt` |
| Test-runner | `vitest.config.ts` |
