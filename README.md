# QuickBasicEmulator_Core

TypeScript-package met **canonieke dialect-specificaties + AST-types + test-suite** voor GW-BASIC, QBasic en QuickBASIC 4.5.

> ⚠️ **v0.0.1-Gates — Skeleton.** Spec en types nog niet gevuld. Zie [Meta_QuickBasicEmulator/ROADMAP.md](https://github.com/cpaglebbeek/Meta_QuickBasicEmulator) voor planning.

## Rol in ecosysteem

```
QuickBasicEmulator_Core (deze repo)
├── consumed by → QuickBasicEmulator_Web (path-dep)
├── consumed by → QuickBasicEmulator_X86 (vendored JSON-spec)
├── consumed by → QuickBasicEmulator_Decompiler (AST-format)
└── consumed by → QuickBasicEmulator_Android (transitief via Web)
```

## Wat hier in zit

| Pad | Inhoud |
|---|---|
| `src/spec/dialect_gwbasic.json` | GW-BASIC dialect-specificatie (statements, tokens, semantiek) |
| `src/spec/dialect_qbasic.json` | QBasic dialect-spec |
| `src/spec/dialect_qb45.json` | QuickBASIC 4.5 dialect-spec |
| `src/ast/types.ts` | AST-node-types (sub/function/label/statement/expression) |
| `tests/` | Canonieke test-suite (`.bas` voorbeelden + expected output) |

## Wat hier **niet** in zit

- Geen runtime (zit in `_Web` en `_X86`)
- Geen parser-implementatie in fase-1 (alleen spec; parser-impl ligt bij runtimes)
- Geen decompiler-code (zit in `_Decompiler`)

## Fasering

- **Fase 1 (v0.0.x)**: TypeScript-package
- **Fase 2 (v0.7.x+)**: Rust-crate met WASM-bindings + TS-types-generation
- **Fase 3 (v1.0+)**: volledige Rust-runtime

## Project + ecosystem

- **Meta:** [`cpaglebbeek/Meta_QuickBasicEmulator`](https://github.com/cpaglebbeek/Meta_QuickBasicEmulator)
- **Ecosystem:** Retro_Computing → [`cpaglebbeek/Meta_Retro_Computing`](https://github.com/cpaglebbeek/Meta_Retro_Computing)
- **Licentie:** AGPL-3.0
