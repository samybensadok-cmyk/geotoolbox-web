export const toolPageCopy: Record<string, { name: string; title: string; description: string; outputs: string[] }> = {
  "keyword-to-prompts": {
    "name": "Keyword to AI Prompts",
    "title": "Find the questions worth tracking.",
    "description": "Turn one keyword into around 15 AI prompts. See which questions are likely to trigger brand recommendations.",
    "outputs": [
      "6 intent groups",
      "Brand-surfacing prompts flagged",
      "Copy your prompt set"
    ]
  },
  "query-fanout": {
    "name": "AI Query Fan-Out",
    "title": "See the searches behind an AI answer.",
    "description": "Enter a topic to reveal live Gemini sub-queries and the intents behind them. Bring your own Gemini API key.",
    "outputs": [
      "Live search sub-queries",
      "Intent clusters",
      "Your key stays in your browser"
    ]
  },
  "ai-readiness": {
    "name": "AI-Readiness Score",
    "title": "Can AI read your website?",
    "description": "Check five technical foundations and find the gaps to investigate first. Enter a domain to get your score.",
    "outputs": [
      "5 foundation checks",
      "A score with findings",
      "A starting point for fixes"
    ]
  },
  "agent-readiness-scanner": {
    "name": "Agent Readiness Scanner",
    "title": "Find what stops AI agents using your site.",
    "description": "Run a full scan of crawler access, page rendering and technical readiness. Get a score and a breakdown of the findings.",
    "outputs": [
      "Live crawler fetches",
      "5 readiness pillars",
      "Level 0–4 verdict"
    ]
  },
  "ai-crawler-checker": {
    "name": "AI Crawler Checker",
    "title": "See which AI bots your robots.txt blocks.",
    "description": "Check your domain against 34 AI crawlers. See the allow or block verdict and the rule behind it.",
    "outputs": [
      "34 AI crawlers",
      "Rules behind each verdict",
      "Clear next steps"
    ]
  },
  "robots-txt-tester": {
    "name": "robots.txt Tester & Checker",
    "title": "Test the rules before they block the wrong page.",
    "description": "Enter a site or paste your robots.txt. Check URLs by crawler and see which rule decides the result.",
    "outputs": [
      "URL-by-URL verdicts",
      "Crawler-specific checks",
      "Matching rules explained"
    ]
  },
  "robots-txt-generator": {
    "name": "robots.txt Generator",
    "title": "Build a robots.txt you can review.",
    "description": "Start with a preset, add your sitemap and choose your AI crawler rules. Preview the file as you edit.",
    "outputs": [
      "WordPress & Shopify presets",
      "AI crawler controls",
      "Copy or download the file"
    ]
  },
  "sitemap-extractor": {
    "name": "Sitemap URL Extractor",
    "title": "Get the URLs. Find the sitemap issues.",
    "description": "Enter a domain or XML sitemap to extract URLs, validate the structure and export your list.",
    "outputs": [
      "Sitemap indexes supported",
      "Optional URL status checks",
      "CSV, TXT & JSON exports"
    ]
  },
  "llms-txt-generator": {
    "name": "llms.txt Generator",
    "title": "Turn your sitemap into a readable llms.txt.",
    "description": "Generate a draft from your existing pages, review the grouped links and download the file.",
    "outputs": [
      "Real page titles",
      "Grouped sections",
      "Optional llms-full.txt"
    ]
  },
  "llms-txt-checker": {
    "name": "llms.txt Checker",
    "title": "Check your llms.txt before you publish it.",
    "description": "Validate the format, test its links and see a score based on a published rubric.",
    "outputs": [
      "Format validation",
      "Link checks",
      "A 0–100 quality score"
    ]
  }
}
