import { markdown404Body, markdown404Headers } from "@/lib/agent-404"

// /404.md — the recovery document as a stable, fetchable URL.
//
// Returns a 404 status deliberately: this URL *is* the not-found response, and
// an agent that gets 200 here would reasonably record "/404.md exists" as a real
// page. The body is the same markdown the HTML 404 and the markdown twin 404
// serve, so an agent sees one consistent recovery contract wherever it lands.
export function GET() {
  return new Response(markdown404Body(), {
    status: 404,
    headers: markdown404Headers(),
  })
}
