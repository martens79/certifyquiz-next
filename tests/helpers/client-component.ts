import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Execute the real component with React's hooks and explicit boundary mocks.
// No Next server, database, payment provider or analytics network is involved.
export function clientComponent(file: string, mocks: Record<string, unknown>, globals: Record<string, unknown> = {}) {
  return clientModule(file, mocks, globals).default as React.ComponentType<any>;
}

export function clientModule(file: string, mocks: Record<string, unknown>, globals: Record<string, unknown> = {}) {
  const require = createRequire(import.meta.url);
  const cjsModule = { exports: {} as Record<string, any> };
  const code = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  runInNewContext(code, {
    module: cjsModule, exports: cjsModule.exports,
    require: (name: string) => name in mocks ? mocks[name] : require(name),
    console, process, URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
    ...globals,
  }, { filename: file });
  return cjsModule.exports;
}
