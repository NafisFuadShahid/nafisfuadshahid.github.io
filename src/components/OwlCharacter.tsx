import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface OwlHandle {
  triggerFly: () => void;
}

interface Props {
  size?: number;
  flyMode?: boolean;
  wingSpread?: number;
}

const OwlCharacter = forwardRef<OwlHandle, Props>(function OwlCharacter(
  { size = 160, flyMode = false, wingSpread = 0 },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    mx: 0, my: 0,
    hr: 0, hrv: 0,
    ht: 0, htv: 0,
    elx: 0, ely: 0, elvx: 0, elvy: 0,
    erx: 0, ery: 0, ervx: 0, ervy: 0,
    dil: 0.3, dilv: 0,
    blid: 0, bact: false, bph: 0, bti: 3.2,
    br: 0, id: 0,
    flyMode: false,
    wingSpread: 0,
    wingSpreadV: 0,
  });

  useImperativeHandle(ref, () => ({
    triggerFly: () => {
      stateRef.current.flyMode = true;
    },
  }));

  useEffect(() => {
    stateRef.current.flyMode = flyMode;
  }, [flyMode]);

  useEffect(() => {
    stateRef.current.wingSpread = wingSpread;
  }, [wingSpread]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const g = ctx;

    const W = size;
    const H = Math.round(size * 1.25);
    const dpr = window.devicePixelRatio || 1;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    cv.style.width  = W + 'px';
    cv.style.height = H + 'px';
    g.scale(dpr, dpr);

    const OX = W / 2;
    const OY = H * 0.46;
    const sc = W / 160;

    stateRef.current.mx = OX;
    stateRef.current.my = OY - 60;

    const spr = (p: number, t: number, v: number, k = 0.08, d = 0.72) => {
      const f = (t - p) * k - v * d;
      return { p: p + v + f, v: v + f };
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      stateRef.current.mx = (e.clientX - r.left) * (W / r.width);
      stateRef.current.my = (e.clientY - r.top) * (H / r.height);
    };
    document.addEventListener('mousemove', onMouseMove, { passive: true });

    function drawEye(x: number, y: number, pu: { x: number; y: number }, lid: number) {
      const R = W * 0.095;

      const og = g.createRadialGradient(x, y, 1, x, y, R * 1.7);
      og.addColorStop(0,    'rgba(54,169,244,0.22)');
      og.addColorStop(0.55, 'rgba(54,169,244,0.06)');
      og.addColorStop(1,    'transparent');
      g.fillStyle = og;
      g.beginPath(); g.arc(x, y, R * 1.7, 0, Math.PI * 2); g.fill();

      g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2);
      g.fillStyle = '#0d1520'; g.fill();

      g.beginPath(); g.arc(x, y, R * 0.82, 0, Math.PI * 2);
      g.fillStyle = '#020810'; g.fill();

      const iR = R * 0.65;
      const ir = g.createRadialGradient(x + pu.x * 0.2, y + pu.y * 0.2, 0.5, x, y, iR);
      ir.addColorStop(0,    '#b8eeff');
      ir.addColorStop(0.18, '#54c4ff');
      ir.addColorStop(0.45, '#1580d4');
      ir.addColorStop(0.78, '#0a3d78');
      ir.addColorStop(1,    '#031828');
      g.beginPath(); g.arc(x, y, iR, 0, Math.PI * 2);
      g.fillStyle = ir; g.fill();

      g.beginPath(); g.arc(x, y, iR * 0.68, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(54,169,244,0.28)'; g.lineWidth = 0.7; g.stroke();

      const S = stateRef.current;
      const pr = W * 0.022 + S.dil * W * 0.016;
      const px = x + pu.x, py = y + pu.y;
      const pg = g.createRadialGradient(px - 1, py - 1, 0, px, py, pr);
      pg.addColorStop(0, '#10102a'); pg.addColorStop(1, '#000008');
      g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2);
      g.fillStyle = pg; g.fill();

      g.beginPath(); g.arc(px - pr * 0.36, py - pr * 0.36, pr * 0.32, 0, Math.PI * 2);
      g.fillStyle = 'rgba(255,255,255,0.94)'; g.fill();
      g.beginPath(); g.arc(px + pr * 0.24, py + pr * 0.28, pr * 0.14, 0, Math.PI * 2);
      g.fillStyle = 'rgba(255,255,255,0.3)'; g.fill();

      g.beginPath(); g.arc(x, y, iR, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(54,169,244,0.4)'; g.lineWidth = 1.4; g.stroke();

      g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(54,100,180,0.25)'; g.lineWidth = 1.5; g.stroke();

      if (lid > 0.01) {
        g.save();
        g.beginPath(); g.arc(x, y, R * 0.83, 0, Math.PI * 2); g.clip();
        const lh = R * 1.66 * lid;
        g.fillStyle = '#0d1520';
        g.fillRect(x - R - 2, y + R * 0.82 - lh, R * 2 + 4, lh + 1);
        g.restore();
      }
    }

    function draw(t: number) {
      const S = stateRef.current;
      g.clearRect(0, 0, W, H);

      const ht  = S.ht;
      const hto = ht * 8 * sc;
      const bs  = Math.sin(S.br);
      const isn = Math.sin(S.id * 0.65) * 0.006;
      const ws  = S.wingSpread;

      g.save();
      g.translate(OX, OY + bs * 1.4);
      g.rotate(S.hr * 0.15 + isn);
      g.scale(1 + bs * 0.006, 1 + bs * 0.004);

      const au = g.createRadialGradient(hto, 0, 4, hto, 8, 90 * sc);
      au.addColorStop(0, 'rgba(12,100,200,0.10)');
      au.addColorStop(1, 'transparent');
      g.fillStyle = au;
      g.beginPath(); g.arc(hto, 8 * sc, 90 * sc, 0, Math.PI * 2); g.fill();

      const wingSide = [-1, 1] as const;
      for (const s of wingSide) {
        g.save();
        const baseAngle = s * 0.28 + ht * s * 0.06;
        const spreadAngle = s * ws * 1.1;
        const wingX = hto + s * 10 * sc;
        const wingY = 48 * sc;
        g.translate(wingX, wingY);
        g.rotate(baseAngle + spreadAngle);

        const wingW = (52 + ws * 38) * sc;
        const wingH = (22 + ws * 18) * sc;
        g.beginPath(); g.ellipse(s * (24 + ws * 28) * sc, (14 + ws * 10) * sc, wingW, wingH, s * 0.28, 0, Math.PI * 2);

        const wg = g.createRadialGradient(s * 20 * sc, 10 * sc, 2, s * 30 * sc, 15 * sc, wingW);
        wg.addColorStop(0,   '#182840');
        wg.addColorStop(0.4, '#0e1c30');
        wg.addColorStop(1,   '#080e18');
        g.fillStyle = wg; g.fill();

        g.beginPath(); g.ellipse(s * (24 + ws * 28) * sc, (14 + ws * 10) * sc, wingW * 0.85, wingH * 0.62, s * 0.28, 0, Math.PI * 2);
        g.strokeStyle = 'rgba(54,140,220,0.18)'; g.lineWidth = 1.2; g.stroke();

        if (ws > 0.3) {
          for (let f = 0; f < 5; f++) {
            const ft = f / 4;
            g.beginPath();
            g.moveTo(s * (8 + ft * 60) * sc * ws, 0);
            g.lineTo(s * (12 + ft * 70) * sc * ws, (20 + ft * 10) * sc * ws);
            g.strokeStyle = `rgba(54,120,200,${0.12 - ft * 0.02})`;
            g.lineWidth = 0.8;
            g.stroke();
          }
        }
        g.restore();
      }

      g.beginPath(); g.ellipse(hto * 0.3, 52 * sc, 38 * sc, 30 * sc, 0, 0, Math.PI * 2);
      const cg = g.createRadialGradient(hto * 0.3, 44 * sc, 3, hto * 0.3, 52 * sc, 42 * sc);
      cg.addColorStop(0,   '#1e2d44');
      cg.addColorStop(0.5, '#131e30');
      cg.addColorStop(1,   '#080e18');
      g.fillStyle = cg; g.fill();

      for (let i = 0; i < 3; i++) {
        g.beginPath();
        g.ellipse(hto * 0.2, (28 + i * 10) * sc, (18 - i * 2) * sc, 3 * sc, 0, 0, Math.PI * 2);
        g.strokeStyle = `rgba(54,120,200,${0.18 - i * 0.04})`; g.lineWidth = 0.6; g.stroke();
      }

      for (const s of wingSide) {
        const w = Math.sin(t * 0.85 + s * 0.8) * 0.022;
        g.save();
        g.translate(s * 32 * sc + hto * 0.6, -52 * sc);
        g.rotate(s * 0.22 + ht * 0.09 * s + w);
        g.beginPath();
        g.moveTo(0, 0);
        g.bezierCurveTo(s * -5 * sc, -12 * sc, s * -9 * sc, -22 * sc, s * -3 * sc, -34 * sc);
        g.bezierCurveTo(s * -1 * sc, -28 * sc, s * 4 * sc, -17 * sc, s * 6 * sc, -9 * sc);
        g.bezierCurveTo(s * 4 * sc, -4 * sc, s * 1 * sc, -1 * sc, 0, 0);
        const tg = g.createLinearGradient(0, 0, 0, -34 * sc);
        tg.addColorStop(0, '#182840');
        tg.addColorStop(1, '#0d1825');
        g.fillStyle = tg; g.fill();
        g.strokeStyle = 'rgba(54,120,200,0.2)'; g.lineWidth = 0.7; g.stroke();
        g.restore();
      }

      g.beginPath(); g.ellipse(hto, 1 * sc, 68 * sc, 62 * sc, 0, 0, Math.PI * 2);
      const dO = g.createRadialGradient(hto, -2 * sc, 20 * sc, hto, 1 * sc, 75 * sc);
      dO.addColorStop(0,    '#1e2d44');
      dO.addColorStop(0.55, '#131e30');
      dO.addColorStop(1,    '#080e18');
      g.fillStyle = dO; g.fill();
      g.beginPath(); g.ellipse(hto, 1 * sc, 68 * sc, 62 * sc, 0, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(54,120,200,0.18)'; g.lineWidth = 2.5; g.stroke();

      g.beginPath(); g.ellipse(hto, 4 * sc, 52 * sc, 46 * sc, 0, 0, Math.PI * 2);
      const dI = g.createRadialGradient(hto, 0, 0, hto, 4 * sc, 54 * sc);
      dI.addColorStop(0,   '#243650');
      dI.addColorStop(0.4, '#1a2840');
      dI.addColorStop(1,   '#0e1825');
      g.fillStyle = dI; g.fill();

      for (let i = 1; i <= 3; i++) {
        g.beginPath();
        g.ellipse(hto, 6 * sc, (13 + i * 10) * sc, (12 + i * 8) * sc, 0, 0, Math.PI * 2);
        g.strokeStyle = `rgba(54,120,200,${0.12 - i * 0.03})`; g.lineWidth = 0.6; g.stroke();
      }

      const cl = (v: number) => Math.max(-7, Math.min(7, v));
      drawEye(-34 * sc + hto, -4 * sc, { x: cl(S.elx), y: cl(S.ely) }, S.blid);
      drawEye( 34 * sc + hto, -4 * sc, { x: cl(S.erx), y: cl(S.ery) }, S.blid);

      const bx = hto;
      g.beginPath();
      g.moveTo(bx - 5 * sc, 20 * sc);
      g.bezierCurveTo(bx - 4 * sc, 24 * sc, bx, 31 * sc, bx + 2 * sc, 28 * sc);
      g.bezierCurveTo(bx + 5 * sc, 23 * sc, bx + 5 * sc, 19 * sc, bx + 3 * sc, 18 * sc);
      g.bezierCurveTo(bx + 1 * sc, 17 * sc, bx - 2 * sc, 17 * sc, bx - 5 * sc, 20 * sc);
      const bkg = g.createLinearGradient(bx - 5 * sc, 17 * sc, bx + 4 * sc, 31 * sc);
      bkg.addColorStop(0,   '#5a8ab0');
      bkg.addColorStop(0.5, '#3a6888');
      bkg.addColorStop(1,   '#1e3d55');
      g.fillStyle = bkg; g.fill();

      g.restore();
    }

    function tick() {
      const S = stateRef.current;
      const nmx = (S.mx - OX) / W * 2;
      const nmy = (S.my - OY) / H * 2;

      let r = spr(S.hr, nmy * 0.28, S.hrv, 0.05, 0.74);
      S.hr = r.p; S.hrv = r.v;
      let tr = spr(S.ht, nmx * 0.38, S.htv, 0.04, 0.76);
      S.ht = tr.p; S.htv = tr.v;

      const hto = S.ht * 8 * sc;
      const wlx = OX - 34 * sc + hto;
      const wly = OY - 4 * sc;
      const wrx = OX + 34 * sc + hto;
      const wry = wly;
      const dlx = S.mx - wlx, dly = S.my - wly;
      const drx = S.mx - wrx, dry = S.my - wry;
      const ml = Math.hypot(dlx, dly) || 1;
      const mr = Math.hypot(drx, dry) || 1;
      const maxM = 7, kd = 18;

      const tl = { x: dlx / ml * Math.min(ml / kd, maxM), y: dly / ml * Math.min(ml / kd, maxM) };
      const tR = { x: drx / mr * Math.min(mr / kd, maxM), y: dry / mr * Math.min(mr / kd, maxM) };

      const ek = 0.14, ed = 0.64;
      let a = spr(S.elx, tl.x, S.elvx, ek, ed); S.elx = a.p; S.elvx = a.v;
      let b = spr(S.ely, tl.y, S.elvy, ek, ed); S.ely = b.p; S.elvy = b.v;
      let c = spr(S.erx, tR.x, S.ervx, ek, ed); S.erx = c.p; S.ervx = c.v;
      let d = spr(S.ery, tR.y, S.ervy, ek, ed); S.ery = d.p; S.ervy = d.v;

      const dist = Math.hypot(nmx, nmy);
      const dt = Math.max(0, Math.min(1, 1.1 - dist * 1.4));
      let dl = spr(S.dil, dt, S.dilv, 0.03, 0.78);
      S.dil = dl.p; S.dilv = dl.v;

      S.br += 0.016;
      S.id += 0.011;

      S.bti -= 1 / 60;
      if (S.bti <= 0 && !S.bact) {
        S.bact = true; S.bph = 0;
        S.bti = 2.5 + Math.random() * 5;
      }
      if (S.bact) {
        S.bph += 0.13;
        S.blid = Math.max(0, Math.sin(S.bph));
        if (S.bph >= Math.PI) { S.bact = false; S.blid = 0; }
      }

      const targetWS = S.flyMode ? 1 : wingSpread;
      const wsResult = spr(S.wingSpread, targetWS, S.wingSpreadV, 0.04, 0.72);
      S.wingSpread = wsResult.p;
      S.wingSpreadV = wsResult.v;
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
  }, [size, wingSpread]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        background: 'transparent',
        width: size,
        height: Math.round(size * 1.25),
        imageRendering: 'auto',
      }}
    />
  );
});

export default OwlCharacter;
