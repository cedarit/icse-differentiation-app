import React, { useState, useRef, useCallback } from 'react';
import { BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../styles/theme';

// ── SVG coordinate system (y = x²) ───────────────────────────────────────────
const SW = 460, SH = 360;
const XL = -3.5, XR = 3.5, YB = -0.5, YT = 10;

function toSX(x) { return ((x - XL) / (XR - XL)) * SW; }
function toSY(y) { return SH - ((y - YB) / (YT - YB)) * SH; }
function toMX(sx) { return XL + (sx / SW) * (XR - XL); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function fn(x) { return x * x; }
function fnSlope(x) { return 2 * x; }

// ── Coordinate grid ───────────────────────────────────────────────────────────
function Grid() {
  const items = [];
  for (let x = Math.ceil(XL); x <= XR; x++) {
    items.push(
      <line key={`vg${x}`} x1={toSX(x)} y1={0} x2={toSX(x)} y2={SH}
        stroke={x === 0 ? '#2d3748' : '#111827'} strokeWidth={x === 0 ? 1.5 : 0.6} />
    );
    if (x !== 0) items.push(
      <text key={`xt${x}`} x={toSX(x)} y={toSY(0) + 14}
        fill="#374151" fontSize={9} textAnchor="middle">{x}</text>
    );
  }
  for (let y = 0; y <= 9; y += 2) {
    items.push(
      <line key={`hg${y}`} x1={0} y1={toSY(y)} x2={SW} y2={toSY(y)}
        stroke={y === 0 ? '#2d3748' : '#111827'} strokeWidth={y === 0 ? 1.5 : 0.6} />
    );
    if (y !== 0) items.push(
      <text key={`yt${y}`} x={toSX(0) - 6} y={toSY(y) + 3}
        fill="#374151" fontSize={9} textAnchor="end">{y}</text>
    );
  }
  items.push(
    <text key="xl" x={SW - 6} y={toSY(0) - 6} fill="#4b5563" fontSize={11} textAnchor="end">x</text>,
    <text key="yl" x={toSX(0) + 7} y={13} fill="#4b5563" fontSize={11}>y</text>
  );
  return <>{items}</>;
}

// ── Parabola path ─────────────────────────────────────────────────────────────
function ParabolaPath() {
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const x = XL + (i / 200) * (XR - XL);
    const y = fn(x);
    if (y >= YB && y <= YT) pts.push(`${pts.length === 0 ? 'M' : 'L'} ${toSX(x)} ${toSY(y)}`);
  }
  return <path d={pts.join(' ')} stroke={colors.primary} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
}

// ── Curve graph ───────────────────────────────────────────────────────────────
function CurveGraph({ pX, qX, showTangent, onDrag }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const py = fn(pX), qy = fn(qX);
  const slope = Math.abs(pX - qX) < 0.001
    ? fnSlope(pX)
    : (qy - py) / (qX - pX);

  const tangentExtend = 1.5;
  const tx1 = pX - tangentExtend, ty1 = py + slope * (-tangentExtend);
  const tx2 = pX + tangentExtend, ty2 = py + slope * (tangentExtend);

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current || !onDrag) return;
    const r = svgRef.current.getBoundingClientRect();
    const mx = clamp(toMX(((e.clientX - r.left) / r.width) * SW), XL + 0.1, XR - 0.1);
    onDrag(mx);
  }, [onDrag]);

  const handleTouchMove = useCallback((e) => {
    if (!dragging.current || !onDrag) return;
    e.preventDefault();
    const t = e.touches[0];
    const r = svgRef.current.getBoundingClientRect();
    const mx = clamp(toMX(((t.clientX - r.left) / r.width) * SW), XL + 0.1, XR - 0.1);
    onDrag(mx);
  }, [onDrag]);

  const secantVisible = Math.abs(qX - pX) > 0.05;

  return (
    <svg ref={svgRef} width="100%" viewBox={`0 0 ${SW} ${SH}`}
      style={{ background: '#05050f', borderRadius: 14, userSelect: 'none',
        display: 'block', touchAction: 'none' }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { dragging.current = false; }}
    >
      <Grid />
      <ParabolaPath />
      <text x={toSX(2.8)} y={toSY(fn(2.8)) - 8} fill={colors.primary}
        fontSize={12} fontWeight="600">y = x²</text>

      {secantVisible && (
        <line
          x1={toSX(pX - 0.8)} y1={toSY(py + slope * -0.8)}
          x2={toSX(qX + 0.8)} y2={toSY(qy + slope * 0.8)}
          stroke={colors.secondary} strokeWidth={2} strokeDasharray="6 3" opacity={0.85}
        />
      )}

      {showTangent && (
        <line
          x1={toSX(tx1)} y1={toSY(ty1)}
          x2={toSX(tx2)} y2={toSY(ty2)}
          stroke={colors.accent} strokeWidth={2.2}
          opacity={secantVisible ? 0.4 : 1}
        />
      )}

      <g style={{ cursor: onDrag ? 'grab' : 'default' }}
        onMouseDown={e => { e.preventDefault(); if (onDrag) dragging.current = true; }}
        onTouchStart={e => { e.preventDefault(); if (onDrag) dragging.current = true; }}
      >
        <circle cx={toSX(pX)} cy={toSY(py)} r={9}
          fill={colors.primary} stroke="#e2e8f0" strokeWidth={2} />
        <text x={toSX(pX)} y={toSY(py) + 1}
          fill="white" fontSize={9} fontWeight="800"
          textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none' }}>P</text>
      </g>
      <text x={toSX(pX) + 14} y={toSY(py) - 8}
        fill={colors.primary} fontSize={11} fontWeight="600">
        P({pX.toFixed(1)}, {py.toFixed(1)})
      </text>

      {secantVisible && (
        <g>
          <circle cx={toSX(qX)} cy={toSY(qy)} r={8}
            fill={colors.secondary} stroke="#e2e8f0" strokeWidth={2} />
          <text x={toSX(qX)} y={toSY(qy) + 1}
            fill="white" fontSize={9} fontWeight="800"
            textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none' }}>Q</text>
          <text x={toSX(qX) + 14} y={toSY(qy) - 8}
            fill={colors.secondary} fontSize={11} fontWeight="600">
            Q({qX.toFixed(2)}, {qy.toFixed(2)})
          </text>
        </g>
      )}

      {showTangent && !secantVisible && (
        <text x={toSX(pX + 1.0)} y={toSY(py + slope * 1.0) - 10}
          fill={colors.accent} fontSize={12} fontWeight="700">
          slope = {slope.toFixed(2)}
        </text>
      )}
    </svg>
  );
}

