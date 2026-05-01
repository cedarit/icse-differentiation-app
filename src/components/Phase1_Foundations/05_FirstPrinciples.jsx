import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../styles/theme';
import StepReveal from '../shared/StepReveal';
import TryItPanel from '../shared/TryItPanel';

// ── Function definitions for the playground ───────────────────────────────────
const FUNCTIONS = [
  {
    id: 'x2', label: 'y = x²',
    fn: x => x * x,
    fnH: (x, h) => (x + h) * (x + h),
    deltaY: (x, h) => `(${x.toFixed(1)}+${h.toFixed(3)})² - ${x.toFixed(1)}² = ${(2 * x * h + h * h).toFixed(5)}`,
    ratio: (x, h) => `2×${x.toFixed(1)} + ${h.toFixed(3)} = ${(2 * x + h).toFixed(4)}`,
    derivative: x => `2×${x.toFixed(1)} = ${(2 * x).toFixed(2)}`,
    derivLatex: '\\frac{dy}{dx} = 2x',
    result: x => 2 * x,
  },
  {
    id: 'x3', label: 'y = x³',
    fn: x => x * x * x,
    fnH: (x, h) => (x + h) ** 3,
    deltaY: (x, h) => `3x²h + 3xh² + h³ ≈ ${(3 * x * x * h + 3 * x * h * h + h ** 3).toFixed(5)}`,
    ratio: (x, h) => `3x² + 3xh + h² ≈ ${(3 * x * x + 3 * x * h + h * h).toFixed(4)}`,
    derivative: x => `3×${x.toFixed(1)}² = ${(3 * x * x).toFixed(2)}`,
    derivLatex: '\\frac{dy}{dx} = 3x^2',
    result: x => 3 * x * x,
  },
  {
    id: 'sqrtx', label: 'y = √x',
    fn: x => Math.sqrt(Math.max(0.001, x)),
    fnH: (x, h) => Math.sqrt(Math.max(0.001, x + h)),
    deltaY: (x, h) => `√(${x.toFixed(1)}+${h.toFixed(3)}) - √${x.toFixed(1)} = ${(Math.sqrt(x + h) - Math.sqrt(x)).toFixed(5)}`,
    ratio: (x, h) => `1/(√(x+h)+√x) ≈ ${(1 / (Math.sqrt(x + h) + Math.sqrt(x))).toFixed(4)}`,
    derivative: x => `1/(2√${x.toFixed(1)}) = ${(1 / (2 * Math.sqrt(x))).toFixed(3)}`,
    derivLatex: '\\frac{dy}{dx} = \\frac{1}{2\\sqrt{x}}',
    result: x => 1 / (2 * Math.sqrt(x)),
  },
  {
    id: '1x3', label: 'y = 1/x³',
    fn: x => 1 / (x * x * x),
    fnH: (x, h) => 1 / ((x + h) ** 3),
    deltaY: (x, h) => `1/(x+h)³ - 1/x³ ≈ ${(1 / (x + h) ** 3 - 1 / x ** 3).toFixed(5)}`,
    ratio: (x, h) => `≈ ${((1 / (x + h) ** 3 - 1 / x ** 3) / h).toFixed(5)}`,
    derivative: x => `-3/x⁴ = ${(-3 / x ** 4).toFixed(3)}`,
    derivLatex: '\\frac{dy}{dx} = -\\frac{3}{x^4}',
    result: x => -3 / x ** 4,
  },
];

// ── Secant → tangent SVG graph ────────────────────────────────────────────────
const GW = 320, GH = 220;

