import React, { useState, useRef, useCallback } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../styles/theme';

// ── SVG coordinate system ─────────────────────────────────────────────────────
const SW = 460, SH = 360;
const XL = -6, XR = 6, YB = -5, YT = 5;

function toSX(x) { return ((x - XL) / (XR - XL)) * SW; }
function toSY(y) { return SH - ((y - YB) / (YT - YB)) * SH; }
function toMX(sx) { return XL + (sx / SW) * (XR - XL); }
function toMY(sy) { return YB + ((SH - sy) / SH) * (YT - YB); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ── Preset scenarios for the Watch tab ───────────────────────────────────────
const SCENARIOS = [
  {
    id: 'positive', label: 'Positive', icon: '↗',
    p1: { x: -3, y: -2 }, p2: { x: 3, y: 4 },
    color: colors.accent,
    title: 'Positive Slope',
    body: 'As x increases, y increases. The line rises from left to right.',
    note: 'Every 1 unit right → 1 unit up. Slope = 1.',
    example: 'Going uphill · savings growing · temperature rising',
  },
  {
    id: 'negative', label: 'Negative', icon: '↘',
    p1: { x: -3, y: 4 }, p2: { x: 3, y: -2 },
    color: colors.danger,
    title: 'Negative Slope',
    body: 'As x increases, y decreases. The line falls from left to right.',
    note: 'Every 1 unit right → 1 unit down. Slope = −1.',
    example: 'Going downhill · cooling off · fuel draining',
  },
  {
    id: 'zero', label: 'Zero', icon: '→',
    p1: { x: -4, y: 2 }, p2: { x: 4, y: 2 },
    color: colors.secondary,
    title: 'Zero Slope',
    body: 'y stays the same as x changes. The line is perfectly flat.',
    note: 'Δy = 0, so slope = 0/Δx = 0.',
    example: 'Flat road · water at rest · constant speed',
  },
  {
    id: 'undefined', label: 'Undefined', icon: '↕',
    p1: { x: 2, y: -3 }, p2: { x: 2, y: 3 },
    color: colors.phase3,
    title: 'Undefined Slope',
    body: 'x never changes. Δx = 0, so slope = Δy ÷ 0 — impossible!',
    note: 'We cannot divide by zero. Vertical lines have no slope.',
    example: 'A vertical wall · a cliff face',
  },
];

// ── Coordinate grid ───────────────────────────────────────────────────────────
function CoordGrid() {
  const items = [];
  for (let x = XL; x <= XR; x++) {
    items.push(
      <line key={`vg${x}`}
        x1={toSX(x)} y1={0} x2={toSX(x)} y2={SH}
        stroke={x === 0 ? '#2d3748' : '#111827'}
        strokeWidth={x === 0 ? 1.5 : 0.6}
      />
    );
    if (x !== 0) items.push(
      <text key={`xt${x}`} x={toSX(x)} y={toSY(0) + 14}
        fill="#374151" fontSize={9} textAnchor="middle">{x}</text>
    );
  }
  for (let y = YB; y <= YT; y++) {
    items.push(
      <line key={`hg${y}`}
        x1={0} y1={toSY(y)} x2={SW} y2={toSY(y)}
        stroke={y === 0 ? '#2d3748' : '#111827'}
        strokeWidth={y === 0 ? 1.5 : 0.6}
      />
    );
    if (y !== 0) items.push(
      <text key={`yt${y}`} x={toSX(0) - 6} y={toSY(y) + 3}
        fill="#374151" fontSize={9} textAnchor="end">{y}</text>
    );
  }
  items.push(
    <text key="xl" x={SW - 5} y={toSY(0) - 6} fill="#4b5563" fontSize={11} textAnchor="end">x</text>,
    <text key="yl" x={toSX(0) + 7} y={13} fill="#4b5563" fontSize={11}>y</text>
  );
  return <>{items}</>;
}

// ── Interactive slope graph ───────────────────────────────────────────────────
function SlopeGraph({ p1, p2, onP1Change, onP2Change, showLabels = true }) {
  const svgRef = useRef(null);
  const dragging = useRef(null);

  const resolve = useCallback((cx, cy) => {
    const r = svgRef.current.getBoundingClientRect();
    return [
      clamp(toMX(((cx - r.left) / r.width) * SW), XL + 0.3, XR - 0.3),
      clamp(toMY(((cy - r.top) / r.height) * SH), YB + 0.3, YT - 0.3),
    ];
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const [mx, my] = resolve(e.clientX, e.clientY);
    dragging.current === 'p1' ? onP1Change({ x: mx, y: my }) : onP2Change({ x: mx, y: my });
  }, [resolve, onP1Change, onP2Change]);

  const onTouchMove = useCallback((e) => {
    if (!dragging.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const [mx, my] = resolve(t.clientX, t.clientY);
    dragging.current === 'p1' ? onP1Change({ x: mx, y: my }) : onP2Change({ x: mx, y: my });
  }, [resolve, onP1Change, onP2Change]);

  const stopDrag = () => { dragging.current = null; };

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const vert = Math.abs(dx) < 0.08;

  // Extended line through the two points
  let lx1, ly1, lx2, ly2;
  if (vert) {
    lx1 = p1.x; ly1 = YB; lx2 = p1.x; ly2 = YT;
  } else {
    const m = dy / dx;
    lx1 = XL; ly1 = p1.y + m * (XL - p1.x);
    lx2 = XR; ly2 = p1.y + m * (XR - p1.x);
  }

  // Triangle: corner at (p2.x, p1.y)
  const cxS = toSX(p2.x), cyS = toSY(p1.y);
  const showTri = !vert && Math.abs(dx) > 0.4 && Math.abs(dy) > 0.4;

  // Right-angle marker (9px square at corner)
  const mk = 9;
  const msx = -Math.sign(dx) * mk;
  const msy = -Math.sign(dy) * mk;

  // Label anchors — keep P1 and P2 labels from overlapping
  const p1Anchor = dx >= 0 ? 'end' : 'start';
  const p1LX = toSX(p1.x) + (dx >= 0 ? -14 : 14);
  const p2Anchor = dx >= 0 ? 'start' : 'end';
  const p2LX = toSX(p2.x) + (dx >= 0 ? 14 : -14);

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={`0 0 ${SW} ${SH}`}
      style={{ background: '#05050f', borderRadius: 14, userSelect: 'none',
        display: 'block', touchAction: 'none' }}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchMove={onTouchMove}
      onTouchEnd={stopDrag}
    >
      <CoordGrid />

      {/* Faint extended line */}
      <line
        x1={toSX(lx1)} y1={toSY(ly1)} x2={toSX(lx2)} y2={toSY(ly2)}
        stroke={colors.primary} strokeWidth={1.5} opacity={0.22}
      />

      {/* Rise / run triangle */}
      {showTri && (
        <g>
          {/* Horizontal leg — run (amber) */}
          <line
            x1={toSX(p1.x)} y1={toSY(p1.y)} x2={cxS} y2={cyS}
            stroke={colors.secondary} strokeWidth={2} strokeDasharray="6 3"
          />
          {/* Vertical leg — rise (emerald) */}
          <line
            x1={cxS} y1={cyS} x2={toSX(p2.x)} y2={toSY(p2.y)}
            stroke={colors.accent} strokeWidth={2} strokeDasharray="6 3"
          />
          {/* Right-angle marker */}
          <path
            d={`M ${cxS + msx} ${cyS} L ${cxS + msx} ${cyS + msy} L ${cxS} ${cyS + msy}`}
            stroke="#4b5563" strokeWidth={1.3} fill="none"
          />
          {showLabels && (
            <>
              <text
                x={(toSX(p1.x) + cxS) / 2}
                y={cyS + (dy > 0 ? 19 : -11)}
                fill={colors.secondary} fontSize={11} textAnchor="middle" fontWeight="700"
              >
                run (Δx) = {dx.toFixed(1)}
              </text>
              <text
                x={cxS + (dx > 0 ? 13 : -13)}
                y={(cyS + toSY(p2.y)) / 2 + 4}
                fill={colors.accent} fontSize={11} fontWeight="700"
                textAnchor={dx > 0 ? 'start' : 'end'}
              >
                rise (Δy) = {dy.toFixed(1)}
              </text>
            </>
          )}
        </g>
      )}

      {/* Main line segment */}
      <line
        x1={toSX(p1.x)} y1={toSY(p1.y)} x2={toSX(p2.x)} y2={toSY(p2.y)}
        stroke={colors.primary} strokeWidth={3.5} strokeLinecap="round"
      />

      {/* P1 draggable dot */}
      <g style={{ cursor: 'grab' }}
        onMouseDown={(e) => { e.preventDefault(); dragging.current = 'p1'; }}
        onTouchStart={(e) => { e.preventDefault(); dragging.current = 'p1'; }}
      >
        <circle cx={toSX(p1.x)} cy={toSY(p1.y)} r={10}
          fill={colors.primary} stroke="#e2e8f0" strokeWidth={2} />
        <text x={toSX(p1.x)} y={toSY(p1.y) + 1}
          fill="white" fontSize={10} fontWeight="800"
          textAnchor="middle" dominantBaseline="middle"
          style={{ pointerEvents: 'none' }}>1</text>
      </g>
      {showLabels && (
        <text x={p1LX} y={toSY(p1.y) - 15}
          fill={colors.primary} fontSize={11} fontWeight="600"
          textAnchor={p1Anchor}>
          P₁({p1.x.toFixed(1)},{p1.y.toFixed(1)})
        </text>
      )}

      {/* P2 draggable dot */}
      <g style={{ cursor: 'grab' }}
        onMouseDown={(e) => { e.preventDefault(); dragging.current = 'p2'; }}
        onTouchStart={(e) => { e.preventDefault(); dragging.current = 'p2'; }}
      >
        <circle cx={toSX(p2.x)} cy={toSY(p2.y)} r={10}
          fill={colors.secondary} stroke="#e2e8f0" strokeWidth={2} />
        <text x={toSX(p2.x)} y={toSY(p2.y) + 1}
          fill="white" fontSize={10} fontWeight="800"
          textAnchor="middle" dominantBaseline="middle"
          style={{ pointerEvents: 'none' }}>2</text>
      </g>
      {showLabels && (
        <text x={p2LX} y={toSY(p2.y) - 15}
          fill={colors.secondary} fontSize={11} fontWeight="600"
          textAnchor={p2Anchor}>
          P₂({p2.x.toFixed(1)},{p2.y.toFixed(1)})
        </text>
      )}
    </svg>
  );
}

// ── Compute slope info from two points ────────────────────────────────────────
function slopeInfo(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const isVert = Math.abs(dx) < 0.08;
  const isFlat = !isVert && Math.abs(dy) < 0.05;
  const m = isVert ? null : dy / dx;
  let word, col;
  if (isVert)       { word = 'Undefined'; col = colors.phase3; }
  else if (isFlat)  { word = 'Zero';      col = colors.secondary; }
  else if (m > 0)   { word = 'Positive';  col = colors.accent; }
  else              { word = 'Negative';  col = colors.danger; }
  const disp = isVert ? 'undefined' : isFlat ? '0' : m.toFixed(2);
  return { dx, dy, m, isVert, isFlat, disp, word, col };
}

// ── Challenge row (collapsible hint) ─────────────────────────────────────────
function ChallengeRow({ text, hint }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '8px 12px',
          color: colors.text, fontSize: 12, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span>🎯 {text}</span>
        <span style={{ color: colors.muted, fontSize: 10 }}>{open ? '▲' : '▼ hint'}</span>
      </button>
      {open && (
        <div style={{
          marginTop: 4, padding: '7px 12px', fontSize: 11,
          color: colors.accent, background: `${colors.accent}12`,
          borderRadius: 6, borderLeft: `2px solid ${colors.accent}`,
        }}>
          {hint}
        </div>
      )}
    </div>
  );
}

