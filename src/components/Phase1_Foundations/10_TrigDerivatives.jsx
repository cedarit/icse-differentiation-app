import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';
import FormulaCard from '../shared/FormulaCard';
import QuizCard from '../shared/QuizCard';

// ── SVG graph of sin x and cos x ─────────────────────────────────────────────
const GW = 460, GH = 200;
const TWO_PI = 2 * Math.PI;

function gSX(x) { return ((x + 0.2) / (TWO_PI + 0.4)) * GW; }
function gSY(y) { return GH / 2 - (y / 1.5) * (GH / 2 - 16); }

function TrigGraph({ sliderX }) {
  // sin x path
  const sinPts = [], cosPts = [];
  for (let i = 0; i <= 300; i++) {
    const x = -0.2 + (i / 300) * (TWO_PI + 0.4);
    sinPts.push(`${i === 0 ? 'M' : 'L'} ${gSX(x)} ${gSY(Math.sin(x))}`);
    cosPts.push(`${i === 0 ? 'M' : 'L'} ${gSX(x)} ${gSY(Math.cos(x))}`);
  }

  const sx = gSX(sliderX);
  const sinY = Math.sin(sliderX);
  const cosY = Math.cos(sliderX);

  // Tangent to sin at sliderX
  const tangExt = 0.4;
  const tx1 = sliderX - tangExt, ty1 = sinY + cosY * (-tangExt);
  const tx2 = sliderX + tangExt, ty2 = sinY + cosY * tangExt;

  return (
    <svg width="100%" viewBox={`0 0 ${GW} ${GH}`}
      style={{ background: '#05050f', borderRadius: 12, display: 'block' }}>

      {/* Grid lines at 0, π/2, π, 3π/2, 2π */}
      {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, TWO_PI].map((x, i) => (
        <g key={i}>
          <line x1={gSX(x)} y1={0} x2={gSX(x)} y2={GH}
            stroke="#1e293b" strokeWidth={0.7} />
          <text x={gSX(x)} y={GH - 4} fill="#374151" fontSize={8} textAnchor="middle">
            {['0', 'π/2', 'π', '3π/2', '2π'][i]}
          </text>
        </g>
      ))}

      {/* x-axis */}
      <line x1={0} y1={GH / 2} x2={GW} y2={GH / 2} stroke="#2d3748" strokeWidth={1.2} />

      {/* y = 0 dashes at ±1 */}
      <line x1={0} y1={gSY(1)} x2={GW} y2={gSY(1)} stroke="#1e293b" strokeWidth={0.5} strokeDasharray="4 4" />
      <line x1={0} y1={gSY(-1)} x2={GW} y2={gSY(-1)} stroke="#1e293b" strokeWidth={0.5} strokeDasharray="4 4" />
      <text x={3} y={gSY(1) + 3} fill="#374151" fontSize={8}>1</text>
      <text x={3} y={gSY(-1) + 3} fill="#374151" fontSize={8}>-1</text>

      {/* cos x */}
      <path d={cosPts.join(' ')} stroke={colors.secondary} strokeWidth={1.8}
        fill="none" strokeDasharray="5 3" opacity={0.8} />

      {/* sin x */}
      <path d={sinPts.join(' ')} stroke={colors.primary} strokeWidth={2.2} fill="none" />

      {/* Tangent to sin */}
      <line x1={gSX(tx1)} y1={gSY(ty1)} x2={gSX(tx2)} y2={gSY(ty2)}
        stroke={colors.accent} strokeWidth={1.8} />

      {/* Point on sin */}
      <circle cx={sx} cy={gSY(sinY)} r={6}
        fill={colors.primary} stroke="white" strokeWidth={1.5} />

      {/* Vertical projections */}
      <line x1={sx} y1={gSY(sinY)} x2={sx} y2={gSY(cosY)}
        stroke={colors.accent} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
      <circle cx={sx} cy={gSY(cosY)} r={5}
        fill={colors.secondary} stroke="white" strokeWidth={1.5} />

      {/* Labels */}
      <text x={GW - 30} y={gSY(Math.sin(TWO_PI - 0.2)) - 6}
        fill={colors.primary} fontSize={10} fontWeight="600">sin x</text>
      <text x={GW - 30} y={gSY(Math.cos(TWO_PI - 0.2)) - 6}
        fill={colors.secondary} fontSize={10}>cos x</text>

      {/* Slope annotation */}
      <text x={sx + 8} y={gSY(sinY) - 8}
        fill={colors.accent} fontSize={9} fontWeight="600">
        slope = {cosY.toFixed(2)}
      </text>
    </svg>
  );
}

