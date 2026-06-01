/**
 * Runtime-capability matrix tests — v0.0.3-Davidoff (Core sync met v0.2.0-Weiland Web)
 *
 * Verifieer dat de QBJS runtime-capability matrix correct staat: gaps zijn geregistreerd,
 * supported features zijn vol-supported, runtime-summary klopt.
 */

import { describe, it, expect } from 'vitest';
import qbjsCap from '../src/spec/runtime_capability_qbjs.json';

describe('runtime_capability_qbjs.json schema-integriteit', () => {
  it('runtime tag is qbjs', () => {
    expect(qbjsCap.runtime).toBe('qbjs');
  });

  it('runtime_commit_baseline matches vendored QBJS in _Web', () => {
    expect(qbjsCap.runtime_commit_baseline).toBe('e3ca41c62975ccc8734dd9c640cf7e9c081df2b8');
  });

  it('spec_version is 1.0', () => {
    expect(qbjsCap.spec_version).toBe('1.0');
  });
});

describe('known QBJS-gaps gemarkeerd as unsupported', () => {
  const gaps = ['GOTO', 'GOSUB', 'ON', 'LPRINT'];
  for (const stmt of gaps) {
    it(`${stmt} is supported=none`, () => {
      expect((qbjsCap.statements as Record<string, any>)[stmt]?.supported).toBe('none');
    });
  }

  it('GOTO has qbjs_behavior and workaround documented', () => {
    const goto = (qbjsCap.statements as Record<string, any>).GOTO;
    expect(goto.qbjs_behavior).toMatch(/ignoring line/);
    expect(goto.workaround).toContain('SUB');
  });

  it('RETURN is partial (FUNCTION-assignment works, GOSUB-return doesn\'t)', () => {
    expect((qbjsCap.statements as Record<string, any>).RETURN.supported).toBe('partial');
  });
});

describe('core structured statements supported=full', () => {
  const core = ['PRINT', 'INPUT', 'IF', 'FOR', 'WHILE', 'DO', 'SELECT CASE', 'SUB', 'FUNCTION', 'DIM', 'DATA', 'READ', 'END'];
  for (const stmt of core) {
    it(`${stmt} is supported=full`, () => {
      expect((qbjsCap.statements as Record<string, any>)[stmt]?.supported).toBe('full');
    });
  }
});

describe('runtime_summary klopt', () => {
  it('matches actual statement counts', () => {
    const stmts = qbjsCap.statements as Record<string, { supported: string }>;
    const counts = { full: 0, partial: 0, none: 0 };
    for (const v of Object.values(stmts)) counts[v.supported as 'full'|'partial'|'none']++;
    expect(counts.full).toBe(qbjsCap.runtime_summary.supported_statements);
    expect(counts.partial).toBe(qbjsCap.runtime_summary.partial_statements);
    expect(counts.none).toBe(qbjsCap.runtime_summary.unsupported_statements);
  });

  it('lists key_gaps array', () => {
    expect(qbjsCap.runtime_summary.key_gaps).toContain('GOTO');
    expect(qbjsCap.runtime_summary.key_gaps).toContain('GOSUB');
  });
});