// ── Watch steps ───────────────────────────────────────────────────────────────
const WATCH_STEPS = [
  { label: 'The Curve', desc: 'Here is y = x². It is a parabola — unlike a straight line, its slope changes at every point.', qOffset: 2.5, showT: false },
  { label: 'Place Point P', desc: 'Fix a point P on the curve at x = 1.5. What is the slope of the curve right here?', qOffset: 2.5, showT: false },
  { label: 'Draw Secant PQ', desc: 'Place another point Q at x = 4. The line through P and Q is a secant — it cuts across the curve.', qOffset: 1.5, showT: false },
  { label: 'Bring Q closer', desc: 'Move Q closer to P (x = 2.2). The secant tilts, getting closer to the true slope at P.', qOffset: 0.7, showT: false },
  { label: 'Q very close', desc: 'Q is almost at P (x = 1.65). The secant nearly matches the tangent now.', qOffset: 0.15, showT: false },
  { label: 'Q → P: Tangent!', desc: 'As Q → P, the secant becomes the tangent line. Its slope is exactly 2 × 1.5 = 3.', qOffset: 0.001, showT: true },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function SlopeOfCurve() {
  const [tab, setTab] = useState('watch');
  const [step, setStep] = useState(0);
  const [pX, setPX] = useState(1.5);

  const sc = WATCH_STEPS[step];
  const watchPX = 1.5;
  const watchQX = watchPX + sc.qOffset;
  const trySlope = fnSlope(pX).toFixed(2);
  const slopeSign = parseFloat(trySlope) > 0 ? 'Positive' : parseFloat(trySlope) < 0 ? 'Negative' : 'Zero';
  const slopeCol = parseFloat(trySlope) > 0 ? colors.accent : parseFloat(trySlope) < 0 ? colors.danger : colors.secondary;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 3 · Phase 1 — Foundations · XI §19.2–19.3
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Slope of a Curve: The Problem
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          A line has <em>one</em> slope. A curve has a <em>different</em> slope at every point — that's why we need Differentiation.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ key: 'watch', label: '▶ Watch' }, { key: 'try', label: '🧪 Try It' }].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '8px 18px', borderRadius: 7, border: 'none',
            background: tab === key ? colors.phase1 : 'transparent',
            color: tab === key ? '#0f0e17' : colors.muted,
            fontWeight: tab === key ? 700 : 400,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>{label}</button>
        ))}
      </div>

      {/* ════════════ WATCH TAB ════════════ */}
      {tab === 'watch' && (
        <motion.div key="watch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            <div style={{ flex: '1 1 280px', minWidth: 260 }}>
              <CurveGraph pX={watchPX} qX={watchQX} showTangent={sc.showT} />
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: colors.muted }}>
                {step < 2 ? 'Parabola y = x²' : `Q at x = ${watchQX.toFixed(3)} — secant slope ≈ ${((fn(watchQX) - fn(watchPX)) / (watchQX - watchPX)).toFixed(3)}`}
              </div>
            </div>

            <div style={{ flex: '1 1 260px', minWidth: 240 }}>
              {/* Step bubbles */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {WATCH_STEPS.map((_, i) => (
                  <button key={i} onClick={() => setStep(i)} style={{
                    width: 28, height: 28, borderRadius: '50%', border: 'none',
                    background: step === i ? colors.phase1 : i < step ? `${colors.phase1}50` : 'rgba(255,255,255,0.08)',
                    color: step === i ? '#0f0e17' : step > i ? colors.phase1 : colors.muted,
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>{i + 1}</button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>

                  <div style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: `1px solid ${colors.phase1}30`,
                    borderRadius: 14, padding: 20, marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.phase1,
                      textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
                      Step {step + 1} — {sc.label}
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: colors.text, lineHeight: 1.75 }}>
                      {sc.desc}
                    </p>
                  </div>

                  {step >= 2 && (
                    <div style={{
                      background: `${colors.secondary}0e`,
                      border: `1px solid ${colors.secondary}28`,
                      borderRadius: 12, padding: 14, marginBottom: 14,
                    }}>
                      <div style={{ fontSize: 11, color: colors.secondary, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                        Secant Slope
                      </div>
                      <BlockMath math={`m_{PQ} = \\frac{${fn(watchQX).toFixed(3)} - ${fn(watchPX).toFixed(1)}}{${watchQX.toFixed(3)} - ${watchPX.toFixed(1)}} \\approx ${((fn(watchQX) - fn(watchPX)) / (watchQX - watchPX)).toFixed(3)}`} />
                    </div>
                  )}

                  {step === 5 && (
                    <div style={{
                      background: `${colors.accent}0f`,
                      border: `1px solid ${colors.accent}30`,
                      borderRadius: 12, padding: 14,
                    }}>
                      <div style={{ fontSize: 11, color: colors.accent, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                        Tangent at P(1.5, 2.25)
                      </div>
                      <BlockMath math={"\\frac{dy}{dx}\\bigg|_{x=1.5} = 2 \\times 1.5 = 3"} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} style={{
                    flex: 1, padding: '9px 0', borderRadius: 9,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent', color: colors.muted, fontSize: 13, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}>← Back</button>
                )}
                {step < WATCH_STEPS.length - 1 ? (
                  <button onClick={() => setStep(s => s + 1)} style={{
                    flex: 1, padding: '9px 0', borderRadius: 9, border: 'none',
                    background: colors.phase1, color: '#0f0e17', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>Next Step →</button>
                ) : (
                  <button onClick={() => setTab('try')} style={{
                    flex: 1, padding: '9px 0', borderRadius: 9, border: 'none',
                    background: colors.accent, color: '#0f0e17', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>Try It →</button>
                )}
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 24, padding: '16px 20px',
            background: `${colors.primary}08`, border: `1px solid ${colors.primary}20`,
            borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.75 }}>
              <strong style={{ color: colors.primary }}>The slope of a curve changes at every point.</strong>{' '}
              Differentiation gives us a formula dy/dx that computes the slope anywhere on the curve.
              For y = x², the answer is dy/dx = 2x — a different slope for every x.
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ TRY IT TAB ════════════ */}
      {tab === 'try' && (
        <motion.div key="try" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            <div style={{ flex: '1 1 280px', minWidth: 260 }}>
              <CurveGraph pX={pX} qX={pX} showTangent={true} onDrag={setPX} />
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: colors.muted }}>
                Drag point P along y = x² — tangent and slope update live
              </div>
            </div>

            <div style={{ flex: '1 1 240px', minWidth: 220 }}>
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: `2px solid ${slopeCol}50`,
                borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16,
              }}>
                <div style={{ fontSize: 10, color: colors.muted,
                  textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                  Slope at P
                </div>
                <div style={{ fontSize: 44, fontWeight: 900, color: slopeCol, lineHeight: 1,
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                  {trySlope}
                </div>
                <div style={{ fontSize: 12, color: slopeCol, fontWeight: 700 }}>{slopeSign}</div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, overflow: 'hidden', marginBottom: 16,
              }}>
                {[
                  { label: 'P =', val: `(${pX.toFixed(2)}, ${fn(pX).toFixed(2)})`, col: colors.primary },
                  { label: 'dy/dx = 2x', val: `2 × ${pX.toFixed(2)}`, col: colors.muted },
                  { label: 'Slope', val: trySlope, col: slopeCol },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}>
                    <span style={{ fontSize: 12, color: colors.muted }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: row.col,
                      fontFamily: "'JetBrains Mono', monospace" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              <div style={{
                background: `${slopeCol}0e`, border: `1px solid ${slopeCol}28`,
                borderRadius: 12, padding: 12, marginBottom: 14, fontSize: 12,
                color: colors.muted, lineHeight: 1.65,
              }}>
                {parseFloat(trySlope) < 0
                  ? 'Left of origin: curve falls, slope is negative.'
                  : parseFloat(trySlope) > 0
                  ? 'Right of origin: curve rises, slope is positive.'
                  : 'At the origin: bottom of parabola, slope = 0.'}
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '14px 18px',
              }}>
                <BlockMath math={"y = x^2 \\implies \\frac{dy}{dx} = 2x"} />
              </div>
            </div>
          </div>

          {/* Quick-jump points */}
          <div style={{
            marginTop: 20, padding: '14px 18px',
            background: `${colors.phase1}0a`, border: `1px solid ${colors.phase1}25`,
            borderRadius: 12,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10,
          }}>
            {[
              { x: -2, slope: '-4', col: colors.danger },
              { x: 0, slope: '0', col: colors.secondary },
              { x: 1, slope: '2', col: colors.accent },
              { x: 2, slope: '4', col: colors.accent },
            ].map(pt => (
              <div key={pt.x} onClick={() => setPX(pt.x)} style={{
                padding: '10px 14px', textAlign: 'center', cursor: 'pointer',
                background: 'rgba(0,0,0,0.2)', borderRadius: 10,
                border: `1px solid ${pt.col}30`,
              }}>
                <div style={{ fontSize: 12, color: colors.muted }}>x = {pt.x}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: pt.col,
                  fontFamily: "'JetBrains Mono', monospace" }}>slope = {pt.slope}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 6 }}>
            Click any box to jump P to that x-value
          </div>
        </motion.div>
      )}
    </div>
  );
}
