"use client"

import { useState } from "react"
import Link from "next/link"

/**
 * Free "AI Query Fan-Out" demo — BYOK (bring your own key), 100% client-side.
 *
 * The user pastes their OWN Google AI Studio (Gemini) key — required — and
 * optionally a Perplexity key. Every request goes DIRECTLY from the browser to
 * the engine's official endpoint; the keys never touch a GEO Toolbox server, are
 * never logged, proxied, or stored (component state only, cleared on reload).
 *
 *   1. Gemini grounding call → candidates[0].groundingMetadata.webSearchQueries
 *      = the real sub-queries Gemini fanned out (kind "fired").
 *   2. Perplexity sonar (optional) → related_questions (kind "related").
 *   3. Gemini structured-JSON call clusters the queries into intents and marks
 *      which engines share each (the cross-engine divergence map).
 *
 * Graceful degradation: if clustering fails we still show the raw fan-out; if
 * Perplexity fails the demo runs on Gemini alone. CORS is confirmed for both
 * endpoints; ChatGPT (CORS-blocked) + Grok + real volume/coverage/citations are
 * the in-app version's job — said plainly in the UI.
 */

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const

type Kind = "fired" | "related"
interface FanQuery {
  q: string
  engine: string
  kind: Kind
}
interface Cluster {
  intent: string
  format: string
  engines: string[]
}
interface FanResult {
  seed: string
  engines: string[]
  queries: FanQuery[]
  clusters: Cluster[] | null
  tookMs: number
}

class ApiError extends Error {
  constructor(public engine: string, public status: number, message: string) {
    super(message)
  }
}

function friendlyError(e: unknown): string {
  if (e instanceof ApiError) {
    const where = e.engine === "Gemini" ? "Google AI Studio" : e.engine
    if (e.status === 400 || e.status === 401 || e.status === 403)
      return `${e.engine} rejected the key (${e.status}). Check it's a valid ${where} API key with access to the model.`
    if (e.status === 429) return `${e.engine} is rate-limiting your key (429). Wait a moment and try again.`
    if (e.status >= 500) return `${e.engine} had a server error (${e.status}). Try again in a moment.`
    return `${e.engine}: ${e.message || `request failed (${e.status})`}`
  }
  if (e instanceof TypeError) return "A request was blocked or the network failed. Check your connection and that the key is correct."
  return e instanceof Error ? e.message : "Something went wrong. Try again."
}

/* ---------------------------------------------------------------- engines -- */

async function geminiGenerate(key: string, body: unknown): Promise<{ data: Record<string, unknown>; model: string }> {
  let lastErr: ApiError | null = null
  for (const model of GEMINI_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    )
    if (res.ok) return { data: await res.json(), model }
    const err = await res.json().catch(() => null)
    lastErr = new ApiError("Gemini", res.status, err?.error?.message ?? "")
    // Only fall through to the next model when the first one isn't available to this key.
    if (res.status !== 404) break
  }
  throw lastErr ?? new ApiError("Gemini", 0, "no response")
}

async function geminiFanout(key: string, seed: string): Promise<FanQuery[]> {
  const { data } = await geminiGenerate(key, {
    contents: [{ parts: [{ text: seed }] }],
    tools: [{ google_search: {} }],
  })
  const cand = (data?.candidates as Array<Record<string, unknown>> | undefined)?.[0]
  const grounding = cand?.groundingMetadata as { webSearchQueries?: string[] } | undefined
  const queries = grounding?.webSearchQueries ?? []
  // Dedupe, trim, cap.
  const seen = new Set<string>()
  const out: FanQuery[] = []
  for (const raw of queries) {
    const q = String(raw).trim()
    const k = q.toLowerCase()
    if (q && !seen.has(k)) {
      seen.add(k)
      out.push({ q, engine: "Gemini", kind: "fired" })
    }
  }
  return out
}

async function perplexityFanout(key: string, seed: string): Promise<FanQuery[]> {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "sonar",
      messages: [{ role: "user", content: seed }],
      return_related_questions: true,
      max_tokens: 400,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new ApiError("Perplexity", res.status, (err?.error?.message as string) ?? (err?.detail as string) ?? "")
  }
  const data = await res.json()
  const rq: string[] = data?.related_questions ?? []
  const seen = new Set<string>()
  const out: FanQuery[] = []
  for (const raw of rq) {
    const q = String(raw).trim()
    const k = q.toLowerCase()
    if (q && !seen.has(k)) {
      seen.add(k)
      out.push({ q, engine: "Perplexity", kind: "related" })
    }
  }
  return out
}

