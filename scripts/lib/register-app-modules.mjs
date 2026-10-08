// Standalone benchmarks load the shipped TS/TSX with the installed compiler.
// This does not start Next or write compiled files into the working tree.
import { registerHooks } from "node:module"
import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"

const root = new URL("../../", import.meta.url)
registerHooks({
  resolve(specifier, context, nextResolve) {
    const local = specifier.startsWith("@/") ? new URL(specifier.slice(2), root) :
      specifier.startsWith(".") && context.parentURL ? new URL(specifier, context.parentURL) : null
    if (local && !local.href.includes("/node_modules/")) {
      for (const extension of ["", ".ts", ".tsx", ".js", ".mjs"]) {
        const candidate = fileURLToPath(local) + extension
        if (existsSync(candidate) && /\.[cm]?[jt]sx?$/.test(candidate)) return nextResolve(pathToFileURL(candidate).href, context)
      }
    }
    // Next's public entrypoints are extensionless under its own bundler.
    if (["next/og", "next/server", "next/navigation"].includes(specifier)) return nextResolve(`${specifier}.js`, context)
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.startsWith(root.href) && !url.includes("/node_modules/") && /\.tsx?$/.test(url)) {
      return { format: "module", shortCircuit: true, source: ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
        fileName: fileURLToPath(url),
      }).outputText }
    }
    return nextLoad(url, context)
  },
})