// ── Mini slope card (Types tab) ───────────────────────────────────────────────
function SlopeTypeCard({ s }) {
  const mW = 120, mH = 90;
  const mXL = -5, mXR = 5, mYB = -4, mYT = 4;
  const mSX = x => ((x - mXL) / (mXR - mXL)) * mW;
  const mSY = y => mH - ((y - mYB) / (mYT - mYB)) * mH;

  const dx = s.p2.x - s.p1.x;
  const dy = s.p2.y - s.p1.y;
  const isVert = Math.abs(dx) < 0.05;
  let lx1, ly1, lx2, ly2;
  if (isVert) {
    lx1 = s.p1.x; ly1 = mYB; lx2 = s.p1.x; ly2 = mYT;
  } else {
    const m = dy / dx;
    lx1 = mXL; ly1 = s.p1.y + m * (mXL - s.p1.x);
    lx2 = mXR; ly2 = s.p1.y + m * (mXR - s.p1.x);
  }

  return (
    <div style={{
      background: `${s.color}0c`,
      border: `1px solid ${s.color}30`,
      borderRadius: 14, padding: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 24 }}>{s.icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.title}</div>
        </div>
      </div>

      {/* Mini graph */}
      <svg width={mW} height={mH}
        style={{ background: '#060610', borderRadius: 8, display: 'block', margin: '0 auto 14px' }}>
        <line x1={0} y1={mSY(0)} x2={mW} y2={mSY(0)} stroke="#1e293b" strokeWidth={1} />
        <line x1={mSX(0)} y1={0} x2={mSX(0)} y2={mH} stroke="#1e293b" strokeWidth={1} />
        <line
          x1={mSX(lx1)} y1={mSY(ly1)} x2={mSX(lx2)} y2={mSY(ly2)}
          stroke={s.color} strokeWidth={2.5} strokeLinecap="round"
        />
      </svg>

      <p style={{ margin: '0 0 8px', fontSize: 13, color: colors.text, lineHeight: 1.6 }}>
        {s.body}
      </p>
      <div style={{
        fontSize: 12, color: colors.muted, fontStyle: 'italic',
        borderLeft: `2px solid ${s.color}50`, paddingLeft: 10, lineHeight: 1.6,
      }}>
        {s.note}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SlopeOfLine() {
  const [tab, setTab] = useState('watch');
  const [scenIdx, setScenIdx] = useState(0);

  // Watch tab has its own points (reset when scenario changes)
  const [wP1, setWP1] = useState({ ...SCENARIOS[0].p1 });
  const [wP2, setWP2] = useState({ ...SCENARIOS[0].p2 });

  // Try It tab has independent points
  const [tP1, setTP1] = useState({ x: -2, y: -1 });
  const [tP2, setTP2] = useState({ x: 3, y: 3 });

  const pickScenario = (i) => {
    setScenIdx(i);
    setWP1({ ...SCENARIOS[i].p1 });
    setWP2({ ...SCENARIOS[i].p2 });
  };

  const wInfo = slopeInfo(wP1, wP2);
  const tInfo = slopeInfo(tP1, tP2);
  const sc = SCENARIOS[scenIdx];

  // KaTeX for Watch tab substituted formula
  const watchSubFormula = wInfo.isVert
    ? `m = \\dfrac{\\Delta y}{0} = \\text{undefined}`
    : `m = \\dfrac{${wInfo.dy.toFixed(1)}}{${wInfo.dx.toFixed(1)}} = ${wInfo.disp}`;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8,
        }}>
          Topic 2 · Phase 1 — Foundations
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Slope of a Line
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          How steep is a line? Drag the points and watch slope = rise ÷ run update live.
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4,
        borderRadius: 10, width: 'fit-content',
      }}>
        {[
          { key: 'watch', label: '▶ Watch' },
          { key: 'try',   label: '🧪 Try It' },
          { key: 'types', label: '📊 Slope Types' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 18px', borderRadius: 7, border: 'none',
            background: tab === key ? colors.phase1 : 'transparent',
            color: tab === key ? '#0f0e17' : colors.muted,
            fontWeight: tab === key ? 700 : 400,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════ WATCH TAB ════════════════ */}
      {tab === 'watch' && (
        <motion.div key="watch"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>

          {/* Scenario buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {SCENARIOS.map((s, i) => (
              <button key={s.id} onClick={() => pickScenario(i)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8,
                border: `1px solid ${scenIdx === i ? s.color : 'rgba(255,255,255,0.1)'}`,
                background: scenIdx === i ? `${s.color}1a` : 'transparent',
                color: scenIdx === i ? s.color : colors.muted,
                fontSize: 13, fontWeight: scenIdx === i ? 700 : 400,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          {/* Graph + info panel */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* SVG graph */}
            <div style={{ flex: '1 1 300px', minWidth: 280 }}>
              <SlopeGraph p1={wP1} p2={wP2} onP1Change={setWP1} onP2Change={setWP2} />
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: colors.muted }}>
                Drag the dots to explore · line extends automatically
              </div>
            </div>

            {/* Info panel */}
            <div style={{ flex: '1 1 250px', minWidth: 230 }}>

              {/* Live slope formula */}
              <div style={{
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid ${wInfo.col}35`,
                borderRadius: 14, padding: 20, marginBottom: 16,
              }}>
                <div style={{
                  fontSize: 11, color: wInfo.col, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12,
                }}>
                  Slope Formula
                </div>
                {/* General formula */}
                <div style={{ marginBottom: 10 }}>
                  <BlockMath math={'m = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{y_2 - y_1}{x_2 - x_1}'} />
                </div>
                {/* Substituted with live values */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)', borderRadius: 10,
                  padding: '10px 14px', marginBottom: 14, textAlign: 'center',
                }}>
                  <InlineMath math={watchSubFormula} />
                </div>
                {/* Big slope number */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: wInfo.col,
                    fontFamily: "'JetBrains Mono', monospace" }}>
                    m = {wInfo.disp}
                  </span>
                  <div style={{ fontSize: 12, color: wInfo.col, marginTop: 4, fontWeight: 600 }}>
                    {wInfo.word} slope
                  </div>
                </div>
              </div>

              {/* Explanation card — animates between scenarios */}
              <AnimatePresence mode="wait">
                <motion.div key={scenIdx}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    background: `${sc.color}0e`,
                    border: `1px solid ${sc.color}28`,
                    borderRadius: 14, padding: 18,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: sc.color, marginBottom: 8 }}>
                    {sc.icon} {sc.title}
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 13, color: colors.text, lineHeight: 1.7 }}>
                    {sc.body}
                  </p>
                  <div style={{
                    fontSize: 12, color: colors.muted, fontStyle: 'italic',
                    borderLeft: `2px solid ${sc.color}50`, paddingLeft: 10, lineHeight: 1.6,
                  }}>
                    {sc.example}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Color legend */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.secondary }}>
                  <div style={{ width: 18, height: 2, background: colors.secondary, borderRadius: 1, flexShrink: 0 }} />
                  run (Δx)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.accent }}>
                  <div style={{ width: 18, height: 2, background: colors.accent, borderRadius: 1, flexShrink: 0 }} />
                  rise (Δy)
                </div>
              </div>
            </div>
          </div>

          {/* Key insight box */}
          <div style={{
            marginTop: 24, padding: '16px 20px',
            background: `${colors.primary}10`,
            border: `1px solid ${colors.primary}28`,
            borderRadius: 12,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, marginBottom: 4 }}>
                Why this matters for Differentiation
              </div>
              <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.75 }}>
                A straight line has the <strong>same slope everywhere</strong> — pick any two points and you get the same answer.
                But curves have a <em>different slope at every single point</em>.
                Differentiation is the tool that tells us the slope of a curve at any point — stay tuned!
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════════ TRY IT TAB ════════════════ */}
      {tab === 'try' && (
        <motion.div key="try"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Graph */}
            <div style={{ flex: '1 1 300px', minWidth: 280 }}>
              <SlopeGraph p1={tP1} p2={tP2} onP1Change={setTP1} onP2Change={setTP2} />
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: colors.muted }}>
                Drag either dot freely — slope updates in real time
              </div>
            </div>

            {/* Live data panel */}
            <div style={{ flex: '1 1 230px', minWidth: 210 }}>

              {/* Big slope badge */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: `2px solid ${tInfo.col}50`,
                borderRadius: 14, padding: 20,
                textAlign: 'center', marginBottom: 16,
              }}>
                <div style={{ fontSize: 10, color: colors.muted, textTransform: 'uppercase',
                  letterSpacing: 2, marginBottom: 8 }}>
                  Slope m =
                </div>
                <div style={{
                  fontSize: 44, fontWeight: 900, color: tInfo.col, lineHeight: 1,
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: 6,
                }}>
                  {tInfo.disp}
                </div>
                <div style={{ fontSize: 12, color: tInfo.col, fontWeight: 700 }}>
                  {tInfo.word}
                </div>
              </div>

              {/* Data table */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, overflow: 'hidden', marginBottom: 16,
              }}>
                {[
                  { label: 'P₁', val: `(${tP1.x.toFixed(1)}, ${tP1.y.toFixed(1)})`, col: colors.primary },
                  { label: 'P₂', val: `(${tP2.x.toFixed(1)}, ${tP2.y.toFixed(1)})`, col: colors.secondary },
                  { label: 'Δx  (run)',  val: tInfo.dx.toFixed(2), col: colors.secondary },
                  { label: 'Δy  (rise)', val: tInfo.dy.toFixed(2), col: colors.accent },
                  { label: 'Slope m',   val: tInfo.disp,            col: tInfo.col },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 16px',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  }}>
                    <span style={{ fontSize: 12, color: colors.muted }}>{row.label}</span>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: row.col,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Challenges */}
              <div style={{
                background: `${colors.phase1}0e`,
                border: `1px solid ${colors.phase1}25`,
                borderRadius: 12, padding: 16,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: colors.phase1,
                  textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10,
                }}>
                  Challenges
                </div>
                <ChallengeRow text="Make slope = 2"         hint="Try P₁ = (0, 0) and P₂ = (1, 2)" />
                <ChallengeRow text="Make slope = 0"         hint="Both points must have the same y-value" />
                <ChallengeRow text="Make slope = −3"        hint="Try P₁ = (0, 3) and P₂ = (1, 0)" />
                <ChallengeRow text="Make slope undefined"   hint="Both points must have the same x-value" />
                <ChallengeRow text="Make slope = ½"         hint="Rise 1, run 2 — try P₁ = (0, 0), P₂ = (2, 1)" />
              </div>
            </div>
          </div>

          {/* Formula reminder */}
          <div style={{
            marginTop: 20,
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '16px 24px',
            textAlign: 'center',
          }}>
            <BlockMath math={
              `m = \\frac{\\text{rise}}{\\text{run}} = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}`
            } />
          </div>
        </motion.div>
      )}

      {/* ════════════════ SLOPE TYPES TAB ════════════════ */}
      {tab === 'types' && (
        <motion.div key="types"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>

          <p style={{ margin: '0 0 20px', fontSize: 14, color: colors.muted }}>
            Every straight line belongs to one of these four categories.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 16, marginBottom: 28,
          }}>
            {SCENARIOS.map(s => <SlopeTypeCard key={s.id} s={s} />)}
          </div>

          {/* Summary formula */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: 24,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: colors.phase1,
              textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16,
            }}>
              Summary
            </div>
            <div style={{ marginBottom: 20 }}>
              <BlockMath math={
                `\\text{slope} = m = \\frac{\\text{rise}}{\\text{run}} = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}`
              } />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: 10,
            }}>
              {[
                { expr: 'm > 0',           desc: 'Line rises left → right',   col: colors.accent },
                { expr: 'm < 0',           desc: 'Line falls left → right',   col: colors.danger },
                { expr: 'm = 0',           desc: 'Horizontal — perfectly flat', col: colors.secondary },
                { expr: '\\Delta x = 0',  desc: 'Vertical — slope undefined', col: colors.phase3 },
              ].map((row, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  background: `${row.col}0e`,
                  border: `1px solid ${row.col}28`,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: row.col, marginBottom: 4 }}>
                    <InlineMath math={row.expr} />
                  </div>
                  <div style={{ fontSize: 12, color: colors.muted }}>{row.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
