import { useEffect, useRef, useState } from 'react';

interface Message { text: string; from: 'bot' | 'user'; }

const REPLIES = [
  'the lazy failure havent wrote the api yet',
];

export default function OwlChat() {
  const cvRef   = useRef<HTMLCanvasElement>(null);
  const scRef   = useRef<HTMLDivElement>(null);
  const msgsRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey, I'm Nafis's owl. Ask me anything about his work.", from: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const replyIdx = useRef(0);

  const stateRef = useRef({
    mode: 'idle' as 'idle' | 'opening' | 'open' | 'closing',
    an: 0,
    ox: 0, oy: 0, oxv: 0, oyv: 0,
    sc: 0.58, scv: 0,
    ws: 0, wsv: 0,
    flap: 0,
    elx: 0, ely: 0, elvx: 0, elvy: 0,
    erx: 0, ery: 0, ervx: 0, ervy: 0,
    dil: 0.3, dilv: 0,
    blid: 0, ba: false, bp: 0, bt: 3.5, br: 0,
    mx: 0, my: 0,
  });

  useEffect(() => {
    const cv = cvRef.current; const sc = scRef.current;
    if (!cv || !sc) return;
    const g = cv.getContext('2d')!;
    const W = 420, H = 580;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    g.scale(dpr, dpr);

    const S = stateRef.current;
    S.ox = W - 64; S.oy = H - 82;
    S.mx = W / 2; S.my = H + 100;

    const IT = { x: W - 64, y: H - 82, s: 0.58 };
    const OT = { x: W / 2, y: 200, s: 1.0 };
    const AS = 0.019;

    function spr(p: number, t: number, v: number, k = 0.07, d = 0.72) {
      const f = (t - p) * k - v * d;
      return { p: p + v + f, v: v + f };
    }
    function eio(t: number) {
      return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
    }

    function foldedWing(cx: number, cy: number, s: number, sd: number, br: number) {
      const phase = Math.sin(br * 0.7 + sd * 0.3) * 0.015;
      g.save();
      g.translate(cx + sd*32*s, cy + 6*s);
      g.rotate(sd*0.08 + phase);
      const grd = g.createLinearGradient(0, -20*s, 0, 45*s);
      grd.addColorStop(0, '#1e4a72'); grd.addColorStop(0.5, '#0f3555'); grd.addColorStop(1, '#062035');
      g.beginPath();
      g.moveTo(sd*-4*s, -18*s);
      g.bezierCurveTo(sd*18*s, -14*s, sd*28*s, 0, sd*26*s, 30*s);
      g.bezierCurveTo(sd*22*s, 46*s, sd*12*s, 52*s, sd*2*s, 48*s);
      g.bezierCurveTo(sd*-4*s, 40*s, sd*-6*s, 10*s, sd*-4*s, -18*s);
      g.closePath(); g.fillStyle = grd; g.fill();
      g.strokeStyle = 'rgba(54,169,244,0.15)'; g.lineWidth = 0.6; g.stroke();
      for (let i = 0; i < 3; i++) {
        const y = 5*s + i*10*s;
        g.beginPath();
        g.moveTo(sd*-2*s, y);
        g.bezierCurveTo(sd*10*s, y+2*s, sd*18*s, y+6*s, sd*22*s, y+10*s);
        g.strokeStyle = `rgba(54,169,244,${0.18 - i*0.03})`;
        g.lineWidth = 0.5; g.stroke();
      }
      g.restore();
    }

    function spreadWing(cx: number, cy: number, s: number, t: number, sd: number, flap: number) {
      if (t < 0.01) return;
      const flapRot = Math.sin(flap) * 0.12;
      g.save();
      const shx = cx + sd*18*s, shy = cy - 2*s;
      g.translate(shx, shy); g.rotate(sd * flapRot);
      const spread = t;
      const L = 130 * s * spread;
      const droop = Math.cos(flap) * 6 * s;
      const tipx = sd * L, tipy = 12*s + droop;

      const coverts: {x:number;y:number;len:number;ang:number}[] = [];
      for (let i = 0; i < 4; i++) {
        const ft = i / 4;
        coverts.push({
          x: sd*(15+ft*50)*s*spread, y: -4*s+ft*8*s,
          len: (18-ft*4)*s, ang: sd*(0.3+ft*0.15),
        });
      }
      const secondaries: {x:number;y:number;len:number;ang:number}[] = [];
      for (let i = 0; i < 6; i++) {
        const ft = i / 6;
        secondaries.push({
          x: sd*(20+ft*55)*s*spread, y: 2*s+ft*6*s,
          len: (28-ft*3)*s,
          ang: sd*(0.5+ft*0.08) + Math.sin(flap+i*0.2)*0.04,
        });
      }
      const primaries: {x:number;y:number;len:number;ang:number}[] = [];
      for (let i = 0; i < 5; i++) {
        const ft = i / 5;
        primaries.push({
          x: sd*(60+ft*60)*s*spread, y: 4*s+ft*5*s,
          len: (38-ft*4)*s,
          ang: sd*(0.7+ft*0.1) + Math.sin(flap+i*0.3)*0.06,
        });
      }

      const baseGrad = g.createLinearGradient(0, -10*s, tipx*0.8, tipy);
      baseGrad.addColorStop(0, '#1e4a72'); baseGrad.addColorStop(0.6, '#0f3555'); baseGrad.addColorStop(1, '#071f34');
      g.beginPath();
      g.moveTo(0, -8*s);
      g.bezierCurveTo(sd*30*s*spread, -18*s*spread, sd*80*s*spread, -4*s, tipx, tipy);
      g.bezierCurveTo(sd*90*s*spread, 22*s, sd*40*s*spread, 28*s, 0, 20*s);
      g.closePath(); g.fillStyle = baseGrad; g.fill();

      const feather = (x: number, y: number, len: number, ang: number, alpha: number, width: number) => {
        g.save(); g.translate(x, y); g.rotate(ang);
        const fg = g.createLinearGradient(0, 0, 0, len);
        fg.addColorStop(0, `rgba(42,90,138,${alpha})`);
        fg.addColorStop(1, `rgba(8,35,60,${alpha*0.95})`);
        g.beginPath();
        g.moveTo(-width/2, 0);
        g.quadraticCurveTo(-width*0.3, len*0.5, -width*0.2, len);
        g.quadraticCurveTo(0, len*1.05, width*0.2, len);
        g.quadraticCurveTo(width*0.3, len*0.5, width/2, 0);
        g.closePath(); g.fillStyle = fg; g.fill();
        g.strokeStyle = `rgba(54,169,244,${alpha*0.25})`; g.lineWidth = 0.4; g.stroke();
        g.beginPath(); g.moveTo(0, 0); g.lineTo(0, len*0.95);
        g.strokeStyle = `rgba(10,25,45,${alpha*0.6})`; g.lineWidth = 0.4; g.stroke();
        g.restore();
      };
      for (const f of coverts) feather(f.x, f.y, f.len, f.ang, 0.95, 5*s);
      for (const f of secondaries) feather(f.x, f.y, f.len, f.ang, 0.92, 5.5*s);
      for (const f of primaries) feather(f.x, f.y, f.len, f.ang, 0.88, 6*s);
      g.restore();
    }

    function eye(cx: number, cy: number, s: number, px: number, py: number, lid: number, dil: number) {
      const R = 30*s, OR = 38*s;
      const og = g.createRadialGradient(cx, cy, 1, cx, cy, OR*2);
      og.addColorStop(0, `rgba(54,169,244,${Math.min(0.32, 0.65*s)})`);
      og.addColorStop(0.5, 'rgba(54,169,244,0.05)'); og.addColorStop(1, 'transparent');
      g.fillStyle = og; g.beginPath(); g.arc(cx, cy, OR*2, 0, Math.PI*2); g.fill();
      g.beginPath(); g.arc(cx, cy, OR, 0, Math.PI*2); g.fillStyle = '#0a1f35'; g.fill();
      g.beginPath(); g.arc(cx, cy, R*1.05, 0, Math.PI*2); g.fillStyle = '#030e1c'; g.fill();
      const ir = g.createRadialGradient(cx+px*0.18, cy+py*0.18, 0.5, cx, cy, R);
      ir.addColorStop(0, '#d2f4ff'); ir.addColorStop(0.15, '#5dc9fb');
      ir.addColorStop(0.5, '#1478cc'); ir.addColorStop(0.82, '#0a3c7a'); ir.addColorStop(1, '#051a2e');
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI*2); g.fillStyle = ir; g.fill();
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        g.beginPath();
        g.moveTo(cx + Math.cos(a)*R*0.45, cy + Math.sin(a)*R*0.45);
        g.lineTo(cx + Math.cos(a)*R*0.9,  cy + Math.sin(a)*R*0.9);
        g.strokeStyle = 'rgba(20,40,70,0.22)'; g.lineWidth = 0.4; g.stroke();
      }
      const pr = R*0.32 + dil*R*0.24;
      const ppx = cx + Math.max(-R*0.42, Math.min(R*0.42, px));
      const ppy = cy + Math.max(-R*0.42, Math.min(R*0.42, py));
      const pg = g.createRadialGradient(ppx-pr*0.3, ppy-pr*0.3, 0, ppx, ppy, pr);
      pg.addColorStop(0, '#0a1220'); pg.addColorStop(1, '#000005');
      g.beginPath(); g.arc(ppx, ppy, pr, 0, Math.PI*2); g.fillStyle = pg; g.fill();
      g.beginPath(); g.arc(ppx-pr*0.4, ppy-pr*0.4, pr*0.34, 0, Math.PI*2);
      g.fillStyle = 'rgba(255,255,255,0.95)'; g.fill();
      g.beginPath(); g.arc(ppx+pr*0.28, ppy+pr*0.28, pr*0.14, 0, Math.PI*2);
      g.fillStyle = 'rgba(255,255,255,0.28)'; g.fill();
      g.beginPath(); g.arc(ppx+pr*0.1, ppy-pr*0.55, pr*0.18, 0, Math.PI*2);
      g.fillStyle = 'rgba(130,215,255,0.28)'; g.fill();
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI*2);
      g.strokeStyle = 'rgba(54,169,244,0.38)'; g.lineWidth = 1.2; g.stroke();
      g.beginPath(); g.arc(cx, cy, R*1.06, 0, Math.PI*2);
      g.strokeStyle = 'rgba(42,80,130,0.5)'; g.lineWidth = 1.8; g.stroke();
      if (lid > 0.01) {
        g.save(); g.beginPath(); g.arc(cx, cy, OR+1, 0, Math.PI*2); g.clip();
        const lh = (OR*2+2) * lid;
        g.fillStyle = '#0a1f35'; g.fillRect(cx-OR-2, cy+OR-lh, OR*2+4, lh+1);
        g.restore();
      }
    }

    function body(cx: number, cy: number, s: number) {
      g.save();
      const bodW = 56*s, bodH = 72*s;
      const bodCy = cy + 62*s;
      const bg = g.createRadialGradient(cx-8*s, bodCy-20*s, 2, cx, bodCy+10*s, bodH*1.2);
      bg.addColorStop(0, '#2a5f92'); bg.addColorStop(0.4, '#17406a');
      bg.addColorStop(0.85, '#0a2440'); bg.addColorStop(1, '#04101e');
      g.beginPath();
      g.moveTo(cx-bodW*0.85, bodCy-bodH*0.45);
      g.bezierCurveTo(cx-bodW, bodCy-bodH*0.1, cx-bodW*0.95, bodCy+bodH*0.5, cx-bodW*0.4, bodCy+bodH*0.62);
      g.bezierCurveTo(cx, bodCy+bodH*0.68, cx+bodW*0.4, bodCy+bodH*0.62, cx+bodW*0.95, bodCy+bodH*0.5);
      g.bezierCurveTo(cx+bodW, bodCy-bodH*0.1, cx+bodW*0.85, bodCy-bodH*0.45, cx, bodCy-bodH*0.55);
      g.closePath(); g.fillStyle = bg; g.fill();
      g.strokeStyle = 'rgba(54,169,244,0.09)'; g.lineWidth = 2; g.stroke();
      for (let row = 0; row < 5; row++) {
        for (let col = -2; col <= 2; col++) {
          if (row % 2 === 1 && Math.abs(col) === 2) continue;
          const fx = cx + col*10*s + (row%2)*5*s;
          const fy = bodCy - bodH*0.25 + row*13*s;
          if (Math.abs(col*12*s) > bodW*0.75 - row*3*s) continue;
          g.beginPath();
          g.moveTo(fx-4*s, fy);
          g.quadraticCurveTo(fx, fy+7*s, fx+4*s, fy);
          g.quadraticCurveTo(fx, fy-2*s, fx-4*s, fy);
          g.fillStyle = 'rgba(10,30,55,0.35)'; g.fill();
          g.strokeStyle = 'rgba(54,169,244,0.1)'; g.lineWidth = 0.4; g.stroke();
        }
      }
      const chestG = g.createRadialGradient(cx, bodCy+5*s, 2, cx, bodCy+10*s, bodW*0.7);
      chestG.addColorStop(0, 'rgba(90,170,230,0.18)'); chestG.addColorStop(1, 'transparent');
      g.fillStyle = chestG;
      g.beginPath(); g.ellipse(cx, bodCy+8*s, bodW*0.5, bodH*0.45, 0, 0, Math.PI*2); g.fill();
      g.restore();
    }

    function feet(cx: number, cy: number, s: number) {
      const fy = cy + 130*s;
      for (const sd of [-1, 1]) {
        const fx = cx + sd*10*s;
        g.strokeStyle = '#3d2814'; g.lineWidth = 2.5*s; g.lineCap = 'round';
        g.beginPath(); g.moveTo(fx, fy-6*s); g.lineTo(fx, fy); g.stroke();
        g.strokeStyle = '#5a3d20'; g.lineWidth = 2*s;
        for (let t = -1; t <= 1; t++) {
          g.beginPath(); g.moveTo(fx, fy);
          g.lineTo(fx + t*3.5*s, fy + 5*s); g.stroke();
        }
      }
    }

    function head(cx: number, cy: number, s: number, br: number) {
      g.save();
      const tuftWob = Math.sin(br*0.8) * 0.03;
      for (const sd of [-1, 1]) {
        g.save(); g.translate(cx + sd*42*s, cy - 44*s); g.rotate(sd*(0.32 + tuftWob));
        g.beginPath();
        g.moveTo(0, 0);
        g.bezierCurveTo(sd*-4*s, -14*s, sd*-8*s, -28*s, sd*-2*s, -38*s);
        g.bezierCurveTo(sd*2*s, -32*s, sd*7*s, -18*s, sd*9*s, -8*s);
        g.bezierCurveTo(sd*6*s, -4*s, sd*2*s, -1*s, 0, 0);
        g.closePath();
        const tg = g.createLinearGradient(0, -30*s, 0, 0);
        tg.addColorStop(0, '#08182a'); tg.addColorStop(1, '#143a5e');
        g.fillStyle = tg; g.fill();
        g.strokeStyle = 'rgba(54,169,244,0.3)'; g.lineWidth = 0.6; g.stroke();
        g.restore();
      }
      g.beginPath(); g.ellipse(cx, cy, 64*s, 58*s, 0, 0, Math.PI*2);
      const hg = g.createRadialGradient(cx-6*s, cy-12*s, 4, cx, cy+4*s, 70*s);
      hg.addColorStop(0, '#2f6ba0'); hg.addColorStop(0.5, '#174a78'); hg.addColorStop(1, '#082540');
      g.fillStyle = hg; g.fill();
      g.strokeStyle = 'rgba(54,169,244,0.12)'; g.lineWidth = 1.5; g.stroke();
      for (let ring = 1; ring <= 4; ring++) {
        g.beginPath();
        g.ellipse(cx, cy+2*s, (15+ring*11)*s, (13+ring*9)*s, 0, -Math.PI*0.95, -Math.PI*0.05);
        g.strokeStyle = `rgba(54,169,244,${0.18 - ring*0.035})`; g.lineWidth = 0.6; g.stroke();
      }
      g.restore();
    }

    function drawOwl(cx: number, cy: number, s: number, ws: number, flap: number, br: number) {
      const bs = Math.sin(br) * 1.5; cy += bs;
      if (ws > 0.02) {
        spreadWing(cx, cy+8*s, s, ws, -1, flap);
        spreadWing(cx, cy+8*s, s, ws, 1, flap);
      }
      body(cx, cy, s);
      feet(cx, cy, s);
      if (ws < 0.6) {
        const foldA = 1 - Math.min(1, ws/0.6);
        g.globalAlpha = foldA;
        foldedWing(cx, cy+30*s, s, -1, br);
        foldedWing(cx, cy+30*s, s, 1, br);
        g.globalAlpha = 1;
      }
      head(cx, cy, s, br);
      eye(cx-30*s, cy-1*s, s, S.elx, S.ely, S.blid, S.dil);
      eye(cx+30*s, cy-1*s, s, S.erx, S.ery, S.blid, S.dil);
      const bkg = g.createLinearGradient(cx, cy+20*s, cx, cy+42*s);
      bkg.addColorStop(0, '#e8a040'); bkg.addColorStop(0.5, '#a8691c'); bkg.addColorStop(1, '#5a3408');
      g.beginPath();
      g.moveTo(cx-7*s, cy+22*s);
      g.bezierCurveTo(cx-5*s, cy+32*s, cx-1*s, cy+42*s, cx+2*s, cy+39*s);
      g.bezierCurveTo(cx+7*s, cy+34*s, cx+8*s, cy+26*s, cx+5*s, cy+22*s);
      g.bezierCurveTo(cx+2*s, cy+19*s, cx-4*s, cy+19*s, cx-7*s, cy+22*s);
      g.closePath(); g.fillStyle = bkg; g.fill();
      g.strokeStyle = 'rgba(40,20,5,0.6)'; g.lineWidth = 0.6; g.stroke();
      g.beginPath(); g.moveTo(cx-2*s, cy+26*s);
      g.bezierCurveTo(cx, cy+30*s, cx+2*s, cy+32*s, cx+2*s, cy+31*s);
      g.strokeStyle = 'rgba(80,40,10,0.7)'; g.lineWidth = 0.8; g.stroke();
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

    let raf = 0;
    function tick() {
      if (S.mode === 'opening') {
        S.an = Math.min(1, S.an + AS);
        if (S.an >= 1) { S.mode = 'open'; setOpen(true); }
      } else if (S.mode === 'closing') {
        S.an = Math.max(0, S.an - AS*1.3);
        if (S.an <= 0) S.mode = 'idle';
      }
      const ep = eio(S.an);
      const tx = IT.x+(OT.x-IT.x)*ep, ty = IT.y+(OT.y-IT.y)*ep, ts = IT.s+(OT.s-IT.s)*ep;
      const rox = spr(S.ox, tx, S.oxv, 0.09, 0.7); S.ox=rox.p; S.oxv=rox.v;
      const roy = spr(S.oy, ty, S.oyv, 0.09, 0.7); S.oy=roy.p; S.oyv=roy.v;
      const rsc = spr(S.sc, ts, S.scv, 0.07, 0.72); S.sc=rsc.p; S.scv=rsc.v;
      const rws = spr(S.ws, ep, S.wsv, 0.055, 0.74); S.ws=rws.p; S.wsv=rws.v;

      if (S.ws > 0.1 && S.ws < 0.95) S.flap += 0.18;
      else S.flap *= 0.94;

      const bcy = S.oy + Math.sin(S.br)*1.5;
      const ex = 30*S.sc, ly = bcy - S.sc;
      const lx = S.ox - ex, rx = S.ox + ex;
      const dl = Math.hypot(S.mx-lx, S.my-ly)||1, dr = Math.hypot(S.mx-rx, S.my-ly)||1;
      const kd = 55, mp = 11*S.sc;
      const tl = { x:(S.mx-lx)/dl*Math.min(dl/kd,mp), y:(S.my-ly)/dl*Math.min(dl/kd,mp) };
      const tr = { x:(S.mx-rx)/dr*Math.min(dr/kd,mp), y:(S.my-ly)/dr*Math.min(dr/kd,mp) };
      const ek = 0.14, ed = 0.64;
      const relx = spr(S.elx, tl.x, S.elvx, ek, ed); S.elx=relx.p; S.elvx=relx.v;
      const rely = spr(S.ely, tl.y, S.elvy, ek, ed); S.ely=rely.p; S.elvy=rely.v;
      const rerx = spr(S.erx, tr.x, S.ervx, ek, ed); S.erx=rerx.p; S.ervx=rerx.v;
      const rery = spr(S.ery, tr.y, S.ervy, ek, ed); S.ery=rery.p; S.ervy=rery.v;

      const dist = Math.hypot((S.mx-S.ox)/W, (S.my-S.oy)/H) * 2.2;
      const dt = Math.max(0.2, Math.min(0.9, 1.05 - dist*1.4));
      const rdil = spr(S.dil, dt, S.dilv, 0.032, 0.78); S.dil=rdil.p; S.dilv=rdil.v;

      S.br += 0.016;
      S.bt -= 1/60;
      if (S.bt <= 0 && !S.ba) { S.ba = true; S.bp = 0; S.bt = 2.5 + Math.random()*5; }
      if (S.ba) {
        S.bp += 0.15; S.blid = Math.max(0, Math.sin(S.bp));
        if (S.bp >= Math.PI) { S.ba = false; S.blid = 0; }
      }
      const hov = S.mode==='idle' && Math.hypot(S.mx-S.ox, S.my-S.oy) < 75;
      sc.style.cursor = hov ? 'pointer' : 'default';
    }

    function frame() {
      g.clearRect(0, 0, W, H);
      if (S.ws > 0.04) {
        const wg = g.createRadialGradient(OT.x, OT.y+30, 8, OT.x, OT.y+40, 210);
        wg.addColorStop(0, `rgba(54,169,244,${0.1*S.ws})`); wg.addColorStop(1, 'transparent');
        g.fillStyle = wg; g.beginPath(); g.arc(OT.x, OT.y+40, 210, 0, Math.PI*2); g.fill();
      }
      if (S.an < 0.07) {
        const pu = Math.sin(S.br*2)*0.5 + 0.5;
        g.beginPath(); g.arc(S.ox, S.oy-15*S.sc, 42*S.sc+pu*5, 0, Math.PI*2);
        g.strokeStyle = `rgba(54,169,244,${0.14+pu*0.07})`; g.lineWidth = 1; g.stroke();
      }
      drawOwl(S.ox, S.oy, S.sc, S.ws, S.flap, S.br);
    }

    function loop() { tick(); frame(); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const S = stateRef.current;
    const r = scRef.current!.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (420 / r.width);
    const my = (e.clientY - r.top)  * (580 / r.height);
    if (Math.hypot(mx-S.ox, my-S.oy) < 75) {
      if (S.mode === 'idle') S.mode = 'opening';
      else if (S.mode === 'open') { S.mode = 'closing'; setOpen(false); }
    }
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
        pointerEvents: 'all', zIndex: 9999, overflow: 'hidden',
      }}
    >
      <canvas ref={cvRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }} />

      <div
        style={{
          position: 'absolute', top: 260, left: 56, width: 308, height: 300,
          background: 'rgba(3,9,20,0.98)',
          border: '1px solid rgba(54,169,244,0.22)',
          borderRadius: 14, display: 'flex', flexDirection: 'column',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transform: open ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.4s ease 0.12s, transform 0.4s ease 0.12s',
          boxShadow: '0 -12px 80px rgba(54,169,244,0.09)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 10px 0', flexShrink: 0 }}>
          <button
            onClick={() => { stateRef.current.mode = 'closing'; setOpen(false); }}
            style={{ background: 'none', border: 'none', color: 'rgba(54,169,244,0.4)', fontSize: 15, cursor: 'pointer', padding: '4px 6px', lineHeight: 1 }}
          >✕</button>
        </div>

        <div
          ref={msgsRef}
          style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.from === 'bot' ? 'flex-start' : 'flex-end',
              background: m.from === 'bot' ? 'rgba(10,32,72,0.6)' : 'rgba(54,169,244,0.18)',
              border: m.from === 'bot' ? '1px solid rgba(54,169,244,0.18)' : '1px solid rgba(54,169,244,0.3)',
              borderRadius: m.from === 'bot' ? '10px 10px 10px 3px' : '10px 10px 3px 10px',
              padding: '8px 12px',
              color: m.from === 'bot' ? '#70bce8' : '#c5e6ff',
              fontSize: 12.5, lineHeight: 1.55, maxWidth: '85%',
            }}>{m.text}</div>
          ))}
          {typing && (
            <div style={{
              alignSelf: 'flex-start', background: 'rgba(10,32,72,0.6)',
              border: '1px solid rgba(54,169,244,0.18)', borderRadius: '10px 10px 10px 3px',
              padding: '10px 14px', display: 'flex', gap: 4,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'rgba(54,169,244,0.65)', display: 'inline-block',
                  animation: `owlDot .9s ease-in-out ${i * 0.18}s infinite`,
                }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 7, padding: 10, borderTop: '1px solid rgba(54,169,244,0.1)', flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask something…"
            style={{
              flex: 1, background: 'rgba(54,169,244,0.05)',
              border: '1px solid rgba(54,169,244,0.18)', borderRadius: 8,
              padding: '7px 11px', color: '#b5d8f8', fontSize: 12.5,
              outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: 'rgba(54,169,244,0.14)', border: '1px solid rgba(54,169,244,0.28)',
              borderRadius: 8, color: '#42b4f0', padding: '7px 13px',
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Send</button>
        </div>
      </div>

      <style>{`@keyframes owlDot{0%,100%{opacity:.3}50%{opacity:.9}}`}</style>
    </div>
  );
}