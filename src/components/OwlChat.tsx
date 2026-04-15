import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Message { text: string; from: 'bot' | 'user'; }

const REPLIES = [
  'nafis is a lazy failure',
];

export default function OwlChat() {
  const cvRef   = useRef<HTMLCanvasElement>(null);
  const scRef   = useRef<HTMLDivElement>(null);
  const msgsRef = useRef<HTMLDivElement>(null);
  const [open, setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey! I'm Nafis's owl. Ask me about his research, projects, or experience.", from: 'bot' }
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const replyIdx = useRef(0);

  const stateRef = useRef({
    mode: 'idle' as 'idle' | 'opening' | 'open' | 'closing',
    an: 0,
    ox: 0, oy: 0, oxv: 0, oyv: 0,
    sc: 0.55, scv: 0,
    ws: 0, wsv: 0,
    elx: 0, ely: 0, elvx: 0, elvy: 0,
    erx: 0, ery: 0, ervx: 0, ervy: 0,
    dil: 0.3, dilv: 0,
    blid: 0, ba: false, bp: 0, bt: 3.8, br: 0,
    mx: 0, my: 0,
  });

  // Sync open state into ref
  const openRef = useRef(false);
  openRef.current = open;

  useEffect(() => {
    const cv = cvRef.current;
    const sc = scRef.current;
    if (!cv || !sc) return;
    const g = cv.getContext('2d')!;
    const W = 420, H = 580;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width  = W * dpr; cv.height = H * dpr;
    cv.style.width  = W + 'px'; cv.style.height = H + 'px';
    g.scale(dpr, dpr);

    const S = stateRef.current;
    S.ox = W - 62; S.oy = H - 66; // idle position (bottom-right)
    S.mx = W / 2;  S.my = H + 100;

    const IT = { x: W - 62, y: H - 66, s: 0.55 };
    const OT = { x: W / 2,  y: 193,    s: 0.92 };
    const AS = 0.019;

    function spr(p: number, t: number, v: number, k = 0.07, d = 0.72) {
      const f = (t - p) * k - v * d;
      return { p: p + v + f, v: v + f };
    }
    function eio(t: number) {
      return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
    }

    function wing(cx: number, cy: number, s: number, t: number, sd: number) {
      if (t < 0.01) return;
      const shx = cx+sd*18*s, shy = cy+5*s;
      const tipx = cx+sd*142*t*s, tipy = cy+(5+28*t)*s;
      const c1x = cx+sd*62*t*s, c1y = cy-32*t*s;
      const c2x = cx+sd*112*t*s, c2y = cy+4*t*s;
      const bc1x = cx+sd*50*t*s, bc1y = cy+(58+8*t)*s;
      const bx = cx+sd*20*s, by = cy+54*s;
      const wg = g.createLinearGradient(shx, shy, tipx, tipy);
      wg.addColorStop(0, '#1a4d7a'); wg.addColorStop(.5, '#0c3d66'); wg.addColorStop(1, '#062b4a');
      g.beginPath(); g.moveTo(shx, shy);
      g.bezierCurveTo(c1x, c1y, c2x, c2y, tipx, tipy);
      g.bezierCurveTo(bc1x, bc1y, bx+sd*12*s, by, bx, by);
      g.closePath(); g.fillStyle = wg; g.fill();
      g.beginPath(); g.moveTo(shx, shy);
      g.bezierCurveTo(c1x, c1y, c2x, c2y, tipx, tipy);
      g.strokeStyle = `rgba(54,169,244,${0.16*t})`; g.lineWidth = 1.2; g.stroke();
      if (t > 0.25) {
        const fa = (t - 0.25) / 0.75;
        for (let i = 1; i <= 6; i++) {
          const ft = i / 7;
          const wx = shx+(tipx-shx)*ft, wy = shy+(tipy-shy)*ft+(ft*(1-ft)*(-20*s));
          const fl = (10-ft*6)*s;
          g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx+sd*fl*0.42, wy+fl*0.88);
          g.strokeStyle = `rgba(54,169,244,${0.07*fa})`; g.lineWidth = 0.5; g.stroke();
        }
      }
    }

    function eye(cx: number, cy: number, s: number, px: number, py: number, lid: number) {
      const R = 26*s, OR = 34*s;
      const og = g.createRadialGradient(cx, cy, 1, cx, cy, OR*2.2);
      og.addColorStop(0, `rgba(54,169,244,${Math.min(0.32, 0.7*s)})`);
      og.addColorStop(0.5, 'rgba(54,169,244,0.05)'); og.addColorStop(1, 'transparent');
      g.fillStyle = og; g.beginPath(); g.arc(cx, cy, OR*2.2, 0, Math.PI*2); g.fill();
      g.beginPath(); g.arc(cx, cy, OR, 0, Math.PI*2); g.fillStyle = '#0a1f35'; g.fill();
      g.beginPath(); g.arc(cx, cy, R*1.08, 0, Math.PI*2); g.fillStyle = '#051426'; g.fill();
      const ir = g.createRadialGradient(cx+px*0.16, cy+py*0.16, 0.5, cx, cy, R);
      ir.addColorStop(0,'#bef0ff'); ir.addColorStop(0.15,'#42c0fa');
      ir.addColorStop(0.48,'#1270c8'); ir.addColorStop(0.8,'#083878'); ir.addColorStop(1,'#031830');
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI*2); g.fillStyle = ir; g.fill();
      g.beginPath(); g.arc(cx, cy, R*0.6, 0, Math.PI*2);
      g.strokeStyle = 'rgba(54,169,244,0.2)'; g.lineWidth = 0.75; g.stroke();
      const pr = R*0.35 + S.dil*R*0.22;
      const ppx = cx + Math.max(-R*0.44, Math.min(R*0.44, px));
      const ppy = cy + Math.max(-R*0.44, Math.min(R*0.44, py));
      const pg = g.createRadialGradient(ppx-pr*0.28, ppy-pr*0.28, 0, ppx, ppy, pr);
      pg.addColorStop(0,'#10102a'); pg.addColorStop(1,'#000008');
      g.beginPath(); g.arc(ppx, ppy, pr, 0, Math.PI*2); g.fillStyle = pg; g.fill();
      g.beginPath(); g.arc(ppx-pr*0.42, ppy-pr*0.42, pr*0.32, 0, Math.PI*2);
      g.fillStyle = 'rgba(255,255,255,0.92)'; g.fill();
      g.beginPath(); g.arc(ppx+pr*0.28, ppy+pr*0.28, pr*0.14, 0, Math.PI*2);
      g.fillStyle = 'rgba(255,255,255,0.24)'; g.fill();
      g.beginPath(); g.arc(ppx+pr*0.1, ppy-pr*0.55, pr*0.17, 0, Math.PI*2);
      g.fillStyle = 'rgba(110,210,255,0.2)'; g.fill();
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI*2);
      g.strokeStyle = 'rgba(54,169,244,0.32)'; g.lineWidth = 1.4; g.stroke();
      if (lid > 0.01) {
        g.save(); g.beginPath(); g.arc(cx, cy, OR+1, 0, Math.PI*2); g.clip();
        const lh = (OR*2+2)*lid;
        g.fillStyle = '#0a1f35'; g.fillRect(cx-OR-2, cy+OR-lh, OR*2+4, lh+1);
        g.restore();
      }
    }

    function drawOwl(cx: number, cy: number, s: number, ws: number) {
      const bs = Math.sin(S.br) * 1.8; cy += bs;
      wing(cx, cy, s, ws, -1); wing(cx, cy, s, ws, 1);
      g.beginPath(); g.ellipse(cx, cy+38*s, 25*s, 36*s, 0, 0, Math.PI*2);
      const bg = g.createRadialGradient(cx, cy+26*s, 4, cx, cy+38*s, 33*s);
      bg.addColorStop(0,'#1e4a72'); bg.addColorStop(0.6,'#0f3555'); bg.addColorStop(1,'#082538');
      g.fillStyle = bg; g.fill();
      for (let i = 0; i < 3; i++) {
        g.beginPath(); g.ellipse(cx+(i-1)*3*s, cy+(50+i*10)*s, (13-i*2)*s, 3*s, 0, 0, Math.PI*2);
        g.strokeStyle = `rgba(54,169,244,${0.25-i*0.06})`; g.lineWidth = 0.6; g.stroke();
      }
      for (const sd of [-1, 1]) {
        const tw = Math.sin(S.br*0.65 + sd) * 0.024;
        g.save(); g.translate(cx+sd*24*s, cy-36*s); g.rotate(sd*0.22+tw);
        g.beginPath(); g.moveTo(0,0);
        g.bezierCurveTo(sd*-5*s,-12*s, sd*-9*s,-26*s, sd*-3*s,-40*s);
        g.bezierCurveTo(sd*-1*s,-32*s, sd*4*s,-18*s, sd*6*s,-9*s);
        g.bezierCurveTo(sd*4*s,-4*s, sd*1.5*s,-1*s, 0, 0);
        g.fillStyle = '#0d2a48'; g.fill();
        g.strokeStyle = 'rgba(54,169,244,0.25)'; g.lineWidth = 0.7; g.stroke();
        g.restore();
      }
      g.beginPath(); g.ellipse(cx, cy+2*s, 52*s, 48*s, 0, 0, Math.PI*2);
      const dO = g.createRadialGradient(cx, cy-2*s, 14*s, cx, cy+2*s, 58*s);
      dO.addColorStop(0,'#2a5a8a'); dO.addColorStop(0.45,'#1a4268'); dO.addColorStop(1,'#0d2e4d');
      g.fillStyle = dO; g.fill();
      g.strokeStyle = 'rgba(54,169,244,0.1)'; g.lineWidth = 1.5; g.stroke();
      g.beginPath(); g.ellipse(cx, cy+4*s, 40*s, 37*s, 0, 0, Math.PI*2);
      const dI = g.createRadialGradient(cx, cy, 0, cx, cy+4*s, 42*s);
      dI.addColorStop(0,'#36a9f4'); dI.addColorStop(0.5,'#2285c8'); dI.addColorStop(1,'#155a8f');
      g.fillStyle = dI; g.fill();
      for (let i = 1; i <= 2; i++) {
        g.beginPath(); g.ellipse(cx, cy+4*s, (18+i*11)*s, (16+i*9)*s, 0, 0, Math.PI*2);
        g.strokeStyle = `rgba(190,240,255,${0.15-i*0.04})`; g.lineWidth = 0.6; g.stroke();
      }
      eye(cx-30*s, cy-1*s, s, S.elx, S.ely, S.blid);
      eye(cx+30*s, cy-1*s, s, S.erx, S.ery, S.blid);
      const bkg = g.createLinearGradient(cx, cy+18*s, cx, cy+36*s);
      bkg.addColorStop(0,'#5a4222'); bkg.addColorStop(1,'#2a1808');
      g.beginPath();
      g.moveTo(cx-5*s, cy+20*s);
      g.bezierCurveTo(cx-3*s, cy+28*s, cx, cy+36*s, cx+2*s, cy+33*s);
      g.bezierCurveTo(cx+6*s, cy+28*s, cx+6*s, cy+22*s, cx+4*s, cy+20*s);
      g.bezierCurveTo(cx+1*s, cy+18*s, cx-3*s, cy+18*s, cx-5*s, cy+20*s);
      g.fillStyle = bkg; g.fill();
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = sc.getBoundingClientRect();
      S.mx = (e.clientX - r.left) * (W / r.width);
      S.my = (e.clientY - r.top)  * (H / r.height);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0], r = sc.getBoundingClientRect();
      S.mx = (t.clientX - r.left) * (W / r.width);
      S.my = (t.clientY - r.top)  * (H / r.height);
    };
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    let raf: number;
    function tick() {
      if (S.mode === 'opening') {
        S.an = Math.min(1, S.an + AS);
        if (S.an >= 1) { S.mode = 'open'; setOpen(true); }
      } else if (S.mode === 'closing') {
        S.an = Math.max(0, S.an - AS * 1.3);
        if (S.an <= 0) S.mode = 'idle';
      }
      const ep = eio(S.an);
      const tx = IT.x+(OT.x-IT.x)*ep, ty = IT.y+(OT.y-IT.y)*ep, ts = IT.s+(OT.s-IT.s)*ep;
      let r;
      r = spr(S.ox, tx, S.oxv, 0.09, 0.7); S.ox=r.p; S.oxv=r.v;
      r = spr(S.oy, ty, S.oyv, 0.09, 0.7); S.oy=r.p; S.oyv=r.v;
      r = spr(S.sc, ts, S.scv, 0.07, 0.72); S.sc=r.p; S.scv=r.v;
      r = spr(S.ws, ep, S.wsv, 0.055, 0.74); S.ws=r.p; S.wsv=r.v;
      const bcy = S.oy + Math.sin(S.br)*1.8;
      const ex = 30*S.sc, ly = bcy-S.sc;
      const lx = S.ox-ex, rx = S.ox+ex;
      const dl = Math.hypot(S.mx-lx, S.my-ly)||1, dr = Math.hypot(S.mx-rx, S.my-ly)||1;
      const kd = 65, mp = 9*S.sc;
      const tl = { x:(S.mx-lx)/dl*Math.min(dl/kd,mp), y:(S.my-ly)/dl*Math.min(dl/kd,mp) };
      const tr = { x:(S.mx-rx)/dr*Math.min(dr/kd,mp), y:(S.my-ly)/dr*Math.min(dr/kd,mp) };
      const ek=0.13, ed=0.66;
      r=spr(S.elx,tl.x,S.elvx,ek,ed); S.elx=r.p; S.elvx=r.v;
      r=spr(S.ely,tl.y,S.elvy,ek,ed); S.ely=r.p; S.elvy=r.v;
      r=spr(S.erx,tr.x,S.ervx,ek,ed); S.erx=r.p; S.ervx=r.v;
      r=spr(S.ery,tr.y,S.ervy,ek,ed); S.ery=r.p; S.ervy=r.v;
      const dist = Math.hypot((S.mx-S.ox)/W, (S.my-S.oy)/H)*2.2;
      const dt = Math.max(0.18, Math.min(0.88, 1.05-dist*1.5));
      r=spr(S.dil,dt,S.dilv,0.032,0.78); S.dil=r.p; S.dilv=r.v;
      S.br += 0.016;
      S.bt -= 1/60;
      if (S.bt <= 0 && !S.ba) { S.ba=true; S.bp=0; S.bt=2.5+Math.random()*5; }
      if (S.ba) {
        S.bp += 0.13; S.blid = Math.max(0, Math.sin(S.bp));
        if (S.bp >= Math.PI) { S.ba=false; S.blid=0; }
      }
      const hov = S.mode==='idle' && Math.hypot(S.mx-S.ox, S.my-S.oy)<60;
      sc.style.cursor = hov ? 'pointer' : 'default';
    }

    function frame() {
      g.clearRect(0, 0, W, H);
      if (S.ws > 0.04) {
        const wg = g.createRadialGradient(OT.x, OT.y+15, 8, OT.x, OT.y+30, 195);
        wg.addColorStop(0, `rgba(54,169,244,${0.08*S.ws})`); wg.addColorStop(1,'transparent');
        g.fillStyle=wg; g.beginPath(); g.arc(OT.x,OT.y+30,195,0,Math.PI*2); g.fill();
      }
      if (S.an < 0.07) {
        const pu = Math.sin(S.br*2)*0.5+0.5;
        g.beginPath(); g.arc(S.ox, S.oy-13*S.sc, 36*S.sc+pu*5, 0, Math.PI*2);
        g.strokeStyle=`rgba(54,169,244,${0.12+pu*0.07})`; g.lineWidth=1; g.stroke();
      }
      drawOwl(S.ox, S.oy, S.sc, S.ws);
    }

    function loop() { tick(); frame(); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Handle click on canvas
  const handleClick = (e: React.MouseEvent) => {
    const S = stateRef.current;
    const r = (scRef.current!).getBoundingClientRect();
    const mx = (e.clientX - r.left) * (420 / r.width);
    const my = (e.clientY - r.top)  * (580 / r.height);
    // Check if clicking on owl
    if (Math.hypot(mx-S.ox, my-S.oy) < 60) {
      if (S.mode === 'idle') {
        S.mode = 'opening';
      } else if (S.mode === 'open' || openRef.current) {
        S.mode = 'closing';
        setOpen(false);
      }
    }
  };

  const handleClose = () => {
    stateRef.current.mode = 'closing';
    setOpen(false);
  };

  const handleSend = () => {
    const v = input.trim(); if (!v) return;
    setMessages(m => [...m, { text: v, from: 'user' }]);
    setInput(''); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { text: REPLIES[replyIdx.current % REPLIES.length], from: 'bot' }]);
      replyIdx.current++;
    }, 900);
  };

  // Auto-scroll
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, typing]);

  return (
    <div
      ref={scRef}
      onClick={handleClick}
      style={{
        position: 'fixed', bottom: 0, right: 0,
        width: 420, height: 580,
        pointerEvents: 'all', zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={cvRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
      />

      {/* Chat panel */}
      <div
        style={{
          position: 'absolute', top: 242, left: 56, width: 308, height: 316,
          background: 'rgba(3,9,20,0.98)',
          border: '1px solid rgba(54,169,244,0.2)',
          borderRadius: 14,
          display: 'flex', flexDirection: 'column',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transform: open ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
          boxShadow: '0 -12px 80px rgba(54,169,244,0.07), inset 0 1px 0 rgba(54,169,244,0.13)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'8px 10px 0', flexShrink:0 }}>
          <button
            onClick={handleClose}
            style={{
              background:'none', border:'none', color:'rgba(54,169,244,0.4)',
              fontSize:15, cursor:'pointer', padding:'4px 6px', lineHeight:1,
            }}
          >✕</button>
        </div>

        <div
          ref={msgsRef}
          style={{ flex:1, overflowY:'auto', padding:'4px 14px 8px', display:'flex', flexDirection:'column', gap:8, minHeight:0 }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.from==='bot' ? 'flex-start' : 'flex-end',
              background: m.from==='bot' ? 'rgba(10,32,72,0.6)' : 'rgba(54,169,244,0.18)',
              border: m.from==='bot' ? '1px solid rgba(54,169,244,0.18)' : '1px solid rgba(54,169,244,0.3)',
              borderRadius: m.from==='bot' ? '10px 10px 10px 3px' : '10px 10px 3px 10px',
              padding: '8px 12px',
              color: m.from==='bot' ? '#70bce8' : '#c5e6ff',
              fontSize: 12.5, lineHeight: 1.55, maxWidth: '85%',
            }}>{m.text}</div>
          ))}
          {typing && (
            <div style={{
              alignSelf:'flex-start', background:'rgba(10,32,72,0.6)',
              border:'1px solid rgba(54,169,244,0.18)', borderRadius:'10px 10px 10px 3px',
              padding:'10px 14px', display:'flex', gap:4,
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width:5, height:5, borderRadius:'50%',
                  background:'rgba(54,169,244,0.65)',
                  display:'inline-block',
                  animation:`owlDot .9s ease-in-out ${i*0.18}s infinite`,
                }}/>
              ))}
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap:7, padding:10, borderTop:'1px solid rgba(54,169,244,0.1)', flexShrink:0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && handleSend()}
            placeholder="Ask something…"
            style={{
              flex:1, background:'rgba(54,169,244,0.05)',
              border:'1px solid rgba(54,169,244,0.18)', borderRadius:8,
              padding:'7px 11px', color:'#b5d8f8', fontSize:12.5,
              outline:'none', fontFamily:'inherit',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background:'rgba(54,169,244,0.14)', border:'1px solid rgba(54,169,244,0.28)',
              borderRadius:8, color:'#42b4f0', padding:'7px 13px',
              fontSize:12, cursor:'pointer', fontFamily:'inherit',
            }}
          >Send</button>
        </div>
      </div>

      {/* Idle hint */}
      {!open && (
        <div style={{
          position:'absolute', bottom:78, right:100,
          fontSize:11, color:'rgba(54,169,244,0.4)',
          letterSpacing:'.1em', pointerEvents:'none',
          transition:'opacity .5s', whiteSpace:'nowrap',
        }}></div>
      )}

      <style>{`@keyframes owlDot{0%,100%{opacity:.3}50%{opacity:.9}}`}</style>
    </div>
  );
}