async function clusterQueries(key: string, seed: string, queries: FanQuery[]): Promise<Cluster[] | null> {
  const byEngine: Record<string, string[]> = {}
  for (const q of queries) (byEngine[q.engine] ??= []).push(q.q)
  const listing = Object.entries(byEngine)
    .map(([engine, qs]) => `${engine}:\n${qs.map((q) => `- ${q}`).join("\n")}`)
    .join("\n\n")

  const prompt =
    `You are analysing the sub-queries that AI engines fanned out while answering the topic "${seed}".\n\n` +
    `Queries by engine:\n${listing}\n\n` +
    `Cluster queries that share the same user intent. Return 5-10 clusters, ordered by importance. ` +
    `For each cluster give: "intent" (a 3-6 word label for the question being asked), "format" (the single best content format to win it, e.g. "comparison table", "how-to guide", "listicle", "FAQ answer", "pricing page"), and "engines" (the distinct engine names — exactly as written above — whose queries fall in this cluster).`

  try {
    const { data } = await geminiGenerate(key, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              intent: { type: "STRING" },
              format: { type: "STRING" },
              engines: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["intent", "engines"],
          },
        },
      },
    })
    const cand = (data?.candidates as Array<Record<string, unknown>> | undefined)?.[0]
    const parts = (cand?.content as { parts?: Array<{ text?: string }> } | undefined)?.parts ?? []
    const text = parts.map((p) => p.text ?? "").join("")
    if (!text) return null
    const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim()
    const parsed = JSON.parse(cleaned) as Array<{ intent?: string; format?: string; engines?: string[] }>
    if (!Array.isArray(parsed)) return null
    const validEngines = new Set(Object.keys(byEngine))
    return parsed
      .filter((c) => c && typeof c.intent === "string" && Array.isArray(c.engines))
      .map((c) => ({
        intent: String(c.intent).slice(0, 80),
        format: String(c.format ?? "").slice(0, 40),
        engines: [...new Set((c.engines ?? []).map(String).filter((e) => validEngines.has(e)))],
      }))
      .filter((c) => c.engines.length > 0)
      .slice(0, 12)
  } catch {
    return null // graceful: raw fan-out still shows
  }
}

/* ------------------------------------------------------------------ view -- */

