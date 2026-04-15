"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

const PROJECT_ID = "wca9w8v3al"

export function ClarityAnalytics() {
  useEffect(() => {
    Clarity.init(PROJECT_ID)
  }, [])

  return null
}
