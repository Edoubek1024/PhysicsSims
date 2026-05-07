// id="rolling_energy_split"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SliderWithInput } from '../../components/SliderWithInput';

const G = 9.81;

const CANVAS_W = 760;
const CANVAS_H = 420;
const RAMP_LEN_PX = 380;
const UI_FRAME_MS = 16;

type ShapeKind = 'sphere' | 'disk' | 'ring';

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Dimensionless factor I = β m r² */
function inertiaBeta(shape: ShapeKind): number {
  switch (shape) {
    case 'sphere':
      return 2 / 5;
    case 'disk':
      return 1 / 2;
    case 'ring':
      return 1;
    default:
      return 2 / 5;
  }
}

function shapeLabel(shape: ShapeKind): string {
  switch (shape) {
    case 'sphere':
      return 'Solid sphere';
    case 'disk':
      return 'Solid disk / cylinder';
    case 'ring':
      return 'Hollow ring';
    default:
      return '';
  }
}

type SimState = {
  t: number;
  atBottom: boolean;
};

type EnergySnapshot = {
  pe: number;
  keT: number;
  keR: number;
  total: number;
  fracRot: number;
  fracTrans: number;
};

function computeEnergies(m: number, H: number, thetaRad: number, s: number, v: number, beta: number, r: number): EnergySnapshot {
  const h = clamp(H - s * Math.sin(thetaRad), 0, H);
  const pe = m * G * h;
  const keT = 0.5 * m * v * v;
  const omega = r > 1e-9 ? v / r : 0;
  const I = beta * m * r * r;
  const keR = 0.5 * I * omega * omega;
  const kinetic = keT + keR;
  const fracDenom = kinetic > 1e-12 ? kinetic : 1;
  return {
    pe,
    keT,
    keR,
    total: pe + keT + keR,
    fracRot: keR / fracDenom,
    fracTrans: keT / fracDenom,
  };
}