// ── Six trig proofs ───────────────────────────────────────────────────────────
const PROOFS = [
  {
    fn: '\\sin x',
    deriv: '\\cos x',
    color: colors.primary,
    note: 'Uses limit: lim(θ→0) sin(θ)/θ = 1',
    steps: [
      { label: 'δy', content: <BlockMath math={"\\delta y = \\sin(x+\\delta x) - \\sin x = 2\\cos\\!\\left(x+\\frac{\\delta x}{2}\\right)\\sin\\!\\left(\\frac{\\delta x}{2}\\right)"} /> },
      { label: 'Divide', content: <BlockMath math={"\\frac{\\delta y}{\\delta x} = \\cos\\!\\left(x + \\frac{\\delta x}{2}\\right) \\cdot \\frac{\\sin(\\delta x/2)}{\\delta x/2}"} /> },
      { label: 'Limit', content: <BlockMath math={"\\frac{dy}{dx} = \\cos x \\cdot 1 = \\cos x"} />, highlight: true },
    ],
  },
  {
    fn: '\\cos x',
    deriv: '-\\sin x',
    color: colors.secondary,
    note: 'Similar to sin — uses sum-to-product identity',
    steps: [
      { label: 'δy', content: <BlockMath math={"\\delta y = \\cos(x+\\delta x) - \\cos x = -2\\sin\\!\\left(x+\\frac{\\delta x}{2}\\right)\\sin\\!\\left(\\frac{\\delta x}{2}\\right)"} /> },
      { label: 'Limit', content: <BlockMath math={"\\frac{dy}{dx} = -\\sin x \\cdot 1 = -\\sin x"} />, highlight: true },
    ],
  },
  {
    fn: '\\tan x',
    deriv: '\\sec^2 x',
    color: colors.accent,
    note: 'Proved using quotient rule on sin x / cos x',
    steps: [
      { label: 'Write tan x = sin x / cos x', content: <span>Apply quotient rule with u = sin x, v = cos x.</span> },
      { label: 'Quotient rule', content: <BlockMath math={"\\frac{d}{dx}(\\tan x) = \\frac{\\cos x \\cdot \\cos x - \\sin x \\cdot (-\\sin x)}{\\cos^2 x}"} /> },
      { label: 'Simplify', content: <BlockMath math={"= \\frac{\\cos^2 x + \\sin^2 x}{\\cos^2 x} = \\frac{1}{\\cos^2 x} = \\sec^2 x"} />, highlight: true },
    ],
  },
  {
    fn: '\\cot x',
    deriv: '-\\text{cosec}^2 x',
    color: colors.phase3,
    note: 'Quotient rule on cos x / sin x',
    steps: [
      { label: 'Quotient rule', content: <BlockMath math={"\\frac{d}{dx}(\\cot x) = \\frac{\\sin x(-\\sin x) - \\cos x \\cdot \\cos x}{\\sin^2 x}"} /> },
      { label: 'Result', content: <BlockMath math={"= \\frac{-(\\sin^2 x + \\cos^2 x)}{\\sin^2 x} = \\frac{-1}{\\sin^2 x} = -\\text{cosec}^2 x"} />, highlight: true },
    ],
  },
  {
    fn: '\\sec x',
    deriv: '\\sec x \\tan x',
    color: colors.phase2,
    note: 'Quotient rule on 1/cos x',
    steps: [
      { label: 'd/dx(1/cos x)', content: <BlockMath math={"= \\frac{\\cos x \\cdot 0 - 1 \\cdot (-\\sin x)}{\\cos^2 x}"} /> },
      { label: 'Result', content: <BlockMath math={"= \\frac{\\sin x}{\\cos^2 x} = \\frac{1}{\\cos x}\\cdot\\frac{\\sin x}{\\cos x} = \\sec x \\tan x"} />, highlight: true },
    ],
  },
  {
    fn: '\\text{cosec}\\, x',
    deriv: '-\\text{cosec}\\, x \\cot x',
    color: colors.danger,
    note: 'Quotient rule on 1/sin x — negative because "co" function',
    steps: [
      { label: 'd/dx(1/sin x)', content: <BlockMath math={"= \\frac{\\sin x \\cdot 0 - 1 \\cdot \\cos x}{\\sin^2 x}"} /> },
      { label: 'Result', content: <BlockMath math={"= \\frac{-\\cos x}{\\sin^2 x} = -\\frac{1}{\\sin x}\\cdot\\frac{\\cos x}{\\sin x} = -\\text{cosec}\\,x\\cot x"} />, highlight: true },
    ],
  },
];