function SecantGraph({ fnObj, x, h }) {
  const xRange = fnObj.id === '1x3' ? [0.5, 3] : fnObj.id === 'sqrtx' ? [0, 4] : [-2.5, 2.5];
  const yRangeRaw = Array.from({ length: 50 }, (_, i) => {
    const vx = xRange[0] + (i / 49) * (xRange[1] - xRange[0]);
    return fnObj.fn(vx);
  }).filter(isFinite);
  const yMin = Math.max(Math.min(...yRangeRaw) - 1, -10);
  const yMax = Math.min(Math.max(...yRangeRaw) + 1, 15);

  function sx(v) { return ((v - xRange[0]) / (xRange[1] - xRange[0])) * GW; }
  function sy(v) { return GH - ((v - yMin) / (yMax - yMin)) * GH; }

  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const vx = xRange[0] + (i / 200) * (xRange[1] - xRange[0]);
    const vy = fnObj.fn(vx);
    if (!isFinite(vy) || vy < yMin || vy > yMax) { if (pts.length) pts.push('M'); continue; }
    pts.push(`${pts.length === 0 || pts[pts.length - 1] === 'M' ? 'M' : 'L'} ${sx(vx)} ${sy(vy)}`);
  }

  const py = fnObj.fn(x);
  const qx = x + h;
  const qy = fnObj.fnH(x, h);
  const slope = Math.abs(h) < 0.0001 ? fnObj.result(x) : (qy - py) / h;

  const tangExt = (xRange[1] - xRange[0]) * 0.25;
  const tx1 = x - tangExt, ty1 = py + slope * (-tangExt);
  const tx2 = x + tangExt, ty2 = py + slope * tangExt;

  const showSecant = Math.abs(h) > 0.02;

  return (
    <svg width="100%" viewBox={`0 0 ${GW} ${GH}`}
      style={{ background: '#05050f', borderRadius: 12, display: 'block' }}>
      {/* Axes */}
      {isFinite(sy(0)) && <line x1={0} y1={sy(0)} x2={GW} y2={sy(0)} stroke="#2d3748" strokeWidth={1.2} />}
      {isFinite(sx(0)) && sx(0) >= 0 && sx(0) <= GW &&
        <line x1={sx(0)} y1={0} x2={sx(0)} y2={GH} stroke="#2d3748" strokeWidth={1.2} />}

      {/* Curve */}
      <path d={pts.filter(p => p !== 'M').join(' ')} stroke={colors.primary}
        strokeWidth={2.5} fill="none" strokeLinecap="round" />

      {/* Secant */}
      {showSecant && isFinite(py) && isFinite(qy) && (
        <line
          x1={sx(x - tangExt)} y1={sy(py + slope * (-tangExt))}
          x2={sx(qx + tangExt * 0.5)} y2={sy(qy + slope * tangExt * 0.5)}
          stroke={colors.secondary} strokeWidth={1.8} strokeDasharray="5 3" opacity={0.8}
        />
      )}

      {/* Tangent */}
      {isFinite(ty1) && isFinite(ty2) && (
        <line x1={sx(tx1)} y1={sy(ty1)} x2={sx(tx2)} y2={sy(ty2)}
          stroke={colors.accent} strokeWidth={2}
          opacity={showSecant ? 0.35 : 1}
        />
      )}

      {/* P dot */}
      {isFinite(py) && (
        <circle cx={sx(x)} cy={sy(py)} r={7}
          fill={colors.primary} stroke="white" strokeWidth={2} />
      )}

      {/* Q dot */}
      {showSecant && isFinite(qy) && (
        <circle cx={sx(qx)} cy={sy(qy)} r={6}
          fill={colors.secondary} stroke="white" strokeWidth={1.5} />
      )}

      {/* Labels */}
      {isFinite(py) && <text x={sx(x) + 9} y={sy(py) - 7} fill={colors.primary} fontSize={10} fontWeight="600">P</text>}
      {showSecant && isFinite(qy) && <text x={sx(qx) + 9} y={sy(qy) - 7} fill={colors.secondary} fontSize={10}>Q</text>}
    </svg>
  );
}

// ── Method steps for Watch tab ─────────────────────────────────────────────────
const METHOD_STEPS = [
  {
    label: 'Step 1 — Define',
    content: <span>Let y = f(x). This is the starting function.</span>,
  },
  {
    label: 'Step 2 — Increment',
    content: <BlockMath math={"y + \\delta y = f(x + \\delta x)"} />,
  },
  {
    label: 'Step 3 — Find δy',
    content: <BlockMath math={"\\delta y = f(x + \\delta x) - f(x)"} />,
  },
  {
    label: 'Step 4 — Divide',
    content: <BlockMath math={"\\frac{\\delta y}{\\delta x} = \\frac{f(x + \\delta x) - f(x)}{\\delta x}"} />,
  },
  {
    label: 'Step 5 — Take limit',
    content: <BlockMath math={"\\frac{dy}{dx} = \\lim_{\\delta x \\to 0} \\frac{f(x + \\delta x) - f(x)}{\\delta x}"} />,
    highlight: true,
  },
];

