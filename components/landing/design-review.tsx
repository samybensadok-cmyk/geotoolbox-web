"use client"

import { useEffect, useRef, useState } from "react"
import s from "./homepage.module.css"

/** Same-origin preview harness: real homepage, real responsive breakpoints. */
export function DesignReview() {
  const frame = useRef<HTMLIFrameElement>(null)
  const [width, setWidth] = useState(1280)
  const [locale, setLocale] = useState("en")
  const [dark, setDark] = useState(false)
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
  const apply = (isDark = dark, reduced = reduceMotion, full = fullHeight) => {
    const doc = frame.current?.contentDocument
    if (!doc) return
    let style = doc.getElementById("design-review-overrides") as HTMLStyleElement | null
    if (!style) { style = doc.createElement("style"); style.id = "design-review-overrides"; doc.head.appendChild(style) }
    style.textContent = `${isDark ? `
      .${s.hero}{background:#030712;color:#f9fafb;border-color:#1f2937}
      .${s.heroIntro}{text-align:left;margin-left:0}
      .${s.heroIntro} .${s.eyebrow}{color:#5eead4}
      .${s.headline}{margin-left:0;max-width:900px}
      .${s.rotator}{justify-content:start;color:#5eead4}
      .${s.rotator}>span{justify-content:flex-start}
      .${s.heroDescription}{color:#d1d5db;margin-left:0}
      .${s.heroIntro} .${s.actions}{justify-content:start}
      .${s.heroIntro} .${s.primary}{background:#5eead4;border-color:#5eead4;color:#042f2e}
      .${s.heroIntro} .${s.secondary}{background:transparent;border-color:#4b5563;color:#f9fafb}
      .${s.heroIntro} .${s.micro}{color:#9ca3af;margin-left:0}
      .${s.heroIntro} .${s.motionToggle}{color:#99f6e4;border-color:#374151;background:transparent}
      .${s.engineStrip} li,.${s.engineStrip}>p,.${s.reportFigure} figcaption{color:#cbd5e1}
      @media(max-width:640px){.${s.heroIntro} .${s.motionToggle}{margin-left:0}}
    ` : ""}
      ${reduced ? `.engine-rotator>span{animation:none!important;opacity:0!important}.engine-rotator>span:first-child{opacity:1!important;transform:none!important} .${s.motionToggle}{display:none}` : ""}`
    setHeight(full ? Math.max(900,doc.documentElement.scrollHeight) : 900)
  }
  const choice: React.CSSProperties = {padding:"9px 13px",border:"1px solid #cbd5e1",borderRadius:6,background:"white",fontSize:13}
  return <section style={{background:"#f1f5f9",padding:"28px 20px",color:"#111827"}}>
    <div style={{maxWidth:1280,margin:"auto"}}>
      <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:2}}>GEO Toolbox / Design review</p>
      <h1 style={{fontSize:28,fontWeight:600,letterSpacing:-1,marginTop:5}}>Two directions. One working homepage.</h1>
      <p style={{fontSize:13,marginTop:8,maxWidth:850}}>A: light, focused product presentation. B: darker, editorial opening. Use the controls to compare the actual page at different widths and languages. These are design options, not a live A/B test.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",margin:"18px 0"}}>
        <label style={{fontSize:12}}>Direction <select aria-label="Design direction" value={dark?"dark":"light"} style={choice} onChange={event=>{const v=event.target.value==="dark";setDark(v);apply(v)}}><option value="light">A · Light</option><option value="dark">B · Dark</option></select></label>
        <label style={{fontSize:12}}>Width <select aria-label="Viewport width" value={width} style={choice} onChange={event=>{setWidth(Number(event.target.value));setFullHeight(false);setHeight(900)}}>{[320,375,390,640,768,1024,1280].map(n=><option value={n} key={n}>{n}px</option>)}</select></label>
        <label style={{fontSize:12}}>Language <select aria-label="Preview language" value={locale} style={choice} onChange={event=>setLocale(event.target.value)}>{["en","fr","es","de","nl"].map(l=><option key={l}>{l}</option>)}</select></label>
        <label style={{fontSize:12,display:"flex",gap:6}}><input type="checkbox" checked={reduceMotion} onChange={event=>{setReduceMotion(event.target.checked);apply(dark,event.target.checked)}} /> Freeze motion</label>
        <label style={{fontSize:12,display:"flex",gap:6}}><input type="checkbox" checked={fullHeight} onChange={event=>{setFullHeight(event.target.checked);apply(dark,reduceMotion,event.target.checked)}} /> Full page</label>
        <a href={locale==="en"?"/":`/${locale}`} style={{fontSize:12,textDecoration:"underline"}}>Open homepage</a>
      </div>
      <p role="status" aria-label="Layout check" style={{fontSize:12,marginBottom:14}}>{layoutCheck}</p>
    </div>
    <div style={{overflowX:"auto",paddingBottom:20}}><iframe title="Homepage preview" ref={frame} src={locale==="en"?"/":`/${locale}`} onLoad={()=>apply()} style={{display:"block",width,height,margin:"0 auto",border:"1px solid #cbd5e1",background:"white",borderRadius:8,maxWidth:"none"}} /></div>
  </section>
}
