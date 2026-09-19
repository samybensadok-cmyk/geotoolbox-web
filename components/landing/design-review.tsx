"use client"

import { useEffect, useRef, useState } from "react"
import s from "./homepage.module.css"

/** Same-origin preview harness: real homepage, real responsive breakpoints. */
export function DesignReview() {
  const frame = useRef<HTMLIFrameElement>(null)
  const [width, setWidth] = useState(1280)
  const [locale, setLocale] = useState("en")
  const [direction, setDirection] = useState("dark")
  const [reduceMotion, setReduceMotion] = useState(false)
  const [fullHeight, setFullHeight] = useState(false)
  const [height, setHeight] = useState(900)
  const [layoutCheck, setLayoutCheck] = useState("Measuring preview…")
  useEffect(() => {
    const iframe = frame.current
    let observer: ResizeObserver | undefined
    let detach: (() => void) | undefined
    const measure = () => {
      const doc = iframe?.contentDocument
      if (!doc?.body) return
      const width = doc.documentElement.clientWidth
      const overflow = Math.max(0, doc.documentElement.scrollWidth - width)
      const offenders = overflow ? [...doc.querySelectorAll<HTMLElement>("body *")].filter(el => {
        const box = el.getBoundingClientRect()
        return box.width > 0 && (box.right > width + 1 || box.left < -1) && !el.classList.contains("sr-only")
      }).slice(-4).map(el => `${el.tagName.toLowerCase()}: ${el.textContent?.trim().slice(0,45)}`).join("; ") : ""
      const images = [...doc.querySelectorAll<HTMLImageElement>("main img")]
      setLayoutCheck(`${doc.documentElement.lang} · viewport ${width}px · overflow ${overflow}px · images ${images.filter(img => img.complete && img.naturalWidth > 0).length}/${images.length}${offenders ? ` · ${offenders}` : ""}`)
    }
    const observe = () => {
      observer?.disconnect()
      detach?.()
      const doc = iframe?.contentDocument
      if (!doc?.body) return
      observer = new ResizeObserver(measure)
      observer.observe(doc.body)
      doc.addEventListener("load", measure, true)
      detach = () => doc.removeEventListener("load", measure, true)
      measure()
    }
    iframe?.addEventListener("load", observe)
    observe()
    return () => { observer?.disconnect(); detach?.(); iframe?.removeEventListener("load", observe) }
  }, [locale, width])
  const apply = (selectedDirection = direction, reduced = reduceMotion, full = fullHeight) => {
    const doc = frame.current?.contentDocument
    if (!doc) return
    let style = doc.getElementById("design-review-overrides") as HTMLStyleElement | null
    if (!style) { style = doc.createElement("style"); style.id = "design-review-overrides"; doc.head.appendChild(style) }
    style.textContent = `${selectedDirection === "light" ? `
      .${s.hero}{--hero-ink:#111827;--hero-muted:#4b5563;--hero-accent:var(--color-accent-700);--hero-button-ink:#fff;--hero-line:#d1d5db;--hero-surface:#fff;background:#f8fafc;border-color:#e5e7eb}
      .${s.report}{box-shadow:0 18px 50px -24px #193e3740}
      .${s.engineStrip} li{color:#4b5563}
      header[data-homepage=true]{--nav-bg:#fff;--nav-ink:#1f2937;--nav-line:#e5e7eb}
    ` : ""}
    ${selectedDirection === "left" ? `
      .${s.heroIntro}{text-align:left;margin-left:0}
      .${s.headline}{margin-left:0}
      .${s.rotator}{justify-content:start}
      .${s.rotator}>span{justify-content:flex-start}
      .${s.heroDescription}{margin-left:0}
      .${s.heroIntro} .${s.actions}{justify-content:start}
      .${s.heroIntro} .${s.micro}{margin-left:0}
      @media(max-width:640px){.${s.heroIntro} .${s.motionToggle}{margin-left:0}}
    ` : ""}
      ${reduced ? `.engine-rotator>span{animation:none!important;opacity:0!important}.engine-rotator>span:first-child{opacity:1!important;transform:none!important} .${s.motionToggle}{display:none}` : ""}`
    setHeight(full ? Math.max(900,doc.documentElement.scrollHeight) : 900)
  }
  const choice: React.CSSProperties = {padding:"9px 13px",border:"1px solid #cbd5e1",borderRadius:6,background:"white",fontSize:13}
  return <section style={{background:"#f1f5f9",padding:"28px 20px",color:"#111827"}}>
    <div style={{maxWidth:1280,margin:"auto"}}>
      <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:2}}>GEO Toolbox / Design review</p>
      <h1 style={{fontSize:28,fontWeight:600,letterSpacing:-1,marginTop:5}}>Refining the direction.</h1>
      <p style={{fontSize:13,marginTop:8,maxWidth:850}}>Dark and centered is the proposed direction. Compare it with light and centered, or dark and left-aligned, using the same content and original teal palette. This is a working design review, not a live A/B test.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",margin:"18px 0"}}>
        <label style={{fontSize:12}}>Direction <select aria-label="Design direction" value={direction} style={choice} onChange={event=>{const v=event.target.value;setDirection(v);apply(v)}}><option value="dark">Dark · Centered</option><option value="light">Light · Centered</option><option value="left">Dark · Left</option></select></label>
        <label style={{fontSize:12}}>Width <select aria-label="Viewport width" value={width} style={choice} onChange={event=>{setWidth(Number(event.target.value));setFullHeight(false);setHeight(900)}}>{[320,375,390,640,768,1024,1280].map(n=><option value={n} key={n}>{n}px</option>)}</select></label>
        <label style={{fontSize:12}}>Language <select aria-label="Preview language" value={locale} style={choice} onChange={event=>setLocale(event.target.value)}>{["en","fr","es","de","nl"].map(l=><option key={l}>{l}</option>)}</select></label>
        <label style={{fontSize:12,display:"flex",gap:6}}><input type="checkbox" checked={reduceMotion} onChange={event=>{setReduceMotion(event.target.checked);apply(direction,event.target.checked)}} /> Freeze motion</label>
        <label style={{fontSize:12,display:"flex",gap:6}}><input type="checkbox" checked={fullHeight} onChange={event=>{setFullHeight(event.target.checked);apply(direction,reduceMotion,event.target.checked)}} /> Full page</label>
        <a href={locale==="en"?"/":`/${locale}`} style={{fontSize:12,textDecoration:"underline"}}>Open homepage</a>
      </div>
      <p role="status" aria-label="Layout check" style={{fontSize:12,marginBottom:14}}>{layoutCheck}</p>
    </div>
    <div style={{overflowX:"auto",paddingBottom:20}}><iframe title="Homepage preview" ref={frame} src={locale==="en"?"/":`/${locale}`} onLoad={()=>apply()} style={{display:"block",width,height,margin:"0 auto",border:"1px solid #cbd5e1",background:"white",borderRadius:8,maxWidth:"none"}} /></div>
  </section>
}