// ── Watch worked example: y = x² ──────────────────────────────────────────────
const WATCH_STEPS_X2 = [
  {
    label: 'Let y = f(x) = x²',
    content: <span>Start with the function: y = x²</span>,
  },
  {
    label: 'Write y + δy',
    content: <BlockMath math={"y + \\delta y = (x + h)^2 = x^2 + 2xh + h^2"} />,
  },
  {
    label: 'Subtract y to get δy',
    content: <BlockMath math={"\\delta y = 2xh + h^2"} />,
  },
  {
    label: 'Divide by δx = h',
    content: <BlockMath math={"\\frac{\\delta y}{h} = \\frac{2xh + h^2}{h} = 2x + h"} />,
  },
  {
    label: 'Let h → 0',
    content: <BlockMath math={"\\frac{dy}{dx} = \\lim_{h \\to 0}(2x + h) = 2x"} />,
    highlight: true,
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function FirstPrinciples() {
  const [tab, setTab] = useState('watch');
  const [fnIdx, setFnIdx] = useState(0);
  const [x, setX] = useState(1.5);
  const [h, setH] = useState(0.5);
  const [watchMode, setWatchMode] = useState('method'); // 'method' | 'example' | 'velocity'

  const fnObj = FUNCTIONS[fnIdx];
  const deriv = fnObj.result(x);
  const secantSlope = Math.abs(h) < 0.0001 ? deriv : (fnObj.fnH(x, h) - fnObj.fn(x)) / h;
  const xValid = fnObj.id === '1x3' ? Math.max(x, 0.5) : fnObj.id === 'sqrtx' ? Math.max(x, 0.1) : x;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 5 · Phase 1 — Foundations · XI §19.4, Ex 19(A)
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          First Principles (Ab Initio)
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          The original method — no rules, just logic. We find dy/dx directly from the definition of a limit.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[
          { key: 'watch', label: '▶ Watch' },
          { key: 'try', label: '🧪 Try It' },
          { key: 'exercises', label: '📝 Exercises' },
        ].map(({ key, label }) => (
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

          {/* Mode switcher */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { key: 'method', label: '📐 The Method' },
              { key: 'example', label: '✏️ Worked: y = x²' },
              { key: 'velocity', label: '🚀 Velocity Meaning' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setWatchMode(key)} style={{
                padding: '8px 16px', borderRadius: 9,
                border: `1px solid ${watchMode === key ? colors.phase1 : 'rgba(255,255,255,0.1)'}`,
                background: watchMode === key ? `${colors.phase1}18` : 'transparent',
                color: watchMode === key ? colors.phase1 : colors.muted,
                fontSize: 13, fontWeight: watchMode === key ? 700 : 400,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>{label}</button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {watchMode === 'method' && (
              <motion.div key="method"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ flex: '1 1 280px' }}>
                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: `1px solid ${colors.phase1}30`,
                      borderRadius: 14, padding: 20, marginBottom: 16,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.phase1,
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
                        The 5-Step Method (XI §19.4)
                      </div>
                      <StepReveal steps={METHOD_STEPS} autoPlay={false} />
                    </div>
                  </div>
                  <div style={{ flex: '1 1 260px' }}>
                    <div style={{
                      background: `${colors.primary}0a`,
                      border: `1px solid ${colors.primary}25`,
                      borderRadius: 14, padding: 20,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary,
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                        The Core Formula
                      </div>
                      <BlockMath math={"\\frac{dy}{dx} = f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}"} />
                      <div style={{ fontSize: 13, color: colors.muted, lineHeight: 1.75, marginTop: 12 }}>
                        This is the definition of the derivative. Every differentiation rule you'll ever learn
                        was proved using exactly this formula.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {watchMode === 'example' && (
              <motion.div key="example"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: `1px solid ${colors.phase1}30`,
                      borderRadius: 14, padding: 20,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: colors.phase1, marginBottom: 14 }}>
                        Differentiate y = x² from first principles
                      </div>
                      <StepReveal steps={WATCH_STEPS_X2} autoPlay={false} />
                    </div>
                  </div>
                  <div style={{ flex: '1 1 240px' }}>
                    <div style={{
                      background: `${colors.accent}0e`,
                      border: `1px solid ${colors.accent}28`,
                      borderRadius: 14, padding: 20, marginBottom: 16,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.accent,
                        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                        Result
                      </div>
                      <BlockMath math={"y = x^2 \\implies \\frac{dy}{dx} = 2x"} />
                      <div style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
                        The slope at any point x on y = x² is 2x.
                      </div>
                    </div>
                    <div style={{
                      background: `${colors.secondary}0e`,
                      border: `1px solid ${colors.secondary}25`,
                      borderRadius: 12, padding: 16,
                    }}>
                      <div style={{ fontSize: 12, color: colors.secondary, fontWeight: 700, marginBottom: 8 }}>
                        Textbook Worked Example (XI §19.4)
                      </div>
                      <div style={{ fontSize: 12, color: colors.muted }}>
                        f(x) = (3+x)/(3−x), find f'(2)
                      </div>
                      <BlockMath math={"f'(2) = \\lim_{h\\to 0}\\frac{f(2+h)-f(2)}{h} = \\lim_{h\\to 0}\\frac{\\frac{5+h}{1-h}-5}{h} = 6"} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {watchMode === 'velocity' && (
              <motion.div key="velocity"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: `1px solid ${colors.secondary}30`,
                      borderRadius: 14, padding: 20,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: colors.secondary, marginBottom: 14 }}>
                        XI §19.3 — Velocity Interpretation
                      </div>
                      {[
                        { label: 'Displacement at time t', content: <InlineMath math="s = f(t)" /> },
                        { label: 'Displacement at t + h', content: <InlineMath math="s + \\delta s = f(t+h)" /> },
                        { label: 'Change in displacement', content: <InlineMath math="\\delta s = f(t+h) - f(t)" /> },
                        { label: 'Average velocity', content: <BlockMath math={"\\bar{v} = \\frac{\\delta s}{h} = \\frac{f(t+h)-f(t)}{h}"} /> },
                        { label: 'Instantaneous velocity', content: <BlockMath math={"v = \\lim_{h\\to 0}\\frac{f(t+h)-f(t)}{h} = f'(t) = \\frac{ds}{dt}"} />, highlight: true },
                      ].map((st, i) => (
                        <div key={i} style={{
                          padding: '10px 14px', marginBottom: 8,
                          background: st.highlight ? `${colors.primary}12` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${st.highlight ? colors.primary : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: 8,
                        }}>
                          <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4,
                            textTransform: 'uppercase', letterSpacing: 1 }}>{st.label}</div>
                          <div style={{ color: colors.text }}>{st.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: '1 1 240px' }}>
                    <div style={{
                      background: `${colors.secondary}0e`,
                      border: `1px solid ${colors.secondary}28`,
                      borderRadius: 14, padding: 20,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: colors.secondary, marginBottom: 12 }}>
                        Real-World Meaning
                      </div>
                      <div style={{ fontSize: 14, color: colors.text, lineHeight: 1.8 }}>
                        The derivative <InlineMath math="\frac{dy}{dx}" /> measures the <strong>instantaneous rate of change</strong>.
                        <br /><br />
                        For displacement s = f(t), the derivative ds/dt = f'(t) gives the exact
                        velocity at that instant — not average speed over a time interval.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ════════════ TRY IT TAB ════════════ */}
      {tab === 'try' && (
        <motion.div key="try" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Function selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {FUNCTIONS.map((f, i) => (
              <button key={f.id} onClick={() => setFnIdx(i)} style={{
                padding: '8px 16px', borderRadius: 9,
                border: `1px solid ${fnIdx === i ? colors.primary : 'rgba(255,255,255,0.1)'}`,
                background: fnIdx === i ? `${colors.primary}18` : 'transparent',
                color: fnIdx === i ? colors.primary : colors.muted,
                fontSize: 13, fontWeight: fnIdx === i ? 700 : 400,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>{f.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Graph */}
            <div style={{ flex: '1 1 280px', minWidth: 260 }}>
              <SecantGraph fnObj={fnObj} x={xValid} h={h} />
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: colors.muted }}>
                {h > 0.02
                  ? `Secant PQ (h = ${h.toFixed(3)}) — slope ≈ ${secantSlope.toFixed(4)}`
                  : `h ≈ 0 — tangent line, slope = ${deriv.toFixed(4)}`}
              </div>
            </div>

            {/* Controls */}
            <div style={{ flex: '1 1 260px', minWidth: 240 }}>

              {/* h slider */}
              <div style={{
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid ${colors.secondary}30`,
                borderRadius: 14, padding: 20, marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.secondary, marginBottom: 16 }}>
                  Slide h → 0
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, color: colors.muted, marginBottom: 6 }}>
                    <span>h (increment)</span>
                    <span style={{ color: colors.secondary, fontWeight: 700 }}>{h.toFixed(3)}</span>
                  </div>
                  <input type="range" min={0.001} max={2} step={0.001}
                    value={h} onChange={e => setH(Number(e.target.value))}
                    style={{ width: '100%', accentColor: colors.secondary }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 10, color: colors.muted, marginTop: 4 }}>
                    <span>h → 0</span><span>h = 2</span>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, color: colors.muted, marginBottom: 6 }}>
                    <span>x-value of P</span>
                    <span style={{ color: colors.primary, fontWeight: 700 }}>{xValid.toFixed(2)}</span>
                  </div>
                  <input type="range"
                    min={fnObj.id === '1x3' ? 0.5 : fnObj.id === 'sqrtx' ? 0.1 : -2}
                    max={fnObj.id === 'sqrtx' ? 4 : 2.5}
                    step={0.01}
                    value={xValid} onChange={e => setX(Number(e.target.value))}
                    style={{ width: '100%', accentColor: colors.primary }} />
                </div>
              </div>

              {/* Live calculation */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, overflow: 'hidden', marginBottom: 16,
              }}>
                {[
                  { label: 'δy', val: (fnObj.fnH(xValid, h) - fnObj.fn(xValid)).toFixed(5), col: colors.secondary },
                  { label: 'δx (= h)', val: h.toFixed(3), col: colors.secondary },
                  { label: 'δy/δx (secant)', val: secantSlope.toFixed(5), col: colors.phase3 },
                  { label: `dy/dx = ${fnObj.derivLatex.replace(/\{|\}|\\frac|\\|\\text/g, '').trim()}`, val: deriv.toFixed(5), col: colors.accent },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '9px 14px',
                    borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: i === 3 ? `${colors.accent}08` : 'transparent',
                  }}>
                    <span style={{ fontSize: 12, color: colors.muted }}>{row.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: row.col,
                      fontFamily: "'JetBrains Mono', monospace" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* Derivative result */}
              <div style={{
                background: `${colors.accent}0e`,
                border: `1px solid ${colors.accent}30`,
                borderRadius: 12, padding: '14px 18px', textAlign: 'center',
              }}>
                <BlockMath math={fnObj.derivLatex} />
                <div style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                  at x = {xValid.toFixed(2)}: slope = {deriv.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ EXERCISES TAB ════════════ */}
      {tab === 'exercises' && (
        <motion.div key="exercises" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div style={{ marginBottom: 20, padding: '12px 16px',
            background: `${colors.phase1}0e`, border: `1px solid ${colors.phase1}25`,
            borderRadius: 10, fontSize: 13, color: colors.muted }}>
            From <strong style={{ color: colors.phase1 }}>Exercise 19(A), XI §19.4</strong> — use the 5-step first principles method for each.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <TryItPanel
              source="Exercise 19(A) — Q4"
              problem={<span>Find dy/dx from first principles for <InlineMath math="y = \frac{1}{\sqrt{2x}}" /></span>}
              hint="Write y = (2x)^(-1/2). Then y+δy = (2(x+h))^(-1/2). Rationalise by multiplying by conjugate."
              answer={<InlineMath math="\frac{dy}{dx} = -\frac{1}{2x^{3/2}}" />}
              steps={[
                { label: 'Setup', content: <BlockMath math={"\\delta y = \\frac{1}{\\sqrt{2(x+h)}} - \\frac{1}{\\sqrt{2x}}"} /> },
                { label: 'Combine', content: <BlockMath math={"= \\frac{\\sqrt{2x} - \\sqrt{2(x+h)}}{\\sqrt{2(x+h)} \\cdot \\sqrt{2x}}"} /> },
                { label: 'Rationalise numerator', content: <BlockMath math={"= \\frac{-2h}{\\sqrt{2(x+h)} \\cdot \\sqrt{2x} \\cdot (\\sqrt{2x} + \\sqrt{2(x+h)})}"} /> },
                { label: 'Divide by h, let h→0', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{-2}{\\sqrt{2x} \\cdot \\sqrt{2x} \\cdot 2\\sqrt{2x}} = \\frac{-1}{2x^{3/2}}"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(A) — Q7"
              problem={<span>Find dy/dx from first principles for <InlineMath math="y = \frac{1}{3x+2}" /></span>}
              hint="f(x+h) = 1/(3(x+h)+2). Find δy = f(x+h)−f(x). Combine fractions."
              answer={<InlineMath math="\frac{dy}{dx} = -\frac{1}{(3x+2)^2}" />}
              steps={[
                { label: 'δy', content: <BlockMath math={"\\delta y = \\frac{1}{3x+3h+2} - \\frac{1}{3x+2} = \\frac{-3h}{(3x+2)(3x+3h+2)}"} /> },
                { label: 'Divide by h', content: <BlockMath math={"\\frac{\\delta y}{h} = \\frac{-3}{(3x+2)(3x+3h+2)}"} /> },
                { label: 'Let h → 0', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{-3}{(3x+2)^2}"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(A) — Q8"
              problem={<span>Find dy/dx from first principles for <InlineMath math="y = \frac{1}{\sqrt{x+a}}" /></span>}
              hint="Rationalise δy by multiplying by (√(x+a+h) + √(x+a))."
              answer={<InlineMath math="\frac{dy}{dx} = \frac{1}{2\sqrt{x+a}}" />}
              steps={[
                { label: 'δy', content: <BlockMath math={"\\delta y = \\frac{1}{\\sqrt{x+a+h}} - \\frac{1}{\\sqrt{x+a}}"} /> },
                { label: 'Rationalise', content: <BlockMath math={"= \\frac{-(h)}{\\sqrt{x+a+h}\\cdot\\sqrt{x+a}\\cdot(\\sqrt{x+a+h}+\\sqrt{x+a})}"} /> },
                { label: 'Let h → 0', content: <BlockMath math={"\\frac{dy}{dx} = \\frac{-1}{\\sqrt{x+a}\\cdot 2\\sqrt{x+a}} = \\frac{-1}{2(x+a)} = \\frac{1}{2\\sqrt{x+a}}"} />, highlight: true },
              ]}
            />

            <TryItPanel
              source="Exercise 19(A) — Q12"
              problem={<span>Find dy/dx from first principles for <InlineMath math="y = x - \frac{1}{x}" /></span>}
              hint="f(x+h) = (x+h) − 1/(x+h). Find δy, then divide by h."
              answer={<InlineMath math="\frac{dy}{dx} = 1 + \frac{1}{x^2}" />}
              steps={[
                { label: 'f(x+h)', content: <BlockMath math={"f(x+h) = x+h - \\frac{1}{x+h}"} /> },
                { label: 'δy', content: <BlockMath math={"\\delta y = h + \\frac{1}{x} - \\frac{1}{x+h} = h + \\frac{h}{x(x+h)}"} /> },
                { label: 'Divide by h', content: <BlockMath math={"\\frac{\\delta y}{h} = 1 + \\frac{1}{x(x+h)}"} /> },
                { label: 'Limit', content: <BlockMath math={"\\frac{dy}{dx} = 1 + \\frac{1}{x^2}"} />, highlight: true },
              ]}
            />

          </div>
        </motion.div>
      )}
    </div>
  );
}