export function QueryFanoutWidget() {
  const [geminiKey, setGeminiKey] = useState("")
  const [pplxKey, setPplxKey] = useState("")
  const [showPplx, setShowPplx] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const [seed, setSeed] = useState("")
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<string>("")
  const [result, setResult] = useState<FanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function run(topic: string) {
    const value = topic.trim()
    if (!geminiKey.trim()) { setError("Add your Google AI Studio (Gemini) key to run the demo."); return }
    if (!value) { setError("Enter a topic or keyword to fan out."); return }

    setLoading(true); setError(null); setNotice(null); setResult(null)
    const started = Date.now()
    try {
      setStage("Fanning out across engines…")
      const tasks: Promise<FanQuery[]>[] = [geminiFanout(geminiKey.trim(), value)]
      const usePplx = showPplx && pplxKey.trim().length > 0
      if (usePplx) tasks.push(perplexityFanout(pplxKey.trim(), value).catch((e) => {
        // Perplexity is optional — degrade, don't fail the whole run.
        setNotice(`Perplexity skipped: ${friendlyError(e)}`)
        return [] as FanQuery[]
      }))

      const [geminiQ, pplxQ = []] = await Promise.all(tasks)
      const queries = [...geminiQ, ...pplxQ]
      if (queries.length === 0) {
        setError("No fan-out queries came back. Gemini didn't ground this topic — try a more search-like topic (e.g. “best CRM for startups”).")
        return
      }
      const engines = [...new Set(queries.map((q) => q.engine))]

      setStage("Clustering into intents…")
      const clusters = await clusterQueries(geminiKey.trim(), value, queries)

      setResult({ seed: value, engines, queries, clusters, tookMs: Date.now() - started })
    } catch (e) {
      setError(friendlyError(e))
    } finally {
      setLoading(false); setStage("")
    }
  }

  const inputCls =
    "min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:opacity-60"

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={(e) => { e.preventDefault(); run(seed) }}
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
      >
        {/* Keys */}
        <label htmlFor="qf-gemini" className="mb-1 block text-[12px] font-medium text-gray-600">
          Google AI Studio (Gemini) API key <span className="font-normal text-gray-400">— required, free at aistudio.google.com</span>
        </label>
        <div className="flex items-stretch gap-2">
          <input
            id="qf-gemini"
            type={showKeys ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            placeholder="AIza…"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            disabled={loading}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => setShowKeys((s) => !s)}
            className="shrink-0 rounded-xl border border-gray-200 px-3 text-[12px] font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            aria-pressed={showKeys}
          >
            {showKeys ? "Hide" : "Show"}
          </button>
        </div>

        {showPplx ? (
          <div className="mt-3">
            <label htmlFor="qf-pplx" className="mb-1 block text-[12px] font-medium text-gray-600">
              Perplexity API key <span className="font-normal text-gray-400">— optional, adds a 2nd engine for the divergence map</span>
            </label>
            <input
              id="qf-pplx"
              type={showKeys ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              placeholder="pplx-…"
              value={pplxKey}
              onChange={(e) => setPplxKey(e.target.value)}
              disabled={loading}
              className={`w-full ${inputCls}`}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPplx(true)}
            disabled={loading}
            className="mt-2 text-[12.5px] font-medium text-accent-700 underline-offset-2 hover:underline disabled:opacity-50"
          >
            + Add a Perplexity key for a cross-engine divergence map
          </button>
        )}

        {/* Seed */}
        <label htmlFor="qf-seed" className="mb-1 mt-4 block text-[12px] font-medium text-gray-600">
          Topic or keyword to fan out
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="qf-seed"
            type="text"
            autoComplete="off"
            placeholder="best CRM for startups"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            disabled={loading}
            maxLength={120}
            className={inputCls}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-900 px-6 py-3 text-[15px] font-semibold text-white transition-all hover:bg-accent-800 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                Running…
              </>
            ) : "Run fan-out"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-gray-400">Try:</span>
          {["best CRM for startups", "enterprise password manager", "ai seo tools"].map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={loading}
              onClick={() => setSeed(ex)}
              className="rounded-full border border-gray-200 px-3 py-1 font-mono text-[12px] text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-700 disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Key-safety notice */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-accent-100 bg-accent-50/50 px-3.5 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M8 1.5 2.5 4v3.5c0 3 2.3 5.6 5.5 7 3.2-1.4 5.5-4 5.5-7V4L8 1.5Z" strokeLinejoin="round" />
            <path d="M5.5 8 7.2 9.7 10.5 6.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[12px] leading-relaxed text-gray-600">
            <span className="font-semibold text-gray-800">Your keys stay in your browser.</span> Requests go straight to Google
            and Perplexity — never to a GEO Toolbox server. Nothing is logged, proxied, or stored; reload the page and the keys are gone.
          </p>
        </div>
      </form>

      {loading && (
        <p className="mt-4 text-center text-[13px] text-gray-500" aria-live="polite">
          {stage || "Working…"}
        </p>
      )}
      {error && !loading && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700" role="alert">
          {error}
        </div>
      )}
      {notice && !loading && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          {notice}
        </div>
      )}

      {result && !loading && <FanResultView result={result} />}
    </div>
  )
}

/* --------------------------------------------------------------- results -- */