export function RollingEnergySplit() {
  const [massKg, setMassKg] = useState(5);
  const [radiusM, setRadiusM] = useState(0.4);
  const [rampHeightM, setRampHeightM] = useState(8);
  const [angleDeg, setAngleDeg] = useState(28);
  const [shape, setShape] = useState<ShapeKind>('sphere');

  const [sDisplay, setSDisplay] = useState(0);
  const [vDisplay, setVDisplay] = useState(0);
  const [omegaDisplay, setOmegaDisplay] = useState(0);
  const [energyDisplay, setEnergyDisplay] = useState<EnergySnapshot>(() =>
    computeEnergies(5, 8, degToRad(28), 0, 0, inertiaBeta('sphere'), 0.4)
  );

  const stateRef = useRef<SimState>({ t: 0, atBottom: false });
  const controlsRef = useRef({ massKg, radiusM, rampHeightM, angleDeg, shape });
  const lastUiRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const [trailPoints, setTrailPoints] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    controlsRef.current = { massKg, radiusM, rampHeightM, angleDeg, shape };
  }, [massKg, radiusM, rampHeightM, angleDeg, shape]);

  const resetSim = useCallback(() => {
    stateRef.current = { t: 0, atBottom: false };
    lastTsRef.current = null;
    setTrailPoints([]);
    const c = controlsRef.current;
    const thetaRad = Math.max(degToRad(c.angleDeg), degToRad(0.15));
    setSDisplay(0);
    setVDisplay(0);
    setOmegaDisplay(0);
    setEnergyDisplay(computeEnergies(c.massKg, c.rampHeightM, thetaRad, 0, 0, inertiaBeta(c.shape), c.radiusM));
  }, []);

  useEffect(() => {
    resetSim();
  }, [massKg, rampHeightM, angleDeg, shape, radiusM, resetSim]);

  const beta = useMemo(() => inertiaBeta(shape), [shape]);

  const geom = useMemo(() => {
    const thetaRad = Math.max(degToRad(angleDeg), degToRad(0.15));
    const L = rampHeightM / Math.sin(thetaRad);
    return { thetaRad, L, rampLenPx: RAMP_LEN_PX };
  }, [angleDeg, rampHeightM]);

  /** Ramp top/bottom in SVG coords (y grows downward) */
  const rampGeom = useMemo(() => {
    const { thetaRad, rampLenPx } = geom;
    const topX = 72;
    const topY = 95;
    const uX = Math.cos(thetaRad);
    const uY = Math.sin(thetaRad);
    const botX = topX + rampLenPx * uX;
    const botY = topY + rampLenPx * uY;
    const nX = -uY;
    const nY = uX;
    return { topX, topY, botX, botY, uX, uY, nX, nY, thetaRad, rampLenPx };
  }, [geom]);

  const ballPx = useMemo(() => {
    const scale = RAMP_LEN_PX / Math.max(geom.L, 1e-6);
    return clamp(radiusM * scale * 0.95, 10, 44);
  }, [geom.L, radiusM]);

  const ballCenter = useMemo(() => {
    const frac = geom.L > 1e-9 ? sDisplay / geom.L : 0;
    const onX = rampGeom.topX + frac * rampGeom.rampLenPx * rampGeom.uX;
    const onY = rampGeom.topY + frac * rampGeom.rampLenPx * rampGeom.uY;
    const cx = onX + rampGeom.nX * ballPx;
    const cy = onY + rampGeom.nY * ballPx;
    return { cx, cy };
  }, [geom.L, sDisplay, rampGeom, ballPx]);

  const spinPhi = useMemo(() => {
    if (radiusM < 1e-9) return 0;
    return sDisplay / radiusM;
  }, [sDisplay, radiusM]);

  useEffect(() => {
    let rafId: number | null = null;

    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(0.032, Math.max(0, (ts - (lastTsRef.current ?? ts)) / 1000));
      lastTsRef.current = ts;

      const c = controlsRef.current;
      const θ = Math.max(degToRad(c.angleDeg), degToRad(0.15));
      const L = c.rampHeightM / Math.sin(θ);
      const b = inertiaBeta(c.shape);
      const a = (G * Math.sin(θ)) / (1 + b);

      const st = stateRef.current;
      if (!st.atBottom) {
        st.t += dt;
        const sCandidate = 0.5 * a * st.t * st.t;
        if (sCandidate >= L) {
          st.atBottom = true;
        }
      }

      const s = st.atBottom ? L : Math.min(L, 0.5 * a * st.t * st.t);
      const v = st.atBottom ? Math.sqrt(Math.max(0, 2 * a * L)) : Math.sqrt(Math.max(0, 2 * a * s));
      const ω = c.radiusM > 1e-9 ? v / c.radiusM : 0;

      if (ts - lastUiRef.current > UI_FRAME_MS) {
        setSDisplay(s);
        setVDisplay(v);
        setOmegaDisplay(ω);
        setEnergyDisplay(computeEnergies(c.massKg, c.rampHeightM, θ, s, v, b, c.radiusM));
        lastUiRef.current = ts;

        const frac = L > 1e-9 ? s / L : 0;
        const onX = rampGeom.topX + frac * rampGeom.rampLenPx * rampGeom.uX;
        const onY = rampGeom.topY + frac * rampGeom.rampLenPx * rampGeom.uY;
        const cx = onX + rampGeom.nX * ballPx;
        const cy = onY + rampGeom.nY * ballPx;
        setTrailPoints((prev) => {
          const next = [...prev, { x: cx, y: cy }];
          return next.length > 90 ? next.slice(-90) : next;
        });
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      lastTsRef.current = null;
    };
  }, [ballPx, rampGeom.nX, rampGeom.nY, rampGeom.rampLenPx, rampGeom.topX, rampGeom.topY, rampGeom.uX, rampGeom.uY]);

  const E0 = massKg * G * rampHeightM;
  const barPeH = E0 > 1e-12 ? (energyDisplay.pe / E0) * 100 : 0;
  const barKtH = E0 > 1e-12 ? (energyDisplay.keT / E0) * 100 : 0;
  const barKrH = E0 > 1e-12 ? (energyDisplay.keR / E0) * 100 : 0;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 text-slate-100">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Rotational energy</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Rolling Without Slipping (Energy Split Explorer)
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Watch gravitational potential energy convert into translational and rotational kinetic energy under the no-slip constraint v = ωr, with a conserved total energy E = mgh.
          </p>
        </div>
        <Link
          to="/211"
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-sky-500 hover:text-sky-100"
        >
          <span className="text-sm">←</span>
          Back to PHYS211
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.75fr)]">
        <section className="order-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
          <h2 className="text-sm font-semibold tracking-wide text-violet-300">Simulation</h2>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/85 p-2">
            <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="h-auto w-full max-h-[28rem] rounded-lg">
              <rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} fill="#020617" />

              <text x={24} y={36} fill="rgb(148 163 184)" fontSize={12} className="font-medium">
                θ = {angleDeg.toFixed(1)}° · ramp length L = {geom.L.toFixed(2)} m
              </text>

              {/* Ground line */}
              <line
                x1={48}
                y1={rampGeom.botY + ballPx + 6}
                x2={CANVAS_W - 36}
                y2={rampGeom.botY + ballPx + 6}
                stroke="rgb(51 65 85)"
                strokeWidth={2}
              />

              {/* Ramp */}
              <line
                x1={rampGeom.topX}
                y1={rampGeom.topY}
                x2={rampGeom.botX}
                y2={rampGeom.botY}
                stroke="rgb(56 189 248)"
                strokeWidth={5}
                strokeLinecap="round"
              />
              <polygon
                points={`${rampGeom.botX},${rampGeom.botY} ${rampGeom.botX - 18},${rampGeom.botY + 10} ${rampGeom.botX + 10},${rampGeom.botY + 10}`}
                fill="rgb(56 189 248)"
                opacity={0.35}
              />

              {/* Trail */}
              {trailPoints.length > 1 ? (
                <polyline
                  fill="none"
                  stroke="rgba(167,139,250,0.45)"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={trailPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                />
              ) : null}

              {/* Rolling body */}
              <g>
                <circle
                  cx={ballCenter.cx}
                  cy={ballCenter.cy}
                  r={ballPx}
                  fill={
                    shape === 'sphere'
                      ? 'rgba(56,189,248,0.22)'
                      : shape === 'disk'
                        ? 'rgba(52,211,153,0.20)'
                        : 'rgba(244,114,182,0.18)'
                  }
                  stroke={shape === 'ring' ? '#f472b6' : shape === 'disk' ? '#34d399' : '#38bdf8'}
                  strokeWidth={2.5}
                />
                <line
                  x1={ballCenter.cx}
                  y1={ballCenter.cy}
                  x2={ballCenter.cx + Math.cos(spinPhi) * ballPx * 0.88}
                  y2={ballCenter.cy + Math.sin(spinPhi) * ballPx * 0.88}
                  stroke="#fbbf24"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <circle cx={ballCenter.cx} cy={ballCenter.cy} r={3.5} fill="#f8fafc" />
              </g>

              <text x={24} y={CANVAS_H - 18} fill="rgb(148 163 184)" fontSize={11}>
                Side view · marker rotates by φ = s / r (rolling distance / radius)
              </text>
            </svg>
          </div>
        </section>

        <aside className="order-2 flex flex-col gap-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/40">
            <h2 className="text-sm font-semibold tracking-wide text-violet-300">Object</h2>
            <div className="mt-4 flex flex-col gap-4">
              <SliderWithInput
                label="Mass"
                units="kg"
                min={0.5}
                max={50}
                step={0.5}
                value={massKg}
                onChange={(v) => setMassKg(v)}
                syncToUrl={false}
              />
              <SliderWithInput
                label="Radius"
                units="m"
                min={0.1}
                max={2}
                step={0.05}
                value={radiusM}
                onChange={(v) => setRadiusM(v)}
                syncToUrl={false}
              />
              <div>
                <p className="text-xs font-medium text-slate-200">Shape (sets I = βmr²)</p>
                <div className="mt-2 flex flex-col gap-2">
                  {(['sphere', 'disk', 'ring'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setShape(k)}
                      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                        shape === k
                          ? 'bg-violet-500 text-slate-950'
                          : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-violet-500/60'
                      }`}
                    >
                      {shapeLabel(k)}
                      <span className="mt-0.5 block text-[0.7rem] font-normal opacity-80">
                        β = {inertiaBeta(k).toFixed(3)} · {k === 'sphere' ? '2/5' : k === 'disk' ? '1/2' : '1'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/40">
            <h2 className="text-sm font-semibold tracking-wide text-sky-300">Ramp</h2>
            <div className="mt-4 flex flex-col gap-4">
              <SliderWithInput
                label="Vertical height H"
                units="m"
                min={1}
                max={20}
                step={0.5}
                value={rampHeightM}
                onChange={(v) => setRampHeightM(v)}
                syncToUrl={false}
              />
              <SliderWithInput
                label="Angle from horizontal"
                units="°"
                min={0}
                max={60}
                step={1}
                value={angleDeg}
                onChange={(v) => setAngleDeg(v)}
                syncToUrl={false}
              />
              <button
                type="button"
                onClick={resetSim}
                className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-violet-400 hover:bg-slate-800"
              >
                Reset roll from top
              </button>
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold tracking-wide text-violet-300">Energy breakdown</h2>
        <p className="mt-1 text-xs text-slate-400">
          β = {beta.toFixed(3)} ({shapeLabel(shape)}). Split of kinetic energy:{' '}
          <span className="font-mono text-sky-200">{(100 * energyDisplay.fracTrans).toFixed(1)}%</span> translation ·{' '}
          <span className="font-mono text-emerald-200">{(100 * energyDisplay.fracRot).toFixed(1)}%</span> rotation (of KE only).
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-8">
          <div className="flex items-end gap-3">
            <div className="flex h-36 w-10 flex-col justify-end overflow-hidden rounded-md border border-slate-700 bg-slate-950">
              <div className="w-full bg-emerald-500/90" style={{ height: `${barKrH}%` }} title="KE_rot" />
              <div className="w-full bg-sky-500/90" style={{ height: `${barKtH}%` }} title="KE_trans" />
              <div className="w-full bg-fuchsia-500/90" style={{ height: `${barPeH}%` }} title="PE" />
            </div>
            <div className="space-y-1 text-[0.7rem] text-slate-400">
              <p>
                <span className="inline-block h-2 w-2 rounded-sm bg-fuchsia-500 align-middle" /> PE
              </p>
              <p>
                <span className="inline-block h-2 w-2 rounded-sm bg-sky-500 align-middle" /> KEₜᵣₐₙₛ
              </p>
              <p>
                <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500 align-middle" /> KEᵣₒₜ
              </p>
            </div>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EnergyMetric label="PE = mgh" value={`${energyDisplay.pe.toFixed(2)} J`} detail={`h over bottom reference`} />
            <EnergyMetric label="KE_trans = ½mv²" value={`${energyDisplay.keT.toFixed(2)} J`} detail={`v = ${vDisplay.toFixed(3)} m/s`} />
            <EnergyMetric label="KE_rot = ½Iω²" value={`${energyDisplay.keR.toFixed(2)} J`} detail={`ω = ${omegaDisplay.toFixed(3)} rad/s`} />
            <EnergyMetric
              label="Total E"
              value={`${energyDisplay.total.toFixed(2)} J`}
              detail={`initial mgH = ${E0.toFixed(2)} J`}
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-violet-300/95">Key ideas</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            <strong className="text-slate-200">Rolling without slipping</strong> ties linear and angular motion: v = ωr. Only one independent speed;
            the split between translation and rotation is fixed by the shape through I = βmr².
          </li>
          <li>
            <strong className="text-slate-200">Static friction</strong> enforces the no-slip constraint at the contact point. Because that point is instantaneously at rest,
            static friction does no work here, so mechanical energy is conserved for this ideal model (no slip, no deformation heating).
          </li>
          <li>
            Energy conservation gives{' '}
            <span className="font-mono text-sky-200/95">mgH = ½mv² + ½Iω²</span>. With ω = v/r, more “rotational inertia” (larger β) forces more energy into rotation for the same v,
            so the object reaches a <em>lower</em> translational speed at the bottom — rings (β = 1) are slower than solid spheres (β = 2/5) for the same ramp.
          </li>
          <li>
            Linear acceleration down the ramp is{' '}
            <span className="font-mono text-emerald-200/95">a = g sin θ / (1 + β)</span>: mass and radius cancel from β alone, but energies still scale with m, and ω = v/r depends on r.
          </li>
        </ul>
      </section>
    </div>
  );
}

function EnergyMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2">
      <p className="text-[0.66rem] text-slate-400">{label}</p>
      <p className="mt-0.5 font-mono text-[0.85rem] text-sky-200">{value}</p>
      <p className="mt-1 text-[0.65rem] text-slate-500">{detail}</p>
    </div>
  );
}
