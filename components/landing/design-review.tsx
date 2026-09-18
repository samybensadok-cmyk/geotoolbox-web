"use client"

import { useRef, useState } from "react"
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
  const apply = (isDark = dark, reduced = reduceMotion, full = fullHeight) => {
    const doc = frame.current?.contentDocument
    if (!doc) return
    let style = doc.getElementById("design-review-overrides") as HTMLStyleElement | null
    if (!style) { style = doc.createElement("style"); style.id = "design-review-overrides"; doc.head.appendChild(style) }
    style.textContent = `${isDark ? `
      .${s.hero}{background:#102d29;color:#f3f5ec;border-color:#31504a}
      .${s.heroIntro}{text-align:left;margin-left:0}
      .${s.heroIntro} .${s.eyebrow}{color:#a5c8b2}
      .${s.headline}{margin-left:0;max-width:900px}
      .${s.rotator}{justify-content:start;color:#b5d7b4}
      .${s.heroDescription}{color:#bfcec3;margin-left:0}
      .${s.heroIntro} .${s.actions}{justify-content:start}
      .${s.heroIntro} .${s.primary}{background:#c0dbb5;border-color:#c0dbb5;color:#143e31}
      .${s.heroIntro} .${s.secondary}{background:transparent;border-color:#648175;color:#edf5eb}
      .${s.heroIntro} .${s.micro}{color:#a9bdb0;margin-left:0}
      .${s.heroIntro} .${s.motionToggle}{color:#b6cbbb;border-color:#547164;background:transparent}
      .${s.engineStrip} li,.${s.engineStrip}>p,.${s.reportFigure} figcaption{color:#b3c6b9}
      @media(max-width:640px){.${s.heroIntro} .${s.motionToggle}{margin-left:0}}
    ` : ""}
      ${reduced ? `.engine-rotator>span{animation:none!important;opacity:0!important}.engine-rotator>span:first-child{opacity:1!important;transform:none!important} .${s.motionToggle}{display:none}` : ""}`
    setHeight(full ? Math.max(900,doc.documentElement.scrollHeight) : 900)
  }
  const choice: React.CSSProperties = {padding:"9px 13px",border:"1px solid #cbd5cf",borderRadius:6,background:"white",fontSize:13}
  return <section style={{background:"#e7ece8",padding:"28px 20px",color:"#173c35"}}>
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
    </div>
    <div style={{overflowX:"auto",paddingBottom:20}}><iframe title="Homepage preview" ref={frame} src={locale==="en"?"/":`/${locale}`} onLoad={()=>apply()} style={{display:"block",width,height,margin:"0 auto",border:"1px solid #cbd5cf",background:"white",borderRadius:8,maxWidth:"none"}} /></div>
  </section>
}
