/**
 * Resolver hook: let `node --experimental-strip-types` load the app's own TS.
 *
 * Next.js/tsconfig let a module write `import { x } from "./config"`. Node's ESM
 * resolver requires the extension, so importing any real lib module from a gate
 * script dies with ERR_MODULE_NOT_FOUND on the FIRST transitive hop — which is
 * why gates here have historically re-implemented the thing they check instead
 * of importing it. Re-implementing is the failure mode: the gate then passes
 * while the shipped file is broken.
 *
 * This maps extensionless relative specifiers onto the file that exists. Used as
 *   node --experimental-strip-types --import ./scripts/ts-extensionless-resolve.mjs <gate>
 *
 * Path ALIASES (`@/lib/...`) are deliberately NOT handled: those only appear in
 * app/ route and page files, which a gate should not be importing — it should
 * import the lib the route delegates to.
 */
import { registerHooks } from "node:module"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

const CANDIDATES = [".ts", ".tsx", ".js", ".mjs", "/index.ts", "/index.js"]

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier) && context.parentURL) {
      for (const ext of CANDIDATES) {
        const candidate = new URL(specifier + ext, context.parentURL)
        if (existsSync(fileURLToPath(candidate))) {
          return nextResolve(specifier + ext, context)
        }
      }
    }
    return nextResolve(specifier, context)
  },
})
