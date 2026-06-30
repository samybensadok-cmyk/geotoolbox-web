import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// Locale-aware navigation primitives. Use these (not next/link) in any
// component that should keep the user inside their locale. Chrome
// migration (header/footer/search) happens in P2; existing next/link
// usages keep working because `en` has no prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