// ── Linear argument table ─────────────────────────────────────────────────────
const LINEAR_RULES = [
  { fn: '\\sin(ax+b)', d: 'a\\cos(ax+b)' },
  { fn: '\\cos(ax+b)', d: '-a\\sin(ax+b)' },
  { fn: '\\tan(ax+b)', d: 'a\\sec^2(ax+b)' },
  { fn: '\\cot(ax+b)', d: '-a\\text{cosec}^2(ax+b)' },
  { fn: '\\sec(ax+b)', d: 'a\\sec(ax+b)\\tan(ax+b)' },
  { fn: '\\text{cosec}(ax+b)', d: '-a\\text{cosec}(ax+b)\\cot(ax+b)' },
];

// ── Proof panel ───────────────────────────────────────────────────────────────
function ProofPanel({ proof }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border: `1px solid ${proof.color}30`,
      borderRadius: 12, overflow: 'hidden',
      background: `${proof.color}06`,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>
            <InlineMath math={`\\frac{d}{dx}(${proof.fn}) = ${proof.deriv}`} />
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: colors.muted }}>{proof.note}</span>
          <span style={{
            fontSize: 12, color: proof.color, fontWeight: 700,
            padding: '3px 10px', borderRadius: 6, background: `${proof.color}15`,
          }}>
            {open ? '▼ Hide' : '▶ Proof'}
          </span>
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {proof.steps.map((st, i) => (
            <div key={i} style={{
              padding: '10px 14px', marginBottom: 8,
              background: st.highlight ? `${proof.color}12` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${st.highlight ? proof.color + '35' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 8,
            }}>
              {st.label && <div style={{ fontSize: 11, color: colors.muted, marginBottom: 4,
                textTransform: 'uppercase', letterSpacing: 0.8 }}>{st.label}</div>}
              <div style={{ color: colors.text }}>{st.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function TrigDerivatives() {
  const [tab, setTab] = useState('watch');
  const [sliderX, setSliderX] = useState(Math.PI / 4);

  const sinVal = Math.sin(sliderX);
  const cosVal = Math.cos(sliderX);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: colors.phase1, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Topic 10 · Phase 1 — Foundations · XI §19.9
        </div>
        <h1 style={{ margin: 0, fontSize: 30, color: colors.text, fontWeight: 800, letterSpacing: -0.5 }}>
          Derivatives of Trig Functions
        </h1>
        <p style={{ margin: '8px 0 0', color: colors.muted, fontSize: 15, lineHeight: 1.6 }}>
          All six trig derivatives — with proofs from first principles and the quotient rule.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[
          { key: 'watch',   label: '▶ Watch' },
          { key: 'proofs',  label: '📐 All Proofs' },
          { key: 'linear',  label: '🔗 Linear Rule' },
          { key: 'quiz',    label: '🎯 Quiz' },
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

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Graph + slider */}
            <div style={{ flex: '1 1 300px' }}>
              <TrigGraph sliderX={sliderX} />
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  fontSize: 12, color: colors.muted, marginBottom: 6 }}>
                  <span>x = 0</span>
                  <span style={{ color: colors.primary, fontWeight: 700 }}>
                    x = {sliderX.toFixed(2)} rad ({(sliderX * 180 / Math.PI).toFixed(0)}°)
                  </span>
                  <span>x = 2π</span>
                </div>
                <input type="range" min={0} max={TWO_PI} step={0.01}
                  value={sliderX} onChange={e => setSliderX(Number(e.target.value))}
                  style={{ width: '100%', accentColor: colors.primary }} />
              </div>
              <div style={{ fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 6 }}>
                Move x — the tangent slope to sin x equals cos x at that point
              </div>
            </div>

            {/* Data panel */}
            <div style={{ flex: '1 1 240px', minWidth: 220 }}>

              <div style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, overflow: 'hidden', marginBottom: 16,
              }}>
                {[
                  { label: 'sin(x)', val: sinVal.toFixed(4), col: colors.primary },
                  { label: 'cos(x) = slope of sin', val: cosVal.toFixed(4), col: colors.secondary },
                  { label: 'd/dx(sin x)', val: `cos(x) = ${cosVal.toFixed(4)}`, col: colors.accent },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '10px 14px',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: i === 2 ? `${colors.accent}08` : 'transparent',
                  }}>
                    <span style={{ fontSize: 12, color: colors.muted }}>{row.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: row.col,
                      fontFamily: "'JetBrains Mono', monospace" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* Memory aid */}
              <div style={{
                background: `${colors.phase3}0e`,
                border: `1px solid ${colors.phase3}28`,
                borderRadius: 12, padding: 16, marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.phase3, marginBottom: 8 }}>
                  Memory Aid — XI §19.9
                </div>
                <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.8 }}>
                  "Derivatives of functions beginning with <strong style={{ color: colors.phase3 }}>'co'</strong> are negative"
                  <br />
                  <span style={{ fontSize: 12, color: colors.muted }}>
                    cos x → −sin x ✓<br />
                    cot x → −cosec²x ✓<br />
                    cosec x → −cosec x cot x ✓
                  </span>
                </div>
              </div>

              {/* Quick reference */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, overflow: 'hidden',
              }}>
                {PROOFS.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '8px 14px',
                    borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  }}>
                    <span style={{ fontSize: 12, color: colors.muted }}>
                      <InlineMath math={p.fn} />
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.color }}>
                      <InlineMath math={p.deriv} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ PROOFS TAB ════════════ */}
      {tab === 'proofs' && (
        <motion.div key="proofs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div style={{ marginBottom: 16, padding: '12px 16px',
            background: `${colors.phase1}0e`, border: `1px solid ${colors.phase1}25`,
            borderRadius: 10, fontSize: 13, color: colors.muted }}>
            All six trig derivatives — from <strong style={{ color: colors.phase1 }}>XI §19.9</strong>.
            Click ▶ Proof to expand any proof.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROOFS.map((p, i) => (
              <ProofPanel key={i} proof={p} />
            ))}
          </div>

          <div style={{
            marginTop: 20, padding: '14px 18px',
            background: `${colors.phase3}0a`, border: `1px solid ${colors.phase3}25`,
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.phase3, marginBottom: 8 }}>
              The Pattern
            </div>
            <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.8 }}>
              sin ↔ cos (swap, add minus for cos)<br />
              tan ↔ sec² (tan differentiated gives sec²)<br />
              cot ↔ cosec² (cot differentiated gives −cosec²)<br />
              sec ↔ sec·tan (sec differentiated gives sec·tan)<br />
              cosec ↔ cosec·cot (with minus sign)
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ LINEAR RULE TAB ════════════ */}
      {tab === 'linear' && (
        <motion.div key="linear" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <FormulaCard
            title="Linear Argument Rule — XI §19.9"
            formula={"\\frac{d}{dx}[\\sin(ax+b)] = a\\cos(ax+b)"}
            note="When the argument is linear (ax+b), multiply the result by a (the inner derivative)."
            accent={colors.primary}
          />

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.muted, marginBottom: 12 }}>
              All six — with linear argument:
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, overflow: 'hidden',
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                background: 'rgba(255,255,255,0.04)', padding: '10px 16px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted,
                  textTransform: 'uppercase', letterSpacing: 1 }}>Function</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.muted,
                  textTransform: 'uppercase', letterSpacing: 1 }}>Derivative</div>
              </div>
              {LINEAR_RULES.map((row, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  padding: '10px 16px',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ fontSize: 13, color: colors.text }}>
                    <InlineMath math={row.fn} />
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.accent }}>
                    <InlineMath math={row.d} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════ QUIZ TAB ════════════ */}
      {tab === 'quiz' && (
        <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <QuizCard
              question={<span>What is <InlineMath math="\frac{d}{dx}(\cos x)" />?</span>}
              options={['sin x', '−sin x', 'cos x', 'tan x']}
              correct={1}
              explanation="d/dx(cos x) = −sin x. Remember: 'co' functions have negative derivatives."
            />

            <QuizCard
              question={<span>What is <InlineMath math="\frac{d}{dx}(\tan x)" />?</span>}
              options={['sec x', 'sec²x', 'cosec²x', '−cosec²x']}
              correct={1}
              explanation="d/dx(tan x) = sec²x. Proved using quotient rule on sin x/cos x."
            />

            <QuizCard
              question={<span>What is <InlineMath math="\frac{d}{dx}[\sin(3x+5)]" />?</span>}
              options={['cos(3x+5)', '3cos(3x+5)', '−cos(3x+5)', '3sin(3x+5)']}
              correct={1}
              explanation="Linear argument rule: d/dx[sin(ax+b)] = a·cos(ax+b). Here a = 3."
            />

            <QuizCard
              question={<span>Which of these has derivative <InlineMath math="-\text{cosec}^2 x" />?</span>}
              options={['sin x', 'cos x', 'tan x', 'cot x']}
              correct={3}
              explanation="d/dx(cot x) = −cosec²x. Cot starts with 'co', so its derivative is negative."
            />

            <QuizCard
              question={<span>What is <InlineMath math="\frac{d}{dx}[\sec x]" />?</span>}
              options={['tan x', 'sec x tan x', 'cosec x cot x', 'sec²x']}
              correct={1}
              explanation="d/dx(sec x) = sec x · tan x. Proved using quotient rule on 1/cos x."
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
