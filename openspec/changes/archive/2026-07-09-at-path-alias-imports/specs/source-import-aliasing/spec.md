## ADDED Requirements

### Requirement: `@` source import alias

The project SHALL resolve `@/` imports to the `src/` directory for TypeScript source files and test files.

#### Scenario: Resolve source alias in tests

- **WHEN** a test file imports `@/core/index`
- **THEN** the toolchain SHALL resolve that path to `src/core/index.ts`

##### Example: core index import

- **GIVEN** a test file that previously imported `../../src/core/index`
- **WHEN** the import is rewritten to `@/core/index`
- **THEN** type checking and test execution succeed without changing runtime behavior

### Requirement: alias-backed import normalization

The project SHALL allow existing internal imports under `src/` and `tests/` to be normalized from relative paths to `@/` paths without changing module behavior.

#### Scenario: Normalize source internal import

- **WHEN** a source module under `src/` rewrites a relative import to an `@/` import
- **THEN** the imported symbols SHALL remain identical to the previous relative-path behavior

#### Scenario: Normalize test imports

- **WHEN** a test module rewrites a relative import to an `@/` import
- **THEN** the test SHALL continue to compile and execute against the same source module