function FanResultView({ result }: { result: FanResult }) {
  const { seed, engines, queries, clusters } = result
  const fired = queries.filter((q) => q.kind === "fired").length
  const shared = clusters?.filter((c) => c.engines.length >= 2).length ?? 0
  const whitespace = clusters?.filter((c) => c.engines.length === 1).length ?? 0

  return (
    <div className="mt-6 space-y-5">
      {/* Stat strip */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Fan-out for &ldquo;{seed}&rdquo;
        </p>
        <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 text-center">
          {[
            { v: String(queries.length), l: "queries" },
            { v: clusters ? String(clusters.length) : "—", l: "clusters" },
            { v: String(engines.length), l: engines.length === 1 ? "engine" : "engines" },
          ].map((s) => (
            <div key={s.l} className="px-2">
              <div className="font-mono text-2xl font-bold tabular-nums text-accent-700">{s.v}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-gray-500">{s.l}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-gray-500">
          {fired} real fired {fired === 1 ? "query" : "queries"} from {engines.join(" + ")}
          {whitespace > 0 && <> · {shared} shared intents · {whitespace} single-engine whitespace</>}.
          Live engine output — your keys, your data.
        </p>
      </div>

      {/* Divergence map — only meaningful with 2+ engines */}
      {clusters && clusters.length > 0 && engines.length >= 2 && (
        <DivergenceMatrix clusters={clusters} engines={engines} />
      )}

      {/* Clusters as a list when single-engine (no divergence to show) */}
      {clusters && clusters.length > 0 && engines.length < 2 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Intents found</p>
          <ul className="mt-4 divide-y divide-gray-100">
            {clusters.map((c) => (
              <li key={c.intent} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-[14px] font-medium text-gray-900">{c.intent}</span>
                {c.format && (
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                    {c.format}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] text-gray-500">
            Add a Perplexity key above to compare engines and get the cross-engine divergence map.
          </p>
        </div>
      )}

      {/* The raw fan-out */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
          Real fan-out queries · {queries.length}
        </p>
        <ul className="mt-4 divide-y divide-gray-100">
          {queries.map((q, i) => (
            <li key={`${q.engine}-${i}`} className="flex items-center justify-between gap-3 py-2.5">
              <span className="min-w-0 truncate font-mono text-[13px] text-gray-800">{q.q}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-[10px] text-gray-500">{q.engine}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                    q.kind === "fired" ? "bg-accent-50 text-accent-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {q.kind === "fired" ? "Fired" : "Related"}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {!clusters && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
            Clustering didn&apos;t return clean JSON this time — the raw fan-out above is still real. Re-run to try the divergence map again.
          </p>
        )}
      </div>

      {/* Funnel CTA */}
      <div className="rounded-2xl border border-gray-900 bg-gray-950 p-6 sm:p-7">
        <h3 className="text-lg font-bold tracking-tight text-white">That&apos;s the browser-runnable slice.</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-300">
          The in-app version adds the engines a browser can&apos;t reach (ChatGPT, Grok), real search volume, your page&apos;s
          coverage of each intent, the citation landscape, and a ranked content worklist — on our keys, metered per scan.
        </p>
        <div className="mt-5">
          <Link
            href="/features/query-fanout"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
          >
            See the full feature
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function DivergenceMatrix({ clusters, engines }: { clusters: Cluster[]; engines: string[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-gray-100 bg-gray-50 px-5 py-3">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">Intents × engines</span>
        <div className="flex items-center gap-3 font-mono text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-700" /> shared</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-600" /> whitespace</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <caption className="sr-only">
            Which AI engines fanned out a query for each intent. A filled dot means that engine fired a query for it.
          </caption>
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Intent</th>
              {engines.map((e) => (
                <th key={e} scope="col" className="px-2 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">{e}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clusters.map((c) => {
              const isWhitespace = c.engines.length === 1
              return (
                <tr key={c.intent} className={isWhitespace ? "bg-amber-50/50" : ""}>
                  <th scope="row" className="px-5 py-3.5 text-left font-normal">
                    <span className="text-[13px] font-medium text-gray-900">{c.intent}</span>
                    {isWhitespace && (
                      <span className="ml-2 rounded-full border border-dashed border-amber-400 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-700">
                        Whitespace
                      </span>
                    )}
                  </th>
                  {engines.map((e) => {
                    const on = c.engines.includes(e)
                    return (
                      <td key={e} className="px-2 py-3.5 text-center">
                        {on ? (
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${isWhitespace ? "bg-amber-600" : "bg-accent-700"}`}
                            aria-label={`${c.intent} — ${e}: fired`}
                          >
                            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-block h-2.5 w-2.5 rounded-full border border-gray-300 bg-white" aria-label={`${c.intent} — ${e}: not fired`} />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
