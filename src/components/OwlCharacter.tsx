import { useEffect, useRef } from 'react';

export default function OwlCharacter({ size = 300 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const g = ctx;

    const W = size, H = Math.round(size * 1.2);
    const dpr = window.devicePixelRatio || 1;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    cv.style.width  = W + 'px';
    cv.style.height = H + 'px';
    g.scale(dpr, dpr);

    const OX = W / 2, OY = H * 0.455;

    // Spring: position, target, velocity → {p, v}
    const spr = (p: number, t: number, v: number, k = 0.08, d = 0.72) => {
      const f = (t - p) * k - v * d;
      return { p: p + v + f, v: v + f };
    };

    const S = {
      mx: OX, my: OY - 120,
      hr: 0, hrv: 0,      // head rotation
      ht: 0, htv: 0,      // head turn
      elx: 0, ely: 0, elvx: 0, elvy: 0,  // left eye pupil
      erx: 0, ery: 0, ervx: 0, ervy: 0,  // right eye pupil
      dil: 0.3, dilv: 0,  // pupil dilation
      blid: 0, bact: false, bph: 0, bti: 3.2,  // blink
      br: 0, id: 0,       // breath, idle sway
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      S.mx = (e.clientX - r.left) * (W / r.width);
      S.my = (e.clientY - r.top)  * (H / r.height);
    };
    document.addEventListener('mousemove', onMouseMove, { passive: true });

    function drawEye(x: number, y: number, pu: {x:number;y:number}, lid: number) {
      // Outer ambient glow
      const og = g.createRadialGradient(x, y, 2, x, y, Math.round(W * 0.15));
      og.addColorStop(0,   'rgba(54,169,244,0.18)');
      og.addColorStop(0.55,'rgba(54,169,244,0.05)');
      og.addColorStop(1,   'transparent');
      g.fillStyle = og; g.beginPath(); g.arc(x, y, W*0.15, 0, Math.PI*2); g.fill();

      const R = W * 0.087;  // feather ring radius

      // Feather surround
      g.beginPath(); g.arc(x, y, R, 0, Math.PI*2);
      g.fillStyle = '#1b1209'; g.fill();

      // Sclera
      g.beginPath(); g.arc(x, y, R*0.8, 0, Math.PI*2);
      g.fillStyle = '#020810'; g.fill();

      // Iris gradient
      const iR = R * 0.645;
      const ir = g.createRadialGradient(x + pu.x*0.2, y + pu.y*0.2, 0.5, x, y, iR);
      ir.addColorStop(0,    '#92e4ff');
      ir.addColorStop(0.2,  '#3db8f8');
      ir.addColorStop(0.5,  '#1168ba');
      ir.addColorStop(0.82, '#082f62');
      ir.addColorStop(1,    '#031320');
      g.beginPath(); g.arc(x, y, iR, 0, Math.PI*2);
      g.fillStyle = ir; g.fill();

      // Iris detail ring
      g.beginPath(); g.arc(x, y, iR * 0.7, 0, Math.PI*2);
      g.strokeStyle = 'rgba(54,169,244,0.22)'; g.lineWidth = 0.8; g.stroke();

      // Pupil
      const pr = (W * 0.019) + S.dil * (W * 0.014);
      const px = x + pu.x, py = y + pu.y;
      const pg = g.createRadialGradient(px-1.5, py-1.5, 0, px, py, pr);
      pg.addColorStop(0, '#14142c'); pg.addColorStop(1, '#000008');
      g.beginPath(); g.arc(px, py, pr, 0, Math.PI*2);
      g.fillStyle = pg; g.fill();

      // Main highlight
      g.beginPath(); g.arc(px - pr*0.38, py - pr*0.38, pr*0.3, 0, Math.PI*2);
      g.fillStyle = 'rgba(255,255,255,0.92)'; g.fill();
      // Secondary highlight
      g.beginPath(); g.arc(px + pr*0.26, py + pr*0.3, pr*0.14, 0, Math.PI*2);
      g.fillStyle = 'rgba(255,255,255,0.28)'; g.fill();
      // Corneal blue reflection
      g.beginPath(); g.arc(px + pr*0.18, py - pr*0.52, pr*0.17, 0, Math.PI*2);
      g.fillStyle = 'rgba(110,200,255,0.22)'; g.fill();

      // Iris rim glow
      g.beginPath(); g.arc(x, y, iR, 0, Math.PI*2);
      g.strokeStyle = 'rgba(54,169,244,0.32)'; g.lineWidth = 1.5; g.stroke();

      // Blink — lower lid sweeps up
      if (lid > 0.01) {
        g.save();
        g.beginPath(); g.arc(x, y, R*0.81, 0, Math.PI*2); g.clip();
        const lh = R * 1.62 * lid;
        g.fillStyle = '#1b1209';
        g.fillRect(x - R - 2, y + R*0.8 - lh, R*2 + 4, lh + 1);
        g.restore();
      }
    }

    function draw(t: number) {
      g.clearRect(0, 0, W, H);
      const ht = S.ht, hto = ht * 10;
      const bs  = Math.sin(S.br);
      const isn = Math.sin(S.id * 0.65) * 0.006;
      const sc  = W / 300;  // scale factor for all dimensions

      g.save();
      g.translate(OX, OY + bs * 1.8);
      g.rotate(S.hr * 0.17 + isn);
      g.scale(1 + bs * 0.007, 1 + bs * 0.004);

      // Ambient aura
      const au = g.createRadialGradient(hto, 0, 8, hto, 10, 130 * sc);
      au.addColorStop(0, 'rgba(38,78,155,0.08)'); au.addColorStop(1, 'transparent');
      g.fillStyle = au; g.beginPath(); g.arc(hto, 10, 130*sc, 0, Math.PI*2); g.fill();

      // Wings
      for (const s of [-1, 1]) {
        g.save();
        g.translate(hto*0.4 + s*14*sc, 63*sc);
        g.rotate(s*0.24 + ht*s*0.07);
        g.beginPath(); g.ellipse(s*25*sc, 18*sc, 48*sc, 24*sc, s*0.3, 0, Math.PI*2);
        g.fillStyle = '#100e08'; g.fill();
        g.beginPath(); g.ellipse(s*25*sc, 13*sc, 42*sc, 14*sc, s*0.3, 0, Math.PI*2);
        g.strokeStyle = 'rgba(50,38,18,0.2)'; g.lineWidth = 1.5; g.stroke();
        g.restore();
      }

      // Chest
      g.beginPath(); g.ellipse(hto*0.28, 64*sc, 46*sc, 38*sc, 0, 0, Math.PI*2);
      const cg = g.createRadialGradient(hto*0.28, 54*sc, 4, hto*0.28, 64*sc, 50*sc);
      cg.addColorStop(0,'#342718'); cg.addColorStop(0.5,'#201810'); cg.addColorStop(1,'#0d0c07');
      g.fillStyle = cg; g.fill();

      // Chest feather marks
      for (let i = 0; i < 4; i++) {
        g.beginPath();
        g.ellipse(hto*0.2, (36+i*13)*sc, (22-i*3)*sc, 4*sc, 0, 0, Math.PI*2);
        g.strokeStyle = `rgba(74,54,26,${0.2-i*0.04})`; g.lineWidth = 0.6; g.stroke();
      }

      // Ear tufts
      for (const s of [-1, 1]) {
        const w = Math.sin(t*0.85 + s*0.8) * 0.025;
        g.save();
        g.translate(s*40*sc + hto*0.65, -68*sc);
        g.rotate(s*0.22 + ht*0.09*s + w);
        g.beginPath();
        g.moveTo(0, 0);
        g.bezierCurveTo(s*-6*sc,-15*sc, s*-11*sc,-28*sc, s*-4*sc,-43*sc);
        g.bezierCurveTo(s*-1*sc,-37*sc, s*5*sc,-22*sc, s*8*sc,-12*sc);
        g.bezierCurveTo(s*5*sc,-6*sc,   s*2*sc,-2*sc,  0, 0);
        g.fillStyle = '#1d140c'; g.fill();
        g.strokeStyle = 'rgba(60,44,20,0.28)'; g.lineWidth = 0.8; g.stroke();
        g.restore();
      }

      // Facial disc outer
      g.beginPath(); g.ellipse(hto, 2*sc, 83*sc, 76*sc, 0, 0, Math.PI*2);
      const dO = g.createRadialGradient(hto,-3*sc,26*sc, hto,2*sc,90*sc);
      dO.addColorStop(0,'#372d1c'); dO.addColorStop(0.55,'#251d0f'); dO.addColorStop(1,'#0e0c07');
      g.fillStyle = dO; g.fill();
      g.beginPath(); g.ellipse(hto, 2*sc, 83*sc, 76*sc, 0, 0, Math.PI*2);
      g.strokeStyle = 'rgba(95,70,33,0.14)'; g.lineWidth = 3; g.stroke();

      // Facial disc inner
      g.beginPath(); g.ellipse(hto, 6*sc, 63*sc, 57*sc, 0, 0, Math.PI*2);
      const dI = g.createRadialGradient(hto, 0, 0, hto, 6*sc, 66*sc);
      dI.addColorStop(0,'#403220'); dI.addColorStop(0.4,'#2f2415'); dI.addColorStop(1,'#1a1308');
      g.fillStyle = dI; g.fill();

      // Face feather rings
      for (let i = 1; i <= 3; i++) {
        g.beginPath();
        g.ellipse(hto, 8*sc, (17+i*12)*sc, (15+i*10)*sc, 0, 0, Math.PI*2);
        g.strokeStyle = `rgba(86,63,33,${0.13-i*0.03})`; g.lineWidth = 0.65; g.stroke();
      }

      // Eyes
      const cl = (v: number) => Math.max(-9, Math.min(9, v));
      drawEye(-42*sc + hto, -5*sc, { x: cl(S.elx), y: cl(S.ely) }, S.blid);
      drawEye( 42*sc + hto, -5*sc, { x: cl(S.erx), y: cl(S.ery) }, S.blid);

      // Beak
      const bx = hto;
      g.beginPath();
      g.moveTo(bx-7*sc,26*sc);
      g.bezierCurveTo(bx-5*sc,30*sc, bx,39*sc, bx+2*sc,36*sc);
      g.bezierCurveTo(bx+7*sc,30*sc, bx+7*sc,25*sc, bx+4*sc,24*sc);
      g.bezierCurveTo(bx+1*sc,22*sc, bx-3*sc,22*sc, bx-7*sc,26*sc);
      const bg = g.createLinearGradient(bx-7*sc,24*sc, bx+5*sc,39*sc);
      bg.addColorStop(0,'#6e5023'); bg.addColorStop(0.5,'#523a17'); bg.addColorStop(1,'#32200c');
      g.fillStyle = bg; g.fill();
      g.beginPath();
      g.moveTo(bx-3*sc,27*sc);
      g.bezierCurveTo(bx-1*sc,31*sc, bx+1*sc,34*sc, bx+1*sc,32*sc);
      g.strokeStyle = 'rgba(148,108,50,0.4)'; g.lineWidth = 1; g.stroke();

      g.restore();
    }

    function tick() {
      const nmx = (S.mx - OX) / W * 2;
      const nmy = (S.my - OY) / H * 2;

      // Head springs (slower = heavier feel)
      let r = spr(S.hr, nmy*0.32, S.hrv, 0.054, 0.73);
      S.hr = r.p; S.hrv = r.v;
      let tr = spr(S.ht, nmx*0.45, S.htv, 0.043, 0.74);
      S.ht = tr.p; S.htv = tr.v;

      // Eye springs — each pupil tracks from its own world position
      const hto = S.ht * 10;
      const wlx = OX - 42*(size/300) + hto, wly = OY - 5*(size/300);
      const wrx = OX + 42*(size/300) + hto, wry = wly;
      const dlx = S.mx - wlx, dly = S.my - wly;
      const drx = S.mx - wrx, dry = S.my - wry;
      const ml = Math.hypot(dlx, dly) || 1;
      const mr = Math.hypot(drx, dry) || 1;
      const maxM = 9, kd = 20;

      const tl = { x: dlx/ml * Math.min(ml/kd,maxM), y: dly/ml * Math.min(ml/kd,maxM) };
      const tR = { x: drx/mr * Math.min(mr/kd,maxM), y: dry/mr * Math.min(mr/kd,maxM) };

      const ek = 0.14, ed = 0.64;
      let a = spr(S.elx, tl.x, S.elvx, ek, ed); S.elx=a.p; S.elvx=a.v;
      let b = spr(S.ely, tl.y, S.elvy, ek, ed); S.ely=b.p; S.elvy=b.v;
      let c = spr(S.erx, tR.x, S.ervx, ek, ed); S.erx=c.p; S.ervx=c.v;
      let d = spr(S.ery, tR.y, S.ervy, ek, ed); S.ery=d.p; S.ervy=d.v;

      // Pupil dilation — dilates when cursor is close
      const dist = Math.hypot(nmx, nmy);
      const dt = Math.max(0, Math.min(1, 1.1 - dist * 1.4));
      let dl = spr(S.dil, dt, S.dilv, 0.03, 0.78);
      S.dil = dl.p; S.dilv = dl.v;

      S.br += 0.016;  // breathing cycle
      S.id += 0.011;  // idle sway

      // Blink timer
      S.bti -= 1 / 60;
      if (S.bti <= 0 && !S.bact) {
        S.bact = true; S.bph = 0;
        S.bti = 2.8 + Math.random() * 5;
      }
      if (S.bact) {
        S.bph += 0.13;
        S.blid = Math.max(0, Math.sin(S.bph));
        if (S.bph >= Math.PI) { S.bact = false; S.blid = 0; }
      }
    }

    let rafId: number;
    const loop = (ts: number) => {
      tick();
      draw(ts / 1000);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        background: 'transparent',
        width: size,
        height: Math.round(size * 1.2),
      }}
    />
  );
